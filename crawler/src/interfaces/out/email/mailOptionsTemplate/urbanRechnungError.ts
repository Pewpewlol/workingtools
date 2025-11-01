import * as nodemailer from 'nodemailer';

export const urbanErrorMailOptions = (errorMessage: string, recipient: string): nodemailer.SendMailOptions => {
    const currentDate = new Date().toLocaleDateString('de-DE');
    return {
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
}