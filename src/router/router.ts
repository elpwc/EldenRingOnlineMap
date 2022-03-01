import Home from '../pages/Home.svelte';
import About from '../pages/About.svelte';
import Apothegm from '../pages/Apothegm.svelte';
import Map from '../pages/Map.svelte';

export const routes = {
  '/': Map,
  '/about': About,
  '/apothegm': Apothegm,
  '/map': Map,
};
