import { ImageObjectType } from "../types";

/**
 * Extracts StoryTeller parts from the content and joins them with a separator
 * @param content - The script content
 * @returns The extracted and joined storyteller parts
 */
export function extractStoryTellerParts(content: string): string {
    if (!content || content.trim() === '') {
        return '';
    }

    const lines = content.split('\n');
    const separator = ' <#1#>\n';

    // Check if content contains StoryTeller format
    if (content.toLowerCase().includes("storyteller")) {
        const storyTellerParts: string[] = [];
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Case-insensitive match for StoryTeller
            if (trimmedLine.match(/^storyteller:/i)) {
                const textPart = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
                if (textPart) {
                    storyTellerParts.push(textPart);
                }
            }
        }
        
        return storyTellerParts.length > 0 
            ? storyTellerParts.join(separator)
            : lines.filter(line => line.trim()).join(separator);
    } else {
        // If no StoryTeller format, join all non-empty lines
        return lines.filter(line => line.trim()).join(separator);
    }
}

/**
 * Extracts image prompts from the content
 * @param content - The script content containing image prompts
 * @returns Array of image prompt objects
 */
export function extractImagePrompts(content: string): ImageObjectType[] {
    if (!content || content.trim() === '') {
        return [];
    }

    const imagePrompts: ImageObjectType[] = [];
    const lines = content.split('\n');
    
    // Improved regex patterns for better matching
    const keyRegex = /^(ImagePrompt\d+):/i;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        const match = keyRegex.exec(trimmedLine);
        
        if (match) {
            const imageKey = match[1];
            // Extract the text after the colon
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex !== -1) {
                const promptText = trimmedLine.substring(colonIndex + 1).trim();
                
                if (promptText) {
                    imagePrompts.push({ 
                        imageKey: imageKey, 
                        promptText: promptText 
                    });
                }
            }
        }
    }
    
    return imagePrompts;
}

/**
 * Validates if a script has the expected format
 * @param content - The script content to validate
 * @returns Object with validation result and any errors
 */
export function validateScriptFormat(content: string): { 
    isValid: boolean; 
    errors: string[];
    hasStoryTeller: boolean;
    hasImagePrompts: boolean;
} {
    const errors: string[] = [];
    
    if (!content || content.trim() === '') {
        errors.push('Script content is empty');
        return {
            isValid: false,
            errors,
            hasStoryTeller: false,
            hasImagePrompts: false
        };
    }

    const hasStoryTeller = content.toLowerCase().includes('storyteller:');
    const imagePrompts = extractImagePrompts(content);
    const hasImagePrompts = imagePrompts.length > 0;

    if (!hasStoryTeller && !hasImagePrompts) {
        errors.push('Script should contain either StoryTeller parts or ImagePrompt entries');
    }

    return {
        isValid: errors.length === 0,
        errors,
        hasStoryTeller,
        hasImagePrompts
    };
}
