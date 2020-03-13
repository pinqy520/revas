import renderer from '../core/reconciler'
import { noop } from '../core/utils'
import { Container } from '../core/Container'
import { RevasTouch, RevasTouchEvent } from '../core/Node'

function createRevasTouchEvent(e: TouchEvent): RevasTouchEvent {
  const touches: { [key: number]: RevasTouch } = {}
  const type: any = e.type === 'touchcancel' ? 'touchend' : e.type
  Object.values(e.changedTouches).forEach(touch => {
    if (touch && touch.target) {
      const { offsetLeft, offsetTop } = touch.target as HTMLCanvasElement
      touches[touch.identifier] = {
        identifier: touch.identifier,
        x: touch.clientX - offsetLeft,
        y: touch.clientY - offsetTop
      }
    }
  })
  return { type, touches, timestamp: e.timeStamp || Date.now() }
}

export function render(app: React.ReactNode, canvas: HTMLCanvasElement) {
  const container = new Container(canvas.getContext('2d'), canvas.clientWidth, canvas.clientHeight)
  const touchHandler = (e: any) => container.handleTouch(createRevasTouchEvent(e))
  const resizeHandler = () => container.handleResize(canvas.clientWidth, canvas.clientHeight)
  canvas.addEventListener('touchstart', touchHandler, false)
  canvas.addEventListener('touchmove', touchHandler, false)
  canvas.addEventListener('touchend', touchHandler, false)
  canvas.addEventListener('touchcancel', touchHandler, false)
  canvas.addEventListener('resize', resizeHandler, false)
  const fiber = renderer.createContainer(container, false, false)
  renderer.updateContainer(app, fiber, null, noop)
  return {
    unmount() {
      renderer.updateContainer(null, fiber, null, noop)
      canvas.removeEventListener('touchstart', touchHandler, false)
      canvas.removeEventListener('touchmove', touchHandler, false)
      canvas.removeEventListener('touchend', touchHandler, false)
      canvas.removeEventListener('touchcancel', touchHandler, false)
      canvas.removeEventListener('resize', resizeHandler, false)
      container.destory()
    }
  }
}
