import renderer from '../core/reconciler';
import { noop } from '../core/utils';
import { Container } from '../core/Container';
import { RevasTouch, RevasTouchEvent } from '../core/Node';
import { RevasCanvas } from '../core/Canvas';

function createRevasTouchEvent(e: TouchEvent): RevasTouchEvent {
  e.preventDefault();
  e.stopPropagation();
  const touches: { [key: number]: RevasTouch } = {};
  const type: any = e.type === 'touchcancel' ? 'touchend' : e.type;
  Object.keys(e.changedTouches).forEach((key: any) => {
    const touch = e.changedTouches[key];
    if (touch && touch.target) {
      const { offsetLeft, offsetTop } = touch.target as HTMLCanvasElement;
      touches[touch.identifier] = {
        identifier: touch.identifier,
        x: touch.clientX - offsetLeft,
        y: touch.clientY - offsetTop,
      };
    }
  });
  return { type, touches, timestamp: e.timeStamp || Date.now() };
}

export function render(app: React.ReactNode, dom: HTMLCanvasElement) {
  const canvas = new RevasCanvas(dom.getContext('2d')!);
  const scale = window.devicePixelRatio;
  canvas.transform.scale(scale, scale);
  const container = new Container(canvas, dom.clientWidth, dom.clientHeight);
  const touchHandler = (e: any) => container.handleTouch(createRevasTouchEvent(e));
  const resizeHandler = () => container.handleResize(dom.clientWidth, dom.clientHeight);
  dom.addEventListener('touchstart', touchHandler, false);
  dom.addEventListener('touchmove', touchHandler, false);
  dom.addEventListener('touchend', touchHandler, false);
  dom.addEventListener('touchcancel', touchHandler, false);
  dom.addEventListener('resize', resizeHandler, false);
  const fiber = renderer.createContainer(container, false, false);
  renderer.updateContainer(app, fiber, null, noop);
  return {
    unmount() {
      renderer.updateContainer(null, fiber, null, noop);
      dom.removeEventListener('touchstart', touchHandler, false);
      dom.removeEventListener('touchmove', touchHandler, false);
      dom.removeEventListener('touchend', touchHandler, false);
      dom.removeEventListener('touchcancel', touchHandler, false);
      dom.removeEventListener('resize', resizeHandler, false);
      container.destory();
    },
  };
}
