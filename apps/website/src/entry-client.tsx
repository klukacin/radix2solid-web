import { hydrate } from '@solidjs/web';
import { Website } from './website.js';
import { routes } from './routes.js';

const root = document.getElementById('website');
if (!root) throw new Error('Website requires its server-rendered root.');
const path = location.pathname.replace(/\/$/, '') || '/';
const route = await routes[path]?.load();
hydrate(() => <Website path={path} route={route} />, root, { renderId: 'site-' });
