import App from './App.svelte';
import { register, init } from 'svelte-i18n';

register('en', () => import('./translations/en.json'));

init({
    fallbackLocale: 'en',
    initialLocale: 'en'
});

const app = new App({
    target: document.getElementById('app')
});

export default app;
