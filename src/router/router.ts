/**
 * 路由文件喵
 * @author wniko
 */
import Home from '../pages/Home.svelte';
import About from '../pages/About.svelte';
import Apothegm from '../pages/Apothegm.svelte';
import Map from '../pages/Map.svelte';
import General from '../pages/General.svelte';

export const routes = {
  '/': Map,
  '/about': About,
  '/apothegm/:id?': Apothegm,
  '/map': Map,
  '/general': General,
};
