import { writable } from 'svelte/store';

export const currentModsTab = writable<string>('mods');
