import routes from './routes';
import locales from './locales';

const menus = [
  {
    parent: 'topbar',
    name: 'pod-analyzer',
    title: 'pod-analyzer',
    icon: 'cluster',
    order: 0,
    desc: 'pod analyze',
    skipAuth: true,
  },
];

const extensionConfig = {
  routes,
  menus,
  locales,
};

export default extensionConfig;

