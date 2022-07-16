import type { SvelteComponent } from 'svelte';

import Home from '../pages/Home.svelte';
import Settings from '../pages/Settings.svelte';
import Conflicts from '../pages/Conflicts.svelte';
import Mods from '../pages/Mods.svelte';

export const tabs: Tab[] = [
    { label: 'Home', component: Home },
    { label: 'Mods', component: Mods },
    { label: 'Conflicts', component: Conflicts },
    { label: 'Settings', component: Settings }
];

export interface Tab {
    label: string;
    component: typeof SvelteComponent;
}
