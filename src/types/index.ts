// Request & Response Types
export interface GenerateRequest {
    title: string;
    scriptFromChatGPT?: string;
    imageAspectRatio: string;
}

export interface AudioGenerationRequest {
    title: string;
    script: string;
}

export interface AudioGenerationResponse {
    success: boolean;
    error?: string;
    message?: string;
}

export interface ImageGenerationRequest {
    title: string;
    prompts: string;
    aspectRatio: string;
}

export interface ImageGenerationResponse {
    success: boolean;
    error?: string;
    message?: string;
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

export interface MiniMaxConfig {
    endpoint: string;
    apiKey: string;
    groupId: string;
}

export interface ApiConfig {
    gemini: GeminiConfig;
    elevenLabs: ElevenLabsConfig;
    imageFx: ImageFxConfig;
    minimax: MiniMaxConfig;
}

export interface Config {
    port: number;
    apis: ApiConfig;
}

// Service Types

export interface AudioResponse {
  data: {
    audio: string,
    status: number,
    ced: string
  }
  extra_info: {
    audio_length: number,
    audio_sample_rate: number,
    audio_size: number,
    bitrate: number,
    word_count: number,
    invisible_character_ratio: number,
    usage_characters: number,
    audio_format: string,
    audio_channel: 1
  },
  trace_id: string,
  base_resp: {
    status_code: number,
    status_msg: string
  }
}

export interface AudioData {
    buffer: Buffer;
}

export interface ImageObjectType {
    imageKey: string;
    promptText: string;
}

export interface ImageData {
    buffer: Buffer;
}

export interface GeneratedImage {
    encodedImage: string;
    seed: number;
    mediaGenerationId: string;
    prompt: string;
    modelNameType: string;
    workflowId: string;
    fingerprintLogRecordId: string;
    aspectRatio: string;
}

export interface ImagePanel {
    prompt: string;
    generatedImages: GeneratedImage[]
}

export interface ImageGenerationResult {
    imagePanels: ImagePanel[]
}

export interface ImageErrorResponse {
  error: {
    code: number,
    message: string,
    status: string,
    details: [
      {
        "@type": string,
        reason: string
      }
    ]
  }
}
