import * as React from 'react';
import { View } from '../../revas';
import NavBar from './Navbar';


export default function Components(props: any) {
  return (
    <View>
      <NavBar title="Component" {...props} />
    </View>
  );
}