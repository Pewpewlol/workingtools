import { test, expect } from '@playwright/test';
import { FileChecker } from '../src/file/file';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('Urban Rechnungen', async ({ page }) => {

  await page.goto('https://urbansportsclub.com/de/');
  await page.waitForTimeout(3000);
  await page.getByRole('link', { name: 'Anmelden' }).click();
  await page.waitForTimeout(3000);
  await page.getByPlaceholder('E-Mail *').fill('sandip.nijjar17@gmail.com');
  await page.getByRole('textbox', { name: 'Passwort' }).fill('Fischfutter44.');
  await page.getByRole('button', { name: 'Anmelden' }).click();
  await page.waitForTimeout(5000);
  await page.goto('https://urbansportsclub.com/de/profile/payment-history');
  await page.getByRole('button', { name: 'Akzeptieren' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Sandip' }).getByRole('link').nth(1).click();
  await page.getByRole('link', { name: 'Dein Konto' }).click();
  await page.getByRole('link', { name: 'Rechnungsübersicht' }).click();
  const page1Promise = page.waitForEvent('popup');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Rechnung herunterladen' }).first().click();
  const page1 = await page1Promise;
  await page1.pause();
  const download = await downloadPromise;
  download.saveAs('./urbanrechnung/Rechnung.pdf');
  await wait(3000);
  FileChecker.doesFileExist('./urbanrechnung/Rechnung.pdf');

  
});
