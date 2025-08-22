// Request & Response Types
export interface GenerateRequest {
    title: string;
    scriptFromChatGPT?: string;
    imageFXToken?: string;
    imageAspectRatio?: string;
}

export interface AudioMetadata {
    format: string;
    contentType: string;
    bufferLength: number;
}

export interface GenerateResponse {
    success: boolean;
    folder?: string;
    audioPath?: string;
    audioMetadata?: AudioMetadata;
    error?: string;
    message?: string;
}

// Configuration Types
export interface GeminiConfig {
    endpoint: string;
    ttsEndoint: string;
    apiKey: string;
}

export interface ElevenLabsConfig {
    endpoint: string;
    apiKey: string;
    voiceId: string;
}

export interface ImageFxConfig {
    endpoint: string;
    apiKey: string;
}

export interface ApiConfig {
    gemini: GeminiConfig;
    elevenLabs: ElevenLabsConfig;
    imageFx: ImageFxConfig;
}

export interface Config {
    port: number;
    apis: ApiConfig;
}

// Service Types
export interface AudioData {
    buffer: Buffer;
}

export interface ImageData {
    buffer: Buffer;
}

export interface ImageGenerationResult {
    images: ImageData[];
}
