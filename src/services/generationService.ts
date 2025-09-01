import fs from 'fs/promises';
import path from 'path';
import { GenerateResponse, GeneratedImage, ImageErrorResponse } from '../types';
import { saveFile } from '../utils/fileUtils';
import { extractImagePrompts } from '../utils/contentUtils';
import imageFxService from './imageFxService';
import { getFolderPath } from '../utils/getFolderPath';
import { generateAndSaveAudio } from '../utils/generateAudio';

class GenerationService {
    async generateContent(
        title: string,
        scriptFromChatGPT: string,
        imageAspectRatio: string
    ): Promise<GenerateResponse> {
        try {
            const folderPath = await getFolderPath(title);
            const errors: string[] = [];

            // Generate audio
            try {
                const audioResult = await generateAndSaveAudio(folderPath, scriptFromChatGPT);
                if (!audioResult.success) {
                    errors.push('Audio generation failed');
                }
            } catch (error) {
                const errorMsg = `Audio generation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                errors.push(errorMsg);
                console.error(errorMsg);
            }

            // Generate images
            try {
                await this.generateAndSaveImages(folderPath, scriptFromChatGPT, imageAspectRatio);
            } catch (error) {
                const errorMsg = `Image generation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                errors.push(errorMsg);
                console.error(errorMsg);
            }

            if (errors.length > 0) {
                // Save errors to file
                await saveFile(folderPath, 'generation_errors.txt', errors.join('\n'));
            }

            return {
                success: errors.length === 0,
                folder: folderPath,
                error: errors.length > 0 ? errors.join('; ') : undefined
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
        const errors: string[] = [];
        
        if (imagePrompts.length === 0) {
            console.log('No image prompts found in the script');
            return { success: true };
        }

        // Process images sequentially to avoid rate limiting
        for (const imageObject of imagePrompts) {
            try {
                const images = await imageFxService.generateImages(imageObject, aspectRatio);
                
                if (Array.isArray(images)) {
                    // Save all generated images
                    for (let index = 0; index < images.length; index++) {
                        const generatedImage = images[index];
                        const imageBuffer = Buffer.from(generatedImage.encodedImage, 'base64');
                        const fileName = `${imageObject.imageKey}_${index + 1}.png`;
                        const saved = await saveFile(folderPath, fileName, imageBuffer);
                        
                        if (!saved) {
                            errors.push(`Failed to save ${fileName}`);
                        }
                    }
                } else {
                    // Handle error response
                    const errorMsg = `Failed to generate images for '${imageObject.imageKey}': ${
                        images.error?.message || 'Unknown error'
                    }`;
                    errors.push(errorMsg);
                    console.error(errorMsg);
                }
            } catch (error) {
                const errorMsg = `Error processing ${imageObject.imageKey}: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`;
                errors.push(errorMsg);
                console.error(errorMsg);
            }
        }

        // Save errors to file if any occurred
        if (errors.length > 0) {
            const errorFilePath = path.join(folderPath, 'image_generation_errors.txt');
            await fs.appendFile(errorFilePath, errors.join('\n') + '\n');
        }

        return { success: errors.length === 0 };
    }
}

export default new GenerationService();
