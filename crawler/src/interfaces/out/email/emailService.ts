import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private emailUser: string = '';
  private emailPassword: string = '';

  constructor(emailUser?: string, emailPassword?: string) {
    // Email-Konfiguration setzen
    this.emailUser = emailUser || process.env.EMAIL_USER || '';
    this.emailPassword = emailPassword || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || '';
    
    if (!this.emailUser || this.emailUser === '') {
      throw new Error("❌ EMAIL_USER ist nicht gesetzt");
    }
    if (!this.emailPassword || this.emailPassword === '') {
      throw new Error("❌ EMAIL_PASS/EMAIL_PASSWORD ist nicht gesetzt");
    }

    console.log(`📧 Email-Service initialisiert.`);
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.emailUser,
        pass: this.emailPassword
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