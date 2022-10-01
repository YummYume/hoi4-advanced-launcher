import { get, writable } from 'svelte/store';

import { tabs as tabsData, Tab } from '../data/tabs';
import { currentTab } from './currentTab';

function getTabs() {
    const { subscribe, update } = writable<Tab[]>(tabsData);

    return {
        subscribe,
        setNotification: (key: 'home'|'mods'|'conflicts'|'settings', hasNotification: boolean) => update(current => {
            if (hasNotification && get(currentTab).key === key) {
                return current;
            }

            const tabIndex = current.findIndex(t => t.key === key);

            if (tabIndex) {
                current[tabIndex].hasNotification = hasNotification;
            }

            return current;
        })
    };
}

export const tabs = getTabs();
