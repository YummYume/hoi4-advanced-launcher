import type { SvelteComponent } from 'svelte';

import Home from '../pages/Home.svelte';
import Settings from '../pages/Settings.svelte';
import Conflicts from '../pages/Conflicts.svelte';
import Mods from '../pages/Mods.svelte';

export const tabs: Tab[] = [
    { key: 'home', component: Home, hasNotification: false },
    { key: 'mods', component: Mods, hasNotification: false },
    { key: 'conflicts', component: Conflicts, hasNotification: false },
    { key: 'settings', component: Settings, hasNotification: false }
];

export interface Tab {
    key: 'home'|'mods'|'conflicts'|'settings';
    component: typeof SvelteComponent;
    hasNotification: boolean;
}
