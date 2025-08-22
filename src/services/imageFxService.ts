import fetch from 'node-fetch';
import config from '../config/config';
import { ImageData, ImageGenerationResult } from '../types';

class ImageFxService {
    async generateImages(prompt: string, token?: string, aspectRatio?: string): Promise<ImageData[]> {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'X-api-key': token || config.apis.imageFx.apiKey
            };

            const response = await fetch(config.apis.imageFx.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    prompt,
                    aspect_ratio: aspectRatio || '1:1',
                    num_images: 4
                })
            });

            if (!response.ok) {
                throw new Error(`ImageFx API request failed: ${response.statusText}`);
            }

            const data: ImageGenerationResult = await response.json();
            return data.images;
        } catch (error) {
            throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default new ImageFxService();
