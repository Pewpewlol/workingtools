import * as nodemailer from 'nodemailer';


export function urbanRechnungMailOptions(recipient: string, rechnungPath: string, fileName: string): nodemailer.SendMailOptions {
    const currentDate = new Date().toLocaleDateString('de-DE');
    return {
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
      }
    }