import { expect } from '@playwright/test';
import fs from 'fs';

export class FileChecker {
    static doesFileExist(file: string): boolean {
        expect(file, 'File name is required').toBeTruthy();
        try {
            fs.accessSync(file, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }                
    }
    static renameFile(oldFile: string, newFile: string) {
        expect(oldFile, 'Old file name is required');
        expect(newFile, 'New file name is required');
        fs.renameSync(oldFile, newFile);
    }
}
