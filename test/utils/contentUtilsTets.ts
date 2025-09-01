import test from "node:test";
import { extractStoryTellerParts, extractImagePrompts } from "../../src/utils/contentUtils";

test('extractStoryTellerParts', (t) => {
    const script = `Escena1
Storyteller: Prueba de texto.
ImagePrompt1: ....`;

    const result = extractStoryTellerParts(script);
    t.assert.equal(result,  'Prueba de texto.');
});
