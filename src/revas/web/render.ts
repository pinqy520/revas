import { Component, createElement } from 'react';
import renderer from '../core/reconciler';
import { noop } from '../core/utils';
import { Container } from '../core/Container';
import { RevasTouch, RevasTouchEvent } from '../core/Node';
import { RevasCanvas } from '../core/Canvas';
import { clearCache } from '../core/offscreen';
import { AppContext, AppContextType } from '../components/Context';

function getNodePosition(node: any): [number, number] {
  let top = 0;
  let left = 0;

  while (node) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
  }
  return [top, left];
}

function createRevasTouchEvent(e: TouchEvent): RevasTouchEvent {
  e.preventDefault();
  e.stopPropagation();
  const touches: { [key: number]: RevasTouch } = {};
  const type: any = e.type === 'touchcancel' ? 'touchend' : e.type;
  Object.keys(e.changedTouches).forEach((key: any) => {
    const touch = e.changedTouches[key];
    if (touch && touch.target) {
      const [offsetTop, offsetLeft] = getNodePosition(touch.target);
      touches[touch.identifier] = {
        identifier: touch.identifier,
        x: touch.clientX - offsetLeft,
        y: touch.clientY - offsetTop,
      };
    }
  });
  return { type, touches, timestamp: e.timeStamp || Date.now() };
}

function createCanvas(parent: HTMLElement, scale: number) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('style', 'width: 100%; height: 100%;');
  parent.appendChild(canvas);
  canvas.width = canvas.clientWidth * scale;
  canvas.height = canvas.clientHeight * scale;
  return canvas;
}

function getContextValue(dom: HTMLElement): AppContextType {
  return {
    clientWidth: dom.clientWidth,
    clientHeight: dom.clientHeight,
    deviceRatio: window.devicePixelRatio,
  };
}

export function render(app: React.ReactNode, parent: HTMLElement, parentComponent?: Component<any>, callback = noop) {
  const scale = window.devicePixelRatio;
  const dom = createCanvas(parent, scale);
  const canvas = new RevasCanvas(dom.getContext('2d')!);
  canvas.transform.scale(scale, scale);
  const container = new Container(canvas, dom.clientWidth, dom.clientHeight);
  const touchHandler = (e: any) => container.handleTouch(createRevasTouchEvent(e));
  dom.addEventListener('touchstart', touchHandler, false);
  dom.addEventListener('touchmove', touchHandler, false);
  dom.addEventListener('touchend', touchHandler, false);
  dom.addEventListener('touchcancel', touchHandler, false);
  const fiber = renderer.createContainer(container, false, false);
  renderer.updateContainer(
    createElement(AppContext.Provider, { value: getContextValue(dom) }, app),
    fiber,
    parentComponent,
    callback
  );

  return {
    get $() {
      return dom;
    },
    update(next = app, callback = noop) {
      dom.width = dom.clientWidth * scale;
      dom.height = dom.clientHeight * scale;
      clearCache();
      canvas.transform.scale(scale, scale);
      container.handleResize(dom.clientWidth, dom.clientHeight);
      renderer.updateContainer(
        createElement(AppContext.Provider, { value: getContextValue(dom) }, next),
        fiber,
        parentComponent,
        callback
      );
    },
    unmount(callback = noop) {
      renderer.updateContainer(null, fiber, null, callback);
      dom.removeEventListener('touchstart', touchHandler, false);
      dom.removeEventListener('touchmove', touchHandler, false);
      dom.removeEventListener('touchend', touchHandler, false);
      dom.removeEventListener('touchcancel', touchHandler, false);
      container.destory();
      clearCache();
      dom.remove();
    },
  };
}
