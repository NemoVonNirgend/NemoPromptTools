import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import test from 'node:test';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TEXT_SUFFIXES = new Set(['.js', '.css', '.html', '.md']);
const RUNTIME_ENTRIES = [
    'archive',
    'core',
    'features',
    'reasoning',
    'index.js',
    'standalone-runtime.js',
    'styles.css',
];
const MOJIBAKE_MARKERS = [
    'Ã¢',
    'Ã°',
    'Ãƒ',
    'Â ',
    'â€',
    'â€“',
    'â€”',
    'â„¢',
    'ðŸ',
    '\uFFFD',
];
const C1_CONTROLS = /[\u0080-\u009F]/u;

function extension(path) {
    const index = path.lastIndexOf('.');
    return index === -1 ? '' : path.slice(index);
}

function collectTextFiles(path, output = []) {
    const stats = statSync(path);
    if (stats.isDirectory()) {
        for (const child of readdirSync(path)) collectTextFiles(join(path, child), output);
    } else if (TEXT_SUFFIXES.has(extension(path))) {
        output.push(path);
    }
    return output;
}

function read(path) {
    return readFileSync(join(ROOT, path), 'utf8');
}

test('standalone runtime source contains no mojibake or C1 controls', () => {
    const failures = [];
    const files = RUNTIME_ENTRIES.flatMap(entry => collectTextFiles(join(ROOT, entry)));
    for (const file of files) {
        const text = readFileSync(file, 'utf8');
        const markers = MOJIBAKE_MARKERS.filter(marker => text.includes(marker));
        if (markers.length > 0 || C1_CONTROLS.test(text)) {
            failures.push(`${relative(ROOT, file)}: ${markers.join(', ') || 'C1 control character'}`);
        }
    }
    assert.deepEqual(failures, []);
});

test('navigator HTML escaping still encodes ampersands before other characters', () => {
    assert.match(read('archive/navigator.js'), /\.replace\(\/&\/g, ["']&amp;["']\)/u);
    assert.match(read('features/prompts/prompt-navigator.js'), /\.replace\(\/&\/g, ["']&amp;["']\)/u);
});

test('standalone prompt glyphs use canonical CSS escapes', () => {
    const styles = read('styles.css');
    for (const glyph of [
        "content: '\\2605 ';",
        "content: '\\2713 ';",
        "content: '\\25B6 ';",
        "content: '\\1F4C1 ';",
        "content: '\\1F4C2 ';",
        "content: '\\2514 \\2500 ';",
    ]) {
        assert.ok(styles.includes(glyph), `Missing ${glyph}`);
    }
    assert.doesNotMatch(styles, /\\E2\s+\\2013\s+\\B6/u);
});

test('narrative heuristics retain straight and curly apostrophe support', () => {
    const reasoning = read('reasoning/reasoning-capture-core.js');
    assert.ok(reasoning.includes("[\\p{L}\\p{M}'’\\-]*"));
    assert.equal(reasoning.includes("[\\p{L}\\p{M}''\\-]*"), false);
});

test('compatibility bridge gives merged core a safe startup grace period', () => {
    const index = read('index.js');
    const match = index.match(/waitForMergedCapability\(timeout\s*=\s*(\d+)\)/u);
    assert.ok(match, 'Capability timeout declaration missing');
    assert.ok(Number(match[1]) >= 3000, `Capability timeout too short: ${match[1]}ms`);
    assert.match(index, /window\.NemoPresetExt\?\.capabilities\?\.promptTools === true/u);
    assert.match(index, /await import\('\.\/standalone-runtime\.js'\)/u);
});
