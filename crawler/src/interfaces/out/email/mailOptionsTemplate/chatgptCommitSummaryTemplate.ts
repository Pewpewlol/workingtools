
import * as nodemailer from 'nodemailer';


export function chatgptCommitSummaryMailOptions(recipient: string, rechnungPath: string, fileName: string): nodemailer.SendMailOptions {
    const currentDate = new Date().toLocaleDateString('de-DE');
    return {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `Leistungsnachweis Summary- ${currentDate}`,
        html: `
          <h2>Leistungsnachweis Summary</h2>
          <p>Hallo,</p>
          <p>anbei hier, der Leristungsnachweis:</p>
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