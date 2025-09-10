import miniMaxService from "../services/miniMaxService";
import { extractStoryTellerParts } from "./contentUtils";
import { saveFile } from "./fileUtils";
import fs from "fs/promises";
import path from "path";

async function getAvailableFilename(folderPath: string, baseName: string, ext: string): Promise<string> {
    let filename = `${baseName}${ext}`;
    let counter = 0;
    while (true) {
        try {
            await fs.access(path.join(folderPath, filename));
            counter++;
            filename = `${baseName}_${counter}${ext}`;
        } catch {
            return filename;
        }
    }
}

export async function generateAndSaveAudio(folderPath: string, script: string): Promise<{ success: boolean }> {
    try {
        const scriptParts = extractStoryTellerParts(script);
        const audioData = await miniMaxService.generateMiniMaxAudio(scriptParts);
        const filename = await getAvailableFilename(folderPath, "Dialogo", ".mp3");
        const isSaved = await saveFile(folderPath, filename, audioData.buffer);
        return { success: isSaved };
    } catch (error) {
        console.error('Error generating audio:', error);
        return { success: false };
    }
}
