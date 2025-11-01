import * as nodemailer from 'nodemailer';

export const chatgptErrorMailOptions = (errorMessage: string, recipient: string): nodemailer.SendMailOptions => {
    const currentDate = new Date().toLocaleDateString('de-DE');
    return {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `Fehler bei ChatGPT - ${currentDate}`,
        html: `
          <h2>Fehler bei ChatGPT</h2>
          <p>Hallo,</p>
          <p>es gab einen Fehler beim Herunterladen der ChatGPT Rechnung:</p>
          <pre>${errorMessage}</pre>
          <p>Diese E-Mail wurde automatisch generiert.</p>
          <br>
          <p>Viele Grüße</p>
        `
      };
}