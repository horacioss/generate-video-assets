import fetch from 'node-fetch';
import config from '../config/config';
import { AudioData, AudioResponse } from '../types';

class MiniMaxService {
    async generateMiniMaxAudio(text: string): Promise<AudioData> {
        try {
            const response = await fetch(`${config.apis.minimax.endpoint}?GroupId=${config.apis.minimax.groupId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apis.minimax.apiKey}`
                },
                body: JSON.stringify({
                    model: "speech-2.5-hd-preview",
                    text: text,
                    stream: false,
                    voice_setting: {
                        voice_id: "moss_audio_b34b1a74-7eca-11f0-b8a3-f23a2390215a",
                        speed: 1.05,
                        vol: 1,
                        pitch: 0
                    },
                    audio_setting: {
                        sample_rate: 32000,
                        bitrate: 128000,
                        format: "mp3",
                        channel: 1
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Minimax API request failed: ${response.statusText}`);
            }

            const jsonResponse: AudioResponse = await response.json();
            const audioBuffer = Buffer.from(jsonResponse.data.audio, 'hex');

            return {
                buffer: audioBuffer
            };
        } catch (error) {
            throw new Error(`Audio generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default new MiniMaxService();