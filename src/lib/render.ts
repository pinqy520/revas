import renderer from './core/reconciler'
import { noop } from './common/utils'
import { Container } from './core/Node'


export function render(app: React.ReactNode, canvas: HTMLCanvasElement) {
  const c = renderer.createContainer(new Container(canvas), false, false)
  return renderer.updateContainer(app, c, null, noop)
}