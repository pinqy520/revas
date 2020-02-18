import renderer from './core/reconciler'
import { noop } from './core/utils'
import { Container } from './core/Container'

export function render(app: React.ReactNode, canvas: HTMLCanvasElement) {
  const c = renderer.createContainer(new Container(canvas), false, false)
  renderer.updateContainer(app, c, null, noop)
}