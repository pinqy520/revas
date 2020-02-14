import React from 'react';
import ReCanvas from './lib/render'
import App from './App';
import * as serviceWorker from './serviceWorker';
import createCanvas from './createCanvas'

import './index.css';


ReCanvas.render(
  React.createElement(App),
  createCanvas()
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
