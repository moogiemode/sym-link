import { load } from '@tauri-apps/plugin-store';

const settings = await load('settings.json', { autoSave: false });

console.log(await settings.keys());
settings.reset();

export { settings };
