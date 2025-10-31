import { expect } from '@playwright/test';
import fs from 'fs';

export class FileChecker {
    static doesFileExist(file: string) {
        expect(file, 'File name is required');
        try {
            fs.accessSync(file, fs.constants.F_OK);
            expect(true).toBeTruthy();
        } catch (err) {
            expect(false).toBeTruthy();
        }                
    }
    static renameFile(oldFile: string, newFile: string) {
        expect(oldFile, 'Old file name is required');
        expect(newFile, 'New file name is required');
        fs.renameSync(oldFile, newFile);
    }
}
