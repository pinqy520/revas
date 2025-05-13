import { Touchable, Image } from '../../revas';
import backIcon from '../back.png';

export default function Back(props: any) {
  return (
    <Touchable style={styles.back} onPress={props.router.pop}>
      <Image style={styles.backImg} src={backIcon} />
    </Touchable>
  );
}

const styles = {
  back: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  backImg: {
    width: 49,
    height: 50,
  },
};
