import { saveSettings, saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { NemoCharacterManager } from './features/character-manager/character-manager.js';
import { initPresetNavigatorForApi } from './archive/navigator.js';
import { loadAndSetDividerRegex, NemoPresetManager } from './features/prompts/prompt-manager.js';
import { applyNemoNetReasoning } from './reasoning/nemonet-reasoning-config.js';

const API_TYPES = ['openai', 'textgenerationwebui', 'novel', 'kobold', 'horde'];
const DEFAULTS = Object.freeze({
    promptManager: true,
    presetNavigator: true,
    characterNavigator: true,
    reasoningCapture: true,
});

const runtimeState = {
    characterNavigatorInitialized: false,
    reasoningCaptureInitialized: false,
    promptList: null,
    reconcileTimer: null,
    observer: null,
};

function getSettings() {
    if (!extension_settings.NemoPromptTools) {
        const legacy = extension_settings.NemoPresetExt ?? {};
        extension_settings.NemoPromptTools = {
            promptManager: legacy.enablePromptManager ?? DEFAULTS.promptManager,
            presetNavigator: legacy.enablePresetNavigator ?? DEFAULTS.presetNavigator,
            characterNavigator: legacy.enableCharacterNavigator ?? DEFAULTS.characterNavigator,
            reasoningCapture: legacy.enableReasoningCapture ?? DEFAULTS.reasoningCapture,
        };
        saveSettingsDebounced();
    }
    const settings = extension_settings.NemoPromptTools;
    for (const [key, value] of Object.entries(DEFAULTS)) settings[key] ??= value;
    return settings;
}

function mountSettings(settings) {
    if (document.getElementById('nemo-prompt-tools-settings')) return true;
    const container = document.getElementById('extensions_settings') ?? document.getElementById('extensions_settings2');
    if (!container) return false;
    const host = document.createElement('div');
    host.id = 'nemo-prompt-tools-settings';
    host.className = 'extension_container';
    host.innerHTML = `
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header"><b>Nemo Prompt Tools</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
            <div class="inline-drawer-content">
                <p class="notes">Changes apply after reloading SillyTavern.</p>
                ${Object.entries({
                    promptManager: 'Prompt dropdowns and tools',
                    presetNavigator: 'Preset navigator',
                    characterNavigator: 'Character navigator',
                    reasoningCapture: 'Improved reasoning capture',
                }).map(([key, label]) => `<label class="checkbox_label"><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}><span>${label}</span></label>`).join('')}
            </div>
        </div>`;
    host.addEventListener('change', event => {
        const input = event.target.closest('input[data-setting]');
        if (!input) return;
        settings[input.dataset.setting] = input.checked;
        saveSettingsDebounced();
        void saveSettings();
    });
    container.appendChild(host);
    return true;
}

async function reconcileRuntime(settings) {
    mountSettings(settings);

    if (settings.reasoningCapture && !runtimeState.reasoningCaptureInitialized) {
        applyNemoNetReasoning();
        runtimeState.reasoningCaptureInitialized = true;
    }

    if (settings.characterNavigator && !runtimeState.characterNavigatorInitialized) {
        NemoCharacterManager.initialize();
        runtimeState.characterNavigatorInitialized = true;
    }

    if (settings.promptManager) {
        window.NemoPresetManager = NemoPresetManager;
        window.NemoPromptManager = NemoPresetManager;

        const promptList = document.querySelector('#completion_prompt_manager_list');
        if (promptList && promptList !== runtimeState.promptList) {
            runtimeState.promptList = promptList;
            await NemoPresetManager.initialize(promptList);
        } else if (promptList && !document.getElementById('nemoPresetSearchContainer')) {
            NemoPresetManager.refreshUI();
        }
    }

    if (settings.presetNavigator) {
        API_TYPES.forEach(initPresetNavigatorForApi);
    }
}

function scheduleReconcile(settings) {
    clearTimeout(runtimeState.reconcileTimer);
    runtimeState.reconcileTimer = setTimeout(() => {
        runtimeState.reconcileTimer = null;
        void reconcileRuntime(settings);
    }, 50);
}

function observeRuntime(settings) {
    scheduleReconcile(settings);

    runtimeState.observer = new MutationObserver(mutations => {
        const relevantMutation = mutations.some(mutation =>
            mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        );
        if (relevantMutation) scheduleReconcile(settings);
    });

    runtimeState.observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('pagehide', () => {
        runtimeState.observer?.disconnect();
        clearTimeout(runtimeState.reconcileTimer);
    }, { once: true });
}

async function initialize() {
    const settings = getSettings();
    await loadAndSetDividerRegex();
    observeRuntime(settings);
}

window.NemoPromptTools = Object.freeze({ NemoCharacterManager, NemoPresetManager, initPresetNavigatorForApi, getSettings });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void initialize(), { once: true });
else void initialize();
