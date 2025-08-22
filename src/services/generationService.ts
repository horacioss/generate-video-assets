import path from 'path';
import { GenerateResponse, AudioData, ImageData } from '../types';
import { ensureDir, saveFile } from '../utils/fileUtils';
import { extractStoryTellerParts, extractImagePrompts } from '../utils/contentUtils';
import geminiTTS from './geminiTTS';
import imageFxService from './imageFxService';

class GenerationService {
    async generateContent(
        title: string, 
        scriptFromChatGPT: string = '', 
        imageFXToken?: string,
        imageAspectRatio?: string
    ): Promise<GenerateResponse> {
        try {
            const folderName = this._sanitizeFolderName(title);
            const userProfileDir = process.env.USERPROFILE || process.env.HOME || process.cwd();
            const baseDir = path.join(userProfileDir, 'Documents', 'Videos Cicatrices de la Historia');
            const folderPath = path.join(baseDir, folderName);
            await ensureDir(folderPath);

            // Generate audio
            const audioData = await this._generateAndSaveAudio(folderPath, scriptFromChatGPT);

            // Generate images
            await this._generateAndSaveImages(folderPath, scriptFromChatGPT, imageFXToken, imageAspectRatio);

            return {
                success: true,
                folder: folderName,
                audioPath: `${folderName}/Dialog.wav`,
                audioMetadata: {
                    format: 'wav',
                    contentType: 'audio/wav',
                    bufferLength: audioData.buffer.length
                }
            };
        } catch (error) {
            throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private _sanitizeFolderName(title: string): string {
        return title.replace(/[^a-zA-Z0-9]/g, '_');
    }

    private async _generateAndSaveAudio(folderPath: string, script: string): Promise<AudioData> {
        const storyTellerText = extractStoryTellerParts(script);
        const audioData = await geminiTTS.generateGeminiAudio(storyTellerText);
        await saveFile(folderPath, 'Dialog.wav', audioData.buffer);
        return audioData;
    }

    private async _generateAndSaveImages(
        folderPath: string, 
        script: string, 
        token?: string,
        aspectRatio?: string
    ): Promise<void> {
        const imagePrompts = extractImagePrompts(script);
        for (let i = 0; i < imagePrompts.length; i++) {
            const images = await imageFxService.generateImages(imagePrompts[i], token, aspectRatio);
            for (let j = 0; j < images.length; j++) {
                await saveFile(folderPath, `image_${i + 1}_${j + 1}.png`, images[j].buffer);
            }
        }
    }
}

export default new GenerationService();
