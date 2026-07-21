import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../index.js', import.meta.url), 'utf8');

test('owns persistent settings and gates every optional runtime', () => {
    assert.match(source, /extension_settings\.NemoPromptTools/);
    for (const key of ['promptManager', 'presetNavigator', 'characterNavigator', 'reasoningCapture']) {
        assert.match(source, new RegExp(`settings\\.${key}`));
    }
    assert.match(source, /data-setting="\$\{key\}"/);
    assert.match(source, /saveSettingsDebounced/);
    assert.match(source, /new MutationObserver/);
    assert.match(source, /nemo-prompt-tools-settings/);
});

test('does not initialize directives owned by NemoPresetExt', () => {
    assert.doesNotMatch(source, /initDirective/);
});
