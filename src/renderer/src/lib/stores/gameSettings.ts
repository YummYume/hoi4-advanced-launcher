import { writable, Writable, get } from 'svelte/store';

import {
    supportedGameDisplayModes,
    supportedGameLanguages,
    supportedGameRenderers,
    supportedRefreshRates,
    supportedScreenResolutions,
    defaultSettings
} from '../data/gameSettings';

function anySettingMatch(
    supportedSetting:
        | 'display_mode'
        | 'language'
        | 'renderer'
        | 'refresh_rate'
        | 'fullscreen_resolution'
        | 'windowed_resolution'
        | 'vsync',
    gameSettings: PdxGameSettings
) {
    let match = false;

    switch (supportedSetting) {
        case 'display_mode':
            if (Boolean(gameSettings?.Graphics?.display_mode?.value)) {
                match = supportedGameDisplayModes.some((s) => s.value === gameSettings.Graphics.display_mode.value);
            }

            break;
        case 'language':
            if (Boolean(gameSettings?.System?.language?.value)) {
                match = supportedGameLanguages.some((s) => s.value === gameSettings.System.language.value);
            }

            break;
        case 'renderer':
            if (Boolean(gameSettings?.Graphics?.renderer?.value)) {
                match = supportedGameRenderers.some((s) => s.value === gameSettings.Graphics.renderer.value);
            }

            break;
        case 'refresh_rate':
            if (Boolean(gameSettings?.Graphics?.refreshRate?.value)) {
                match = supportedRefreshRates.some((s) => s.value === gameSettings.Graphics.refreshRate.value);
            }

            break;
        case 'fullscreen_resolution':
            if (Boolean(gameSettings?.Graphics?.fullscreen_resolution?.value)) {
                match = supportedScreenResolutions.some(
                    (s) => s.value === gameSettings.Graphics.fullscreen_resolution.value
                );
            }

            break;
        case 'windowed_resolution':
            if (Boolean(gameSettings?.Graphics?.windowed_resolution?.value)) {
                match = supportedScreenResolutions.some(
                    (s) => s.value === gameSettings.Graphics.windowed_resolution.value
                );
            }

            break;
        case 'vsync':
            if (Boolean(gameSettings?.Graphics?.vsync?.enabled)) {
                match = typeof gameSettings.Graphics.vsync.enabled === 'boolean';
            }

            break;
        default:
            match = false;

            break;
    }

    return match;
}

export const gameSettings = (() => {
    const { subscribe, set }: Writable<PdxGameSettings> = writable(defaultSettings);

    return {
        subscribe,
        load: () => {
            const gameSettings = api.getGameSettings();

            if (gameSettings) {
                if (!anySettingMatch('display_mode', gameSettings)) {
                    gameSettings.Graphics.display_mode = defaultSettings.Graphics.display_mode;
                }

                if (!anySettingMatch('language', gameSettings)) {
                    gameSettings.System.language = defaultSettings.System.language;
                }

                if (!anySettingMatch('renderer', gameSettings)) {
                    gameSettings.Graphics.renderer = defaultSettings.Graphics.renderer;
                }

                if (!anySettingMatch('refresh_rate', gameSettings)) {
                    gameSettings.Graphics.refreshRate = defaultSettings.Graphics.refreshRate;
                }

                if (!anySettingMatch('fullscreen_resolution', gameSettings)) {
                    gameSettings.Graphics.fullscreen_resolution = defaultSettings.Graphics.fullscreen_resolution;
                }

                if (!anySettingMatch('windowed_resolution', gameSettings)) {
                    gameSettings.Graphics.windowed_resolution.value =
                        defaultSettings.Graphics.windowed_resolution.value;
                }

                if (!anySettingMatch('vsync', gameSettings)) {
                    gameSettings.Graphics.vsync = defaultSettings.Graphics.vsync;
                }
            }

            set(gameSettings ?? defaultSettings);
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
