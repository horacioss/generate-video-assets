import dotenv from 'dotenv';
import { Config } from '../types';

dotenv.config();

const config: Config = {

    port: parseInt(process.env.PORT || '3000', 10),
    apis: {
        imageFx: {
            endpoint: process.env.IMAGEFX_API_ENDPOINT || '',
            apiKey: process.env.IMAGEFX_API_KEY || '',
        },
        minimax: {
            endpoint: process.env.MINIMAX_ENDPOINT || '',
            apiKey: process.env.MINIMAX_API_KEY || '',
            groupId: process.env.MINIMAX_GROUP_ID || '',
        }
    }
};

export default config;
