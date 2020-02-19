import renderer from './core/reconciler'
import { noop } from './core/utils'
import { Container } from './core/Container'

export function render(app: React.ReactNode, canvas: HTMLCanvasElement) {
  const container = new Container(canvas)
  const fiber = renderer.createContainer(container, false, false)
  renderer.updateContainer(app, fiber, null, noop)
  return {
    unmount() {
      renderer.updateContainer(null, fiber, null, noop)
      container.destory()
    }
  }
}
