import { writable, Writable, get } from 'svelte/store';

import type { Display } from 'electron';

function toDisplayScreen(displayList: Display[]): DisplayScreen[] {
    return displayList.map((s) => ({ ...s, id: s.id.toString() }));
}

export const displayScreensLoaded = (() => {
    const { subscribe, set }: Writable<boolean> = writable(false);

    return {
        subscribe,
        load: () => set(true),
        unload: () => set(false)
    };
})();

export const getAllDisplayScreens = (() => {
    const { subscribe, set }: Writable<DisplayScreen[]> = writable([]);

    return {
        subscribe,
        load: () => {
            if (get(displayScreensLoaded)) {
                const err = new Error('Displays already loaded.');
                api.logs().error(err);
                throw err;
            }

            set(toDisplayScreen(api.getAllDisplayScreens()));
            displayScreensLoaded.load();
        },
        update: async () => {
            if (!get(displayScreensLoaded)) {
                throw new Error('Displays not loaded.');
            }

            const screenList = await api.updateScreensList();

            set(toDisplayScreen(screenList));
        }
    };
})();

export interface DisplayScreen extends Omit<Display, 'id'> {
    id: string;
}
