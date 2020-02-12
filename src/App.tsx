import React from 'react';
// import logo from './logo.svg';
import test from './lib'
import './App.css';
import View from './lib/View';
// import { Node } from './lib/Node';




class App extends React.Component<any> {
  canvas = React.createRef<HTMLCanvasElement>()
  componentDidMount() {
    test.render(
      React.createElement(Test),
      this.canvas.current!
    )
  }
  render() {
    return <canvas ref={this.canvas} width={500} height={500} />
  }
}

function Test() {
  // const [size, setSize] = React.useState(100)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setSize(200 * Math.random())
  //   }, 100);
  // }, [])
  // return React.createElement('View', { width: 400, height: 400, backgroundColor: '#000', borderRadius: 50 },
  //   React.createElement('View', { width: 100, height: 100, backgroundColor: 'yellow', borderRadius: 10 }),
  //   React.createElement('View', { width: size, height: size, backgroundColor: 'red', borderRadius: 10 }),
  //   React.createElement('View', { width: 100, height: 100, backgroundColor: 'blue', borderRadius: 10 })
  // )
  return (
    <View width={400} height={400} backgroundColor="black">
      <View width={200} height={200} backgroundColor="red" />
    </View>
  )
}


export default App;
