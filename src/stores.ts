import { writable } from 'svelte/store';

export let currentPageStore = writable('home');

export let ip = '';
export const setIp = newip => {
  ip = newip;
};
