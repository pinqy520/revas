import React from 'react';
import ReCanvas from './lib'
import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';

const canvas = document.createElement('canvas')
canvas.width = 500
canvas.height = 500
document.body.appendChild(canvas)

ReCanvas.render(
  React.createElement(App),
  canvas
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
