import Home from '../pages/home/Home.vue';
import Bramble from '../pages/Bramble.vue';
import Briar from '../pages/Briar.vue';

export const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/bramble',
    component: Bramble
  },
  {
    path: '/briar',
    component: Briar
  }
];
