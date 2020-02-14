import * as React from 'react'
import * as imageLoader from './imageLoader'
import drawImage from './drawer/drawImage'

export default class ImageView extends React.Component<any> {
  state = {
    ready: false
  }
  componentDidMount() {
    if (this.props.src) {
      imageLoader.get(this.props.src, this.onReady)
    }
  }
  componentDidUpdate(prev: any) {
    if (prev.src !== this.props.src) {
      if (prev.src)
        imageLoader.remove(prev.src, this.onReady)
      if (this.props.src)
        imageLoader.get(this.props.src, this.onReady)
    }
  }
  componentWillUnmount() {
    if (this.props.src)
      imageLoader.remove(this.props.src, this.onReady)
  }
  onReady = () => {
    this.setState({ ready: true })
  }
  render() {
    return React.createElement('Image', {
      customDrawer: this.state.ready ? drawImage : void 0,
      ...this.props
    })
  }
}
