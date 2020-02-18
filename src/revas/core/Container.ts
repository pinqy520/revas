import { Node, RevasTouch, RevasTouchEvent } from './Node'
import { updateLayout } from './layout'
import { drawNode } from './draw'
import { getNodeByTouch, emitTouch } from './touch'

function createRevasTouchEvent(e: TouchEvent): RevasTouchEvent {
  const touches: { [key: number]: RevasTouch } = {}
  const type: any = e.type === 'touchcancel' ? 'touchend' : e.type
  Object.values(e.changedTouches).forEach(touch => {
    touches[touch.identifier] = {
      identifier: touch.identifier,
      x: touch.clientX, y: touch.clientY
      // TODO: assume canvas fully the screen
    }
  })
  return { type, touches, timestamp: e.timeStamp || Date.now() }
}

export class Container extends Node {
  private _ready = true
  private _next = false

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    super('root', {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    })
    canvas.ontouchstart = this._handleTouch
    canvas.ontouchmove = this._handleTouch
    canvas.ontouchend = this._handleTouch
    canvas.ontouchcancel = this._handleTouch
  }

  // TODO: tempor solution
  private _handleTouch = (e: TouchEvent) => {
    const evt = createRevasTouchEvent(e)
    const emitted = new WeakSet<Node>()
    Object.values(evt.touches).forEach(touch => {
      const node = getNodeByTouch(this, evt.type, touch)
      if (!emitted.has(node)) {
        emitted.add(node)
        emitTouch(node, evt)
      }
    })
  }

  public draw = () => {
    if (this._ready === false) {
      this._next = true;
      return;
    }
    this._ready = false;
    // console.log('draw')
    updateLayout(this)()
    const ctx = this.canvas.getContext('2d')!
    ctx.clearRect(0, 0, this.props.width, this.props.height);
    drawNode(ctx, this)
    requestAnimationFrame(this.ready);
  }

  private ready = () => {
    this._ready = true;
    if (this._next) {
      this._next = false;
      this.draw();
    }
  }
}