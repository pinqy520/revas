import renderer from './core/reconciler'
import { noop } from './core/utils'
import { Container } from './core/Node'

export default {
  render(app: React.ReactNode, canvas: HTMLCanvasElement) {
    const c = renderer.createContainer(new Container(canvas), false, false)
    return renderer.updateContainer(app, c, null, noop)
  }
}