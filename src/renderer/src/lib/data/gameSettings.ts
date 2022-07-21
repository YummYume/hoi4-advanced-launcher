export const supportedGameDisplayModes: GameDisplayMode[] = [
    { label: 'fullscreen', value: 'fullscreen' },
    { label: 'borderless_fullscreen', value: 'borderless_fullscreen' },
    { label: 'windowed', value: 'windowed' }
];

export const supportedGameLanguages: GameLanguage[] = [
    { label: 'English', value: 'l_english' },
    { label: 'Português do Brasil', value: 'l_braz_por' },
    { label: 'Deutsch', value: 'l_german' },
    { label: 'Français', value: 'l_french' },
    { label: 'Español', value: 'l_spanish' },
    { label: 'Polski', value: 'l_polish' },
    { label: 'Pусский', value: 'l_russian' }
];

export const supportedGameRenderers: GameRenderer[] = [
    { label: 'DirectX 9', value: 'dx9' },
    { label: 'DirectX 11', value: 'dx11' },
    { label: 'OpenGL', value: 'opengl' }
];

export const supportedRefreshRates: RefreshRate[] = [
    { label: '165', value: '165' },
    { label: '144', value: '144' },
    { label: '120', value: '120' },
    { label: '100', value: '100' },
    { label: '85', value: '85' },
    { label: '60', value: '60' },
    { label: '59', value: '59' },
    { label: '50', value: '50' }
];

export interface GameDisplayMode {
    label: string;
    value: string;
}

export interface GameLanguage {
    label: string;
    value: string;
}

export interface GameRenderer {
    label: string;
    value: string;
}

export interface RefreshRate {
    label: string;
    value: string;
}
