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

export const supportedScreenResolutions: ScreenResolution[] = [
    { label: '7680x4320', value: '7680x4320' },
    { label: '3840x2160', value: '3840x2160' },
    { label: '2048x1080', value: '2048x1080' },
    { label: '2560x1440', value: '2560x1440' },
    { label: '1920x1080', value: '1920x1080' },
    { label: '1680x1050', value: '1680x1050' },
    { label: '1280x720', value: '1280x720' },
    { label: '1024x768', value: '1024x768' },
    { label: '960x640', value: '960x640' },
    { label: '640x480', value: '640x480' }
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

export interface ScreenResolution {
    label: string;
    value: string;
}
