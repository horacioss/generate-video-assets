import express, { Request, Response } from 'express';
import { AudioGenerationRequest, AudioGenerationResponse } from '../types';
import { generateAndSaveAudio } from '../utils/generateAudio';
import { getFolderPath } from '../utils/getFolderPath';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, AudioGenerationRequest>, res: Response<AudioGenerationResponse>) => {
    try {
        const { title, script } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        if (!script || script.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Script is required'
            });
        }

        const folderPath = await getFolderPath(title.trim());
        const result = await generateAndSaveAudio(folderPath, script.trim());
        
        res.json({
            ...result,
            message: result.success ? 'Audio generation completed successfully' : 'Audio generation failed'
        });

    } catch (error) {
        console.error('Audio generation error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred during audio generation'
        });
    }
});

export default router;
