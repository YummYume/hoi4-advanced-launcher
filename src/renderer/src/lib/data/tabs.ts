import type { SvelteComponent } from 'svelte';

import Home from '../pages/Home.svelte';
import Settings from '../pages/Settings.svelte';
import Conflicts from '../pages/Conflicts.svelte';
import Mods from '../pages/Mods.svelte';

export const tabs: Tab[] = [
    { key: 'home', component: Home },
    { key: 'mods', component: Mods },
    { key: 'conflicts', component: Conflicts },
    { key: 'settings', component: Settings }
];

export interface Tab {
    key: string;
    component: typeof SvelteComponent;
}
