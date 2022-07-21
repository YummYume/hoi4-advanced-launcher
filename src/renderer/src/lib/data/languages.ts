export const supportedLanguages: Language[] = [
    { key: 'en', name: 'English' },
    { key: 'fr', name: 'Français' }
];

export interface Language {
    key: string;
    name: string;
}
