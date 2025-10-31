import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  async sendFehlerEmail(errorMessage: string, recipient: string): Promise<boolean> {
    try {
      const currentDate = new Date().toLocaleDateString('de-DE');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `Fehler bei Urban Sports Club Rechnung - ${currentDate}`,
        html: `
          <h2>Fehler bei der Urban Sports Club Rechnung</h2>
          <p>Hallo,</p>
          <p>es gab einen Fehler beim Herunterladen der Urban Sports Club Rechnung:</p>
          <pre>${errorMessage}</pre>
          <p>Diese E-Mail wurde automatisch generiert.</p>
          <br>
          <p>Viele Grüße</p>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Fehler-Email erfolgreich gesendet:', info.messageId);
      return true;
    } catch (error) {
      console.error('Fehler beim Senden der Fehler-Email:', error);
      return false;
    }
  }

  async sendRechnungEmail(rechnungPath: string, recipient: string): Promise<boolean> {
    try {
      // Prüfen ob die Datei existiert
      if (!fs.existsSync(rechnungPath)) {
        console.error(`Rechnung nicht gefunden: ${rechnungPath}`);
        return false;
      }

      const fileName = path.basename(rechnungPath);
      const currentDate = new Date().toLocaleDateString('de-DE');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `Urban Sports Club Rechnung - ${currentDate}`,
        html: `
          <h2>Urban Sports Club Rechnung</h2>
          <p>Hallo,</p>
          <p>anbei hier, die Rechnung:</p>
          <p><strong>Datei:</strong> ${fileName}</p>
          <p><strong>Heruntergeladen am:</strong> ${currentDate}</p>
        `,
        attachments: [
          {
            filename: fileName,
            path: rechnungPath
          }
        ]
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email erfolgreich gesendet:', info.messageId);
      return true;
    } catch (error) {
      console.error('Fehler beim Senden der Email:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email-Server Verbindung erfolgreich');
      return true;
    } catch (error) {
      console.error('Email-Server Verbindung fehlgeschlagen:', error);
      return false;
    }
  }
}