import React from 'react';
import { Text, View, Image } from './lib';



function App() {
  const [text, setText] = React.useState('huang')
  React.useEffect(() => {
    setTimeout(() => {
      setText(`${Math.random()}`)
    }, 1000);
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.text} >
        {text}
      </Text>
      <View style={styles.shadow} />
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg" />
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  shadow: {
    shadowBlur: 8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  text: {
    fontSize: 40,
    backgroundColor: 'red',
    height: 100,
  },
  image: {
    borderRadius: 20,
    width: 200,
    height: 100,
    translateX: 10
  }
}


export default App;
