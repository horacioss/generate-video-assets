import dotenv from 'dotenv';
import { Config } from '../types';

dotenv.config();

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    apis: {
        gemini: {
            endpoint: process.env.GEMINI_API_ENDPOINT || '',
            ttsEndoint: process.env.GEMINI_TTS_API_ENDPOINT || '',
            apiKey: process.env.GEMINI_API_KEY || ''
        },
        elevenLabs: {
            endpoint: process.env.ELEVENLABS_API_ENDPOINT || '',
            apiKey: process.env.ELEVENLABS_API_KEY || '',
            voiceId: process.env.ELEVENLABS_VOICE_ID || ''
        },
        imageFx: {
            endpoint: process.env.IMAGEFX_API_ENDPOINT || '',
            apiKey: process.env.IMAGEFX_API_KEY || ''
        }
    }
};

export default config;
