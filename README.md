# Nemo Prompt Tools compatibility bridge

NemoPromptTools has been merged back into **NemoPresetExt 6.0**. Version 1.2 is a transition release for users who may still run an older NemoPresetExt build.

## Behavior

- With NemoPresetExt 6.0 or newer, this extension detects the merged prompt-workstation capability, loads no standalone stylesheet or runtime, and displays a small migration notice.
- With an older NemoPresetExt release or without NemoPresetExt, the existing standalone PromptTools runtime and stylesheet load normally.
- Existing `extension_settings.NemoPromptTools` data is left untouched so NemoPresetExt 6.0 can migrate it and downgrades remain reversible.

## Removal

After NemoPresetExt 6.0 has loaded once and migrated your settings, this compatibility extension can be uninstalled.

The maintained prompt workstation now lives at:

`https://github.com/NemoVonNirgend/NemoPresetExt`
