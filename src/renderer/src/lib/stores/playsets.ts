import { get, writable } from 'svelte/store';

export const defaultPlayset: Playset = {
    id: -1,
    name: 'playset.default.title',
    description: 'playset.default.description'
};

export const currentPlayset = writable<Playset>(defaultPlayset);

function getPlaysets() {
    const { subscribe, set, update } = writable<Playset[]>([]);

    return {
        subscribe,
        init: async (): Promise<void> => {
            set(await api.getAllPlaysets());
        },
        add: async (data: PlaysetWithoutId): Promise<void> => {
            const newPlayset = await api.addPlayset(data);

            update((currentPlaysets) => [...currentPlaysets, newPlayset]);
        },
        update: async (id: string | number, data: Partial<PlaysetWithoutId>): Promise<void> => {
            await api.updatePlayset(id, data);

            update((currentPlaysets) => currentPlaysets.map((p) => (p.id === id ? { ...p, ...data } : p)));

            if (get(currentPlayset).id === id) {
                currentPlayset.update(p => ({ ...p, ...data }));
            }
        },
        remove: async (id: string | number): Promise<void> => {
            await api.removePlayset(id);

            if (get(currentPlayset).id === id) {
                currentPlayset.set(defaultPlayset);
            }

            update((currentPlaysets) => currentPlaysets.filter((p) => p.id !== id));
        }
    };
}

export const playsets = getPlaysets();

export interface Playset {
    id: string | number;
    name: string;
    description?: string;
}

export interface PlaysetWithoutId extends Omit<Playset, 'id'> {}
