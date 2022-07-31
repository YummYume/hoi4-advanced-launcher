import { writable } from 'svelte/store';

export const launchParameters = writable<string>('', () => {
    launchParameters.set(api.getLaunchParameters());
});

export const launchParametersStrictMode = writable<boolean>(true, () => {
    launchParametersStrictMode.set(api.getLaunchParametersStrictMode());
});
