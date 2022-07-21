import App from './App.svelte';
import { register, init } from 'svelte-i18n';

import { supportedLanguages } from './lib/data/languages';

try {
    await api.init();
    console.log('API initialized');
} catch (e) {
    console.error(e);
    // TODO inform user of error & log
}

const appLocale = api.getAppLocale();

api.getTranslationFiles()
    .filter((fileName) => supportedLanguages.some((l) => fileName.split('.')[0] === l.key))
    .forEach((fileName) => {
        const fileNameWithoutExtension = fileName.split('.')[0];

        // it is required to have the .json in this statement for Vite to understand that we are importing a json file
        register(fileNameWithoutExtension, () => import(`./translations/${fileNameWithoutExtension}.json`));
    });

await init({
    fallbackLocale: 'en',
    initialLocale: supportedLanguages.some((l) => appLocale === l.key) ? appLocale : 'en'
});

const app = new App({
    target: document.getElementById('app')
});

export default app;
