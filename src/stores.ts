import { writable } from 'svelte/store';

export let currentPageStore = writable('home');

export let isAdminModeStore = writable(false);

export let ip = '';
export const setIp = newip => {
  ip = newip;
};
