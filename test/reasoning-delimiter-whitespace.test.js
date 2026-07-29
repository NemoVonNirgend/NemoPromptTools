import test from 'node:test';
import assert from 'node:assert/strict';

import { NemoNetReasoningParser } from '../reasoning/reasoning-capture-core.js';

const parser = new NemoNetReasoningParser({}, {
    getNativeParser: () => input => {
        const match = input.match(/^\s*<([a-z]+)>([\s\S]*?)<\/\1>([\s\S]+)$/i);
        if (!match) return { reasoning: '', content: input };
        return {
            reasoning: match[2].trim(),
            content: match[3].trim(),
        };
    },
    getNativeDelimiters: () => [],
});

const delimiterCases = [
    ['plan', '<plan>', '</plan>'],
    ['planning', '<planning>', '</planning>'],
    ['think', '<think>', '</think>'],
    ['thinking', '<thinking>', '</thinking>'],
    ['analysis', '<analysis>', '</analysis>'],
    ['reasoning', '<reasoning>', '</reasoning>'],
    ['reflection', '<reflection>', '</reflection>'],
];

for (const [name, prefix, suffix] of delimiterCases) {
    test(`${name} accepts a newline after the opening delimiter`, () => {
        const result = parser.parse(`${prefix}\nInspect the scene carefully.\n${suffix}\nThe door opened.`);

        assert.equal(result.reasoning, 'Inspect the scene carefully.');
        assert.equal(result.content, 'The door opened.');
        assert.equal(result.strategy, 'native');
    });

    test(`${name} accepts blank lines and indentation inside the block`, () => {
        const result = parser.parse(`${prefix}\n\n    Inspect the scene carefully.\n\n${suffix}\n\nThe door opened.`);

        assert.equal(result.reasoning, 'Inspect the scene carefully.');
        assert.equal(result.content, 'The door opened.');
        assert.equal(result.strategy, 'native');
    });
}
