import test from "node:test";
import assert from "node:assert";
import { extractStoryTellerParts, extractImagePrompts, validateScriptFormat } from "../../src/utils/contentUtils";

test('extractStoryTellerParts - basic extraction', (t) => {
    const script = `Escena1
StoryTeller: This is the first part.
ImagePrompt1: A beautiful landscape
StoryTeller: This is the second part.`;

    const result = extractStoryTellerParts(script);
    assert.strictEqual(result, 'This is the first part. <#1#>\nThis is the second part.');
});

test('extractStoryTellerParts - case insensitive', (t) => {
    const script = `Escena1
    storyteller: Lower case test.
    STORYTELLER: Upper case test.
    Another line without storyteller. With more text.
    ImagePrompt1: An image prompt
    StoryTeller:
    This line should be included.
    Random line without key.
    StoryTeller:
    `;


    const result = extractStoryTellerParts(script);
    console.log(`Result of extraction: ${result}`);
    assert.strictEqual(result, 'Lower case test. <#1#>\nUpper case test. <#1#>\nAnother line without storyteller. With more text.');
});

test('extractStoryTellerParts - no storyteller format', (t) => {
    const script = `Line 1.
Line 2.
Line 3.`;

    const result = extractStoryTellerParts(script);
    assert.strictEqual(result, 'Line 1. <#1#>\nLine 2. <#1#>\nLine 3.');
});

test('extractStoryTellerParts - empty content', (t) => {
    const result = extractStoryTellerParts('');
    assert.strictEqual(result, '');
});

test('extractImagePrompts - basic extraction', (t) => {
    const script = `Escena1
StoryTeller: Some text
ImagePrompt1: First image description
ImagePrompt2: Second image description`;

    const result = extractImagePrompts(script);
    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result[0], {
        imageKey: 'ImagePrompt1',
        promptText: 'First image description'
    });
    assert.deepStrictEqual(result[1], {
        imageKey: 'ImagePrompt2',
        promptText: 'Second image description'
    });
});

test('extractImagePrompts - case insensitive', (t) => {
    const script = `imageprompt1: Lower case test
IMAGEPROMPT2: Upper case test`;

    const result = extractImagePrompts(script);
    assert.strictEqual(result.length, 2);
});

test('extractImagePrompts - empty content', (t) => {
    const result = extractImagePrompts('');
    assert.strictEqual(result.length, 0);
});

test('extractImagePrompts - no image prompts', (t) => {
    const script = `Just some regular text
Without any image prompts`;

    const result = extractImagePrompts(script);
    assert.strictEqual(result.length, 0);
});

test('validateScriptFormat - valid script with both', (t) => {
    const script = `Escena1
StoryTeller: Some narration
ImagePrompt1: An image`;

    const result = validateScriptFormat(script);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.hasStoryTeller, true);
    assert.strictEqual(result.hasImagePrompts, true);
    assert.strictEqual(result.errors.length, 0);
});

test('validateScriptFormat - valid script with only storyteller', (t) => {
    const script = `StoryTeller: Some narration`;

    const result = validateScriptFormat(script);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.hasStoryTeller, true);
    assert.strictEqual(result.hasImagePrompts, false);
});

test('validateScriptFormat - empty content', (t) => {
    const result = validateScriptFormat('');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.errors.length, 1);
    assert.strictEqual(result.errors[0], 'Script content is empty');
});

test('validateScriptFormat - invalid format', (t) => {
    const script = `Just some random text
Without proper formatting`;

    const result = validateScriptFormat(script);
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.hasStoryTeller, false);
    assert.strictEqual(result.hasImagePrompts, false);
    assert.strictEqual(result.errors.length, 1);
});
