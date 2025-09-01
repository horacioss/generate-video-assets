import path from "path";
import { ensureDir } from "./fileUtils";

export async function getFolderPath(title: string): Promise<string> {

    const folderName = title.replace(/[^a-zA-Z0-9]/g, '_');
    const userProfileDir = process.env.USERPROFILE || process.env.HOME || process.cwd();
    const baseDir = path.join(userProfileDir, 'Documents', 'Videos Cicatrices de la Historia');
    const folderPath = path.join(baseDir, folderName);
    await ensureDir(folderPath);

    return folderPath;
}