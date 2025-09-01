import fs from 'fs/promises';
import { GenerateResponse } from '../types';
import { saveFile } from '../utils/fileUtils';
import { extractImagePrompts } from '../utils/contentUtils';
import imageFxService from './imageFxService';
import { getFolderPath } from '../utils/getFolderPath';
import { generateAndSaveAudio } from '../utils/generateAudio';

class GenerationService {
    async generateContent(
        title: string,
        scriptFromChatGPT: string = '',
        imageAspectRatio: string
    ): Promise<GenerateResponse> {
        try {
            const folderPath = await getFolderPath(title);

            // Generate audio
            await generateAndSaveAudio(folderPath, scriptFromChatGPT);

            // Generate images
            await this.generateAndSaveImages(folderPath, scriptFromChatGPT, imageAspectRatio);

            return {
                success: true
            };
        } catch (error) {
            throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async generateAndSaveImages(
        folderPath: string,
        script: string,
        aspectRatio: string
    ): Promise<{ success: boolean }> {
        const imagePrompts = extractImagePrompts(script);
        if (imagePrompts.length > 0) {
            imagePrompts.forEach(async (imageObject) => {
                const images = await imageFxService.generateImages(imageObject, aspectRatio);
                if (Array.isArray(images)) {
                    images.forEach(async (generatedImage, index) => {
                        await saveFile(folderPath, `${imageObject.imageKey}_${index + 1}.png`, Buffer.from(generatedImage.encodedImage, 'base64'))
                    });
                } else {
                    await fs.appendFile(`${folderPath}/Errores.txt`, `'${imageObject.imageKey}' no Creadas ${images.error.toString()}.\n`);
                }
            }
            );
        }
        return { success: true };
    }
}

export default new GenerationService();
