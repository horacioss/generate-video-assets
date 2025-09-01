import express, { Request, Response } from 'express';
import { AudioGenerationRequest, AudioGenerationResponse, GenerateRequest, GenerateResponse, ImageGenerationRequest, ImageGenerationResponse } from '../types';
import generationService from '../services/generationService';
import { generateAndSaveAudio } from '../utils/generateAudio';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, GenerateRequest>, res: Response<GenerateResponse>) => {
    try {
        const { title, scriptFromChatGPT, imageAspectRatio } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        const result = await generationService.generateContent(title, scriptFromChatGPT, imageAspectRatio);
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

router.post('/generate/audio', async (req: Request<{}, {}, AudioGenerationRequest>, res: Response<AudioGenerationResponse>) => {
    try {
        const { title, script } = req.body;
        if (!script || script.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'El guion es obligatorio'
            });
        } else if (!title) {
            return res.status(400).json({
                success: false,
                error: 'El título es obligatorio'
            });
        }

        const result = await generateAndSaveAudio(title, script);
        res.json({
            ...result,
            message: 'Audio generation completed successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred during audio generation'
        });
    }
});

router.post('/generate/images', async (req: Request<{}, {}, ImageGenerationRequest>, res: Response<ImageGenerationResponse>) => {
    try {
        const { title, prompts, aspectRatio } = req.body;
        if (!prompts) {
            return res.status(400).json({
                success: false,
                error: 'Prompts are required'
            });
        }

        const result = await generationService.generateAndSaveImages(title, prompts, aspectRatio);
        res.json({
            ...result,
            message: 'Image generation completed successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred during image generation'
        });
    }
});

export default router;
