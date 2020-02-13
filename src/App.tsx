import React from 'react';
// import logo from './logo.svg';
import test from './lib'
import './App.css';
import Text from './lib/Text';
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
  const [text, setText] = React.useState('huang')
  React.useEffect(() => {
    setTimeout(() => {
      setText(`${Math.random()}`)
    }, 1000);
  }, [])
  return (
    <View backgroundColor="yellow" flexGrow={1} justifyContent="center">
      <Text fontSize={50} backgroundColor="red" height={100} >
        {text}
      </Text>
      <View backgroundColor={'red'} width={100} height={100} />
    </View>
  )
}


export default App;
