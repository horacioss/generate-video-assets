import fetch from 'node-fetch';
import config from '../config/config';
import { AudioData } from '../types';

class GeminiTTS {
    async generateGeminiAudio(text: string): Promise<AudioData> {
        try {
            const response = await fetch(config.apis.gemini.ttsEndoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': config.apis.gemini.apiKey
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Deep voice: ${text}`
                        }]
                    }],
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: "Algieba"
                                }
                            }
                        }
                    },
                    "model": "gemini-2.5-flash-preview-tts"
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini TTS API request failed: ${response.statusText}`);
            }

            const audioBuffer = await response.buffer();
            return {
                buffer: audioBuffer
            };
        } catch (error) {
            throw new Error(`Audio generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default new GeminiTTS();
