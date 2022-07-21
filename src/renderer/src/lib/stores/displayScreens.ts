import { readable } from 'svelte/store';

import type { Display } from 'electron';

export const getAllDisplayScreens = readable<DisplayScreen[]>([], function start(set) {
    set(api.getAllDisplayScreens().map((s) => ({ ...s, id: s.id.toString() })));
});

export interface DisplayScreen extends Omit<Display, 'id'> {
    id: string;
}
