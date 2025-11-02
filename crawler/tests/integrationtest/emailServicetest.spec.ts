import test from "node:test";
import { EmailService } from "../../src/interfaces/out/email/emailService";
import * as fs from 'fs';

test('Email Service Integration Test', async () => {
  console.log('🚀 Starte Email Service Integration Test...');
  
  try {
    // Umgebungsvariablen prüfen
    console.log('📋 Überprüfe Umgebungsvariablen...');
    console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Gesetzt' : '❌ Nicht gesetzt'}`);
    console.log(`EMAIL_PASS: ${process.env.EMAIL_PASSWORD ? '✅ Gesetzt' : '❌ Nicht gesetzt'}`);
    console.log(`RECIPIENT_EMAIL: ${process.env.RECIPIENT_EMAIL ? '✅ Gesetzt' : '❌ Nicht gesetzt'}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.RECIPIENT_EMAIL) {
      throw new Error('❌ Nicht alle erforderlichen Umgebungsvariablen sind gesetzt!');
    }

    // EmailService erstellen
    console.log('🔧 Erstelle EmailService...');
    const emailService = new EmailService();

    // Verbindung testen
    console.log('🔗 Teste Email-Server Verbindung...');
    const connectionTest = await emailService.testConnection();
    if (!connectionTest) {
      throw new Error('❌ Email-Server Verbindung fehlgeschlagen!');
    }
    console.log('✅ Email-Server Verbindung erfolgreich');

    // Test-Datei erstellen
    const testFilePath = './temp-test-file.txt';
    const testContent = `Email Service Test\nDatum: ${new Date().toISOString()}\nTest erfolgreich!`;
    
    console.log('📄 Erstelle temporäre Test-Datei...');
    fs.writeFileSync(testFilePath, testContent, 'utf8');

    // Email senden
    console.log('📧 Sende Test-Email...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `🧪 Email Service Integration Test - ${new Date().toLocaleString('de-DE')}`,
      text: 'Dies ist ein automatisierter Test des Email-Service.\n\nWenn Sie diese Email erhalten, funktioniert der Service korrekt!'
    };

    const emailSent = await emailService.sendEmail(testFilePath, mailOptions);
    
    // Aufräumen
    console.log('🧹 Räume temporäre Datei auf...');
    fs.unlinkSync(testFilePath);
    
    if (emailSent) {
      console.log('✅ Email Service Integration Test ERFOLGREICH!');
      console.log(`📬 Email wurde an ${process.env.RECIPIENT_EMAIL} gesendet`);
    } else {
      throw new Error('❌ Email konnte nicht gesendet werden');
    }

  } catch (error) {
    console.error('💥 Email Service Integration Test FEHLGESCHLAGEN:', error);
    process.exit(1);
  }
})