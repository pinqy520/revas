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
    <View backgroundColor="yellow" flexGrow={1} justifyContent="center">
      <Text fontSize={50} backgroundColor="red" height={100} >
        {text}
      </Text>
      <View backgroundColor={'red'} width={100} height={100} />
      <Image src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg" borderRadius={20} width={200} height={100} />
    </View>
  )
}


export default App;
