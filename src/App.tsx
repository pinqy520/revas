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
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <Image style={styles.image}
        src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg">
      </Image>
      <View style={{ ...styles.nested, maxHeight: 200, width: 200 }}>
        <View style={{ ...styles.nested, backgroundColor: 'blue' }}>
          <View style={{ ...styles.nested, backgroundColor: 'green' }}></View>
        </View>
      </View>
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
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#000'
  },
  text: {
    fontSize: 40,
    backgroundColor: 'red',
    height: 100,
    shadowBlur: 8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    textAlign: 'center'
  },
  image: {
    borderRadius: 20,
    width: 200,
    height: 100,
    translateX: 10
  },
  nested: {
    flex: 1,
    padding: 5,
    borderWidth: 5,
    margin: 5,
    borderRadius: 5,
    borderColor: '#fff',
    backgroundColor: '#000'
  }
}


export default App;
