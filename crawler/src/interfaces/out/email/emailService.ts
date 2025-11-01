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
  
  async sendFehlerEmail(mailOptions: nodemailer.SendMailOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Fehler-Email erfolgreich gesendet:', info.messageId);
      return true;
    } catch (error) {
      console.error('Fehler beim Senden der Fehler-Email:', error);
      return false;
    }
  }

  async sendEmail(attachmentPath: string, mailOptions: nodemailer.SendMailOptions): Promise<boolean> {
    try {
      // Prüfen ob die Datei existiert
      if (!fs.existsSync(attachmentPath)) {
        console.error(`Datei nicht gefunden: ${attachmentPath}`);
        return false;
      }

      const fileName = path.basename(attachmentPath);

      mailOptions.attachments = [
        {
          filename: fileName,
          path: attachmentPath
        }
      ];

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