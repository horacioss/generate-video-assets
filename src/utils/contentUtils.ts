import { ImageObjectType } from "../types";

export function extractStoryTellerParts(content: string): string {
    const lines = content.split('\n');

    if(content.includes("StoryTeller")) {
        const storyTellerParts: string[] = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('StoryTeller:')) {
                storyTellerParts.push(line.substring('StoryTeller:'.length).trim());
            }
        }
        return storyTellerParts.join(' <#1#>\n');
    } else {
        return lines.join(" <#1#>\n");
    }
}

export function extractImagePrompts(content: string): ImageObjectType[] {
    const imagePrompts: ImageObjectType[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const keyRegex = /(ImagePrompt\d{1,})/
        const prompTextRegex = /ImagePrompt\d+\:(.*)/
        const imageKey = keyRegex.exec(line)
        if (imageKey) {
            const promptText = prompTextRegex.exec(line);
            if (promptText) {
                imagePrompts.push({ imageKey: imageKey[0], promptText: promptText[1] });
            }
        }
    }
    
    return imagePrompts;
}
