import fetch from 'node-fetch';
import config from '../config/config';
import { GeneratedImage, ImageErrorResponse, ImageGenerationResult, ImageObjectType } from '../types';

class ImageFxService {
    async generateImages(prompt: ImageObjectType, aspectRatio?: string): Promise<GeneratedImage[] | ImageErrorResponse> {
        try {

            const headers: Record<string, string> = {
                'Accept': '*/*',
                'Content-Type': 'text/plain;charset=UTF-8',
                'Authorization': `Bearer ${config.apis.imageFx.apiKey}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
            };
            
            const payload = {
                method: 'POST',
                headers,
                body: JSON.stringify(
                    {
                        userInput: {
                            candidatesCount: 4,
                            prompts: [prompt.promptText],
                            seed: 173678
                        },
                        clientContext: {
                            sessionId: ";1755458504340",
                            tool: "IMAGE_FX"
                        },
                        modelInput: {
                            modelNameType: "IMAGEN_3_1"
                        },
                        aspectRatio: aspectRatio
                    }
                )
            }

            console.log('Sending request to ImageFx API with payload:', payload);

            const response = await fetch(config.apis.imageFx.endpoint, payload);

            if (!response.ok) {
                let jsonResponseError: ImageErrorResponse = await response.json();
                console.error(jsonResponseError)
                return jsonResponseError;
            } else {
                const data: ImageGenerationResult = await response.json();
                return data.imagePanels[0].generatedImages;
            }

        } catch (error) {
            throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
export default new ImageFxService();
