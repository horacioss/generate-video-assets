import miniMaxService from "../services/miniMaxService";
import { extractStoryTellerParts } from "./contentUtils";
import { saveFile } from "./fileUtils";

export async function generateAndSaveAudio(folderPath: string, script: string): Promise<{ success: boolean }> {
    try {
        const scriptParts = extractStoryTellerParts(script);
        const audioData = await miniMaxService.generateMiniMaxAudio(scriptParts);
        const isSaved = await saveFile(folderPath, 'Dialogo.mp3', audioData.buffer);
        return { success: isSaved };
    } catch (error) {
        console.error('Error generating audio:', error);
        return { success: false };
    }
}