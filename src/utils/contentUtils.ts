export function extractStoryTellerParts(content: string): string {
    const storyTellerParts: string[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('StoryTeller:')) {
            storyTellerParts.push(line.substring('StoryTeller:'.length).trim());
        }
    }
    
    return storyTellerParts.join('\n');
}

export function extractImagePrompts(content: string): string[] {
    const imagePrompts: string[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('ImagePromt')) {
            const prompt = line.substring(line.indexOf(':') + 1).trim();
            if (prompt) {
                imagePrompts.push(prompt);
            }
        }
    }
    
    return imagePrompts;
}
