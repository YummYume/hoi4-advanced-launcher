import { Writable, writable } from 'svelte/store';

export const getHoi4Path = (() => {
    const { subscribe, set }: Writable<string|null> = writable(null);

    return {
        subscribe,
        refresh: () => set(api.getHoi4Path())
    };
});

export const hoi4Path = getHoi4Path();
