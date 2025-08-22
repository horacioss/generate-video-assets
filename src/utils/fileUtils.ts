import fs from 'fs/promises';
import path from 'path';

export async function ensureDir(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

export async function saveFile(dirPath: string, filename: string, data: Buffer | string): Promise<void> {
    const filePath = path.join(dirPath, filename);
    await fs.writeFile(filePath, data);
}
