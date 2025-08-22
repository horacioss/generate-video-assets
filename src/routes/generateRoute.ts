import express, { Request, Response } from 'express';
import { GenerateRequest, GenerateResponse } from '../types';
import generationService from '../services/generationService';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, GenerateRequest>, res: Response<GenerateResponse>) => {
    try {
        const { title, scriptFromChatGPT, imageFXToken, imageAspectRatio } = req.body;
        if (!title) {
            return res.status(400).json({ 
                success: false, 
                error: 'Title is required' 
            });
        }

        const result = await generationService.generateContent(title, scriptFromChatGPT, imageFXToken, imageAspectRatio);
        res.json({ 
            ...result, 
            message: 'Generation completed successfully' 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'An error occurred during generation'
        });
    }
});

export default router;
