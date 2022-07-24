import { writable, Writable, get } from 'svelte/store';

const defaultSettings: PdxGameSettings = {
    Graphics: {
        display_index: {
            value: '0',
            version: '0'
        },
        display_mode: {
            value: 'fullscreen',
            version: '0'
        },
        fullscreen_resolution: {
            value: '1920x1080',
            version: '0'
        },
        vsync: {
            enabled: false,
            version: '0'
        },
        refreshRate: {
            value: '60',
            version: '0'
        },
        windowed_resolution: {
            value: '1920x1080',
            version: '0'
        },
        renderer: {
            value: 'dx9',
            version: '0'
        }
    },
    System: {
        language: {
            value: 'l_english',
            version: '0'
        }
    }
};

export const gameSettings = (() => {
    const { subscribe, set }: Writable<PdxGameSettings> = writable(defaultSettings);

    return {
        subscribe,
        load: () => {
            set(api.getGameSettings() ?? defaultSettings);
        },
        save: async () => {
            return await api.setGameSettings(get(gameSettings));
        }
    };
})();

export interface PdxSettingValueVersion {
    value: string;
    version: string;
}

export interface PdxSettingEnabledVersion {
    enabled: boolean;
    version: string;
}

export interface PdxGameSettings {
    Graphics: {
        display_index: PdxSettingValueVersion;
        display_mode: PdxSettingValueVersion;
        fullscreen_resolution: PdxSettingValueVersion;
        refreshRate: PdxSettingValueVersion;
        renderer: PdxSettingValueVersion;
        vsync: PdxSettingEnabledVersion;
        windowed_resolution: PdxSettingValueVersion;
    };
    System: {
        language: PdxSettingValueVersion;
    };
}
