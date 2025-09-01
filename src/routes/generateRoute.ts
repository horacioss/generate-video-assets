import express, { Request, Response } from 'express';
import { GenerateRequest, GenerateResponse } from '../types';
import generationService from '../services/generationService';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, GenerateRequest>, res: Response<GenerateResponse>) => {
    try {
        const { title, scriptFromChatGPT, imageAspectRatio } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        if (!scriptFromChatGPT || scriptFromChatGPT.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Script is required'
            });
        }

        const result = await generationService.generateContent(
            title.trim(), 
            scriptFromChatGPT.trim(), 
            imageAspectRatio || 'IMAGE_ASPECT_RATIO_LANDSCAPE'
        );
        
        res.json({
            ...result,
            message: 'Generation completed successfully'
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred during generation'
        });
    }
});

export default router;
