import React from 'react';
import { render } from './revas';
import App from './develop/App';
import * as serviceWorker from './develop/serviceWorker';
import createCanvas from './develop/createCanvas';

import './develop/index.css';

const canvas = createCanvas();
// eslint-disable-next-line
const app = render(<App width={canvas.clientWidth} height={canvas.clientHeight} />, canvas);

// try unmount
// setTimeout(() => {
//   app.unmount()
// }, 5000);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
