import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const bootstrap = readFileSync(new URL('../index.js', import.meta.url), 'utf8');
const standalone = readFileSync(new URL('../standalone-runtime.js', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8'));

test('bridge never declares the standalone stylesheet in the manifest', () => {
    assert.equal(manifest.version, '1.2.1');
    assert.equal(manifest.css, undefined);
    assert.match(bootstrap, /mergedRuntimeAvailable/);
    assert.match(bootstrap, /capabilities\?\.promptTools === true/);
    assert.match(bootstrap, /nemo:preset-ext-capabilities/);
});

test('standalone resources load only after merged capability detection fails', () => {
    const capabilityCheck = bootstrap.indexOf('const merged = await waitForMergedCapability()');
    const stylesheetLoad = bootstrap.indexOf('await loadStandaloneStyles()');
    const runtimeLoad = bootstrap.indexOf("await import('./standalone-runtime.js')");
    assert.ok(capabilityCheck >= 0);
    assert.ok(stylesheetLoad > capabilityCheck);
    assert.ok(runtimeLoad > stylesheetLoad);
});

test('the preserved standalone runtime still owns persistent settings and feature gates', () => {
    assert.match(standalone, /extension_settings\.NemoPromptTools/);
    for (const key of ['promptManager', 'presetNavigator', 'characterNavigator', 'reasoningCapture']) {
        assert.match(standalone, new RegExp(`settings\\.${key}`));
    }
    assert.match(standalone, /saveSettingsDebounced/);
    assert.match(standalone, /new MutationObserver/);
    assert.doesNotMatch(standalone, /initDirective/);
});
