import renderer from '../core/reconciler'
import { noop, config } from '../core/utils'
import { Container } from '../core/Container'
import { RevasTouch, RevasTouchEvent } from '../core/Node'


config.createImage = () => new Image()

function createRevasTouchEvent(e: TouchEvent): RevasTouchEvent {
  const touches: { [key: number]: RevasTouch } = {}
  const type: any = e.type === 'touchcancel' ? 'touchend' : e.type
  Object.values(e.changedTouches).forEach(touch => {
    const { offsetLeft, offsetTop } = touch.target as HTMLCanvasElement
    touches[touch.identifier] = {
      identifier: touch.identifier,
      x: touch.clientX - offsetLeft,
      y: touch.clientY - offsetTop
    }
  })
  return { type, touches, timestamp: e.timeStamp || Date.now() }
}

export function render(app: React.ReactNode, canvas: HTMLCanvasElement) {
  const container = new Container(canvas.getContext('2d'), canvas.clientWidth, canvas.clientHeight)
  canvas.ontouchstart = canvas.ontouchmove = canvas.ontouchend =
    canvas.ontouchcancel = e => container.handleTouch(createRevasTouchEvent(e))
  canvas.onresize = e => container.handleResize(canvas.clientWidth, canvas.clientHeight)
  const fiber = renderer.createContainer(container, false, false)
  renderer.updateContainer(app, fiber, null, noop)
  return {
    unmount() {
      renderer.updateContainer(null, fiber, null, noop)
      canvas.ontouchstart = canvas.ontouchmove = canvas.ontouchend = null
      container.destory()
    }
  }
}
