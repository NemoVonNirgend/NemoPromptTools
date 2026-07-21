import { NemoCharacterManager } from './features/character-manager/character-manager.js';
import { initPresetNavigatorForApi } from './archive/navigator.js';
import { NemoPresetManager } from './features/prompts/prompt-manager.js';

const API_TYPES = ['openai', 'textgenerationwebui', 'novel', 'kobold', 'horde'];

function initialize() {
    NemoCharacterManager.initialize();
    window.NemoPresetManager = NemoPresetManager;
    const promptList = document.querySelector('#completion_prompt_manager_list');
    if (promptList) NemoPresetManager.initialize(promptList);
    API_TYPES.forEach(initPresetNavigatorForApi);
}

window.NemoPromptTools = Object.freeze({ NemoCharacterManager, NemoPresetManager, initPresetNavigatorForApi });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
