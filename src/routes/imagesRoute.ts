import express, { Request, Response } from 'express';
import { ImageGenerationRequest, ImageGenerationResponse } from '../types';
import generationService from '../services/generationService';
import { getFolderPath } from '../utils/getFolderPath';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, ImageGenerationRequest>, res: Response<ImageGenerationResponse>) => {
    try {
        const { title, prompts, aspectRatio } = req.body;
        
        if (!prompts || prompts.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Image prompts are required'
            });
        }

        // If title is not provided, use a default folder
        const folderName = title && title.trim() !== '' ? title.trim() : 'GeneratedImages';
        const folderPath = await getFolderPath(folderName);
        
        const result = await generationService.generateAndSaveImages(
            folderPath, 
            prompts.trim(), 
            aspectRatio || 'IMAGE_ASPECT_RATIO_LANDSCAPE'
        );
        
        res.json({
            ...result,
            message: 'Image generation completed successfully'
        });

    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred during image generation'
        });
    }
});

export default router;
