/**
 * NemoPromptTools compatibility bootstrap.
 *
 * NemoPresetExt 6.0 owns the prompt workstation. This package remains useful
 * during the migration window because older NemoPresetExt releases still need
 * the standalone runtime. The bootstrap never loads standalone CSS or code when
 * the merged capability is present.
 */

const MERGED_CAPABILITY_EVENT = 'nemo:preset-ext-capabilities';
const BRIDGE_ID = 'nemo-prompt-tools-compat-settings';
const STYLE_ID = 'nemo-prompt-tools-standalone-styles';

function mergedRuntimeAvailable() {
    return window.NemoPresetExt?.capabilities?.promptTools === true
        || window.NemoPromptTools?.mergedIntoCore === true;
}

// Give the merged module graph enough time to evaluate on slower devices before
// falling back to the standalone runtime. The capability event resolves this
// immediately during ordinary NemoPresetExt 6.0 startup.
function waitForMergedCapability(timeout = 3000) {
    if (mergedRuntimeAvailable()) return Promise.resolve(true);

    return new Promise(resolve => {
        let settled = false;
        const finish = value => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            window.removeEventListener(MERGED_CAPABILITY_EVENT, onCapabilities);
            resolve(value);
        };
        const onCapabilities = event => {
            if (event.detail?.promptTools === true || mergedRuntimeAvailable()) finish(true);
        };
        const timer = setTimeout(() => finish(mergedRuntimeAvailable()), timeout);
        window.addEventListener(MERGED_CAPABILITY_EVENT, onCapabilities);
    });
}

function mountCompatibilityNotice() {
    if (document.getElementById(BRIDGE_ID)) return true;
    const container = document.getElementById('extensions_settings')
        ?? document.getElementById('extensions_settings2');
    if (!container) return false;

    const host = document.createElement('div');
    host.id = BRIDGE_ID;
    host.className = 'extension_container';
    host.innerHTML = `
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Nemo Prompt Tools compatibility</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <p class="notes">
                    Prompt Tools is now included in NemoPresetExt 6.0. This bridge is idle and can be
                    uninstalled after NemoPresetExt has migrated your existing settings.
                </p>
            </div>
        </div>`;
    container.appendChild(host);
    return true;
}

function observeCompatibilityNotice() {
    if (mountCompatibilityNotice()) return;
    const observer = new MutationObserver(() => {
        if (mountCompatibilityNotice()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
}

function loadStandaloneStyles() {
    const existing = document.getElementById(STYLE_ID);
    if (existing) return Promise.resolve();

    return new Promise(resolve => {
        const link = document.createElement('link');
        link.id = STYLE_ID;
        link.rel = 'stylesheet';
        link.href = new URL('./styles.css', import.meta.url).href;
        link.addEventListener('load', resolve, { once: true });
        link.addEventListener('error', () => {
            console.warn('[Nemo Prompt Tools] Standalone stylesheet failed to load.');
            resolve();
        }, { once: true });
        document.head.appendChild(link);
    });
}

async function initializeCompatibilityBridge() {
    const merged = await waitForMergedCapability();
    if (merged) {
        observeCompatibilityNotice();
        window.NemoPromptToolsBridge = Object.freeze({ mode: 'merged', idle: true });
        console.info('[Nemo Prompt Tools] Merged NemoPresetExt runtime detected; standalone runtime is idle.');
        return;
    }

    await loadStandaloneStyles();
    await import('./standalone-runtime.js');
    window.NemoPromptToolsBridge = Object.freeze({ mode: 'standalone', idle: false });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => void initializeCompatibilityBridge(), { once: true });
} else {
    void initializeCompatibilityBridge();
}
