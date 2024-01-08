import { createApp } from './app.js';
import { defaultRouter } from './router/index.js';

const app = createApp({ router: defaultRouter });

app.start();
