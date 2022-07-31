import { writable } from 'svelte/store';

import { Tab, tabs } from '../data/tabs';

export const currentTab = writable<Tab>(tabs[0]);
