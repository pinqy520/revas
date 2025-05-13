import audio1_mp4 from './assets/1.mp4';
import audio2_mp4 from './assets/2.mp4';
import audio3_mp4 from './assets/3.mp4';
import audio4_mp4 from './assets/4.mp4';
import audio5_mp4 from './assets/5.mp4';
import audio6_mp4 from './assets/6.mp4';
import audio7_mp4 from './assets/7.mp4';

export type MusicItemData = {
  cover: string;
  name: string;
  singer: string;
  audio: string;
  color: string[];
};

export const MUSICS: MusicItemData[] = [
  {
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R800x800M0000029RLCx073L80_1.jpg?max_age=2592000',
    name: '10001次勇敢',
    singer: '黄祺/宋尚聪',
    audio: audio1_mp4,
    color: ['#E97386', '#FF3A5A'],
  },
  {
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R800x800M000001lBO2g06byXx_1.jpg?max_age=2592000',
    name: '平川',
    singer: '黄祺/青猫',
    audio: audio2_mp4,
    color: ['#B9C9CF', '#8398A1'],
  },
  {
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R800x800M0000005ebyp0K463w_1.jpg?max_age=2592000',
    name: '二九',
    singer: '黄祺',
    audio: audio3_mp4,
    color: ['#CEE0DF', '#B0BABC'],
  },
  {
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R800x800M000002DksTu0yG818_1.jpg?max_age=2592000',
    name: '想要一颗心',
    singer: '黄祺',
    audio: audio4_mp4,
    color: ['#1D1C26', '#21191F'],
  },
  {
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R800x800M0000038SQcl1z2iC8_1.jpg?max_age=2592000',
    name: '虚拟世界',
    singer: '黄祺',
    audio: audio5_mp4,
    color: ['#54626C', '#112430'],
  },
  {
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R800x800M000003toMGg4DAw3Y_1.jpg?max_age=2592000',
    name: '愚人自扰',
    singer: '黄祺',
    audio: audio7_mp4, // Note: This was asset 7.mp4 in original
    color: ['#555555', '#0B0908'],
  },
  {
    cover:
      'https://y.gtimg.cn/music/photo_new/T002R800x800M000004OXwe91yrzZK_1.jpg?max_age=2592000',
    name: '回音墙',
    singer: '黄祺',
    audio: audio6_mp4,
    color: ['#6B55CE', '#512A69'],
  },
];
