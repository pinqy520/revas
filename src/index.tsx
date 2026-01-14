import React from 'react';
import { render } from './revas';
import App from './develop/App';

import './develop/index.css';

const app = render(<App />, document.getElementById('canvas')!);

window.addEventListener('resize', () => {
  requestAnimationFrame(() => {
    app.update();
  });
});
