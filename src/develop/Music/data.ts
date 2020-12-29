export type MusicItemData = {
  cover: string;
  name: string;
  singer: string;
  audio: string;
  color: string[];
};

export const MUSICS: MusicItemData[] = [
  {
    cover: 'https://y.gtimg.cn/music/photo_new/T002R800x800M0000029RLCx073L80_1.jpg?max_age=2592000',
    name: '10001次勇敢',
    singer: '黄祺/宋尚聪',
    audio: require('./assets/1.mp4').default,
    color: ['#E97386', '#FF3A5A'],
  },
  {
    cover: 'https://y.gtimg.cn/music/photo_new/T002R800x800M000001lBO2g06byXx_1.jpg?max_age=2592000',
    name: '平川',
    singer: '黄祺/青猫',
    audio: require('./assets/2.mp4').default,
    color: ['#B9C9CF', '#8398A1'],
  },
  {
    cover: 'https://y.gtimg.cn/music/photo_new/T002R800x800M0000005ebyp0K463w_1.jpg?max_age=2592000',
    name: '二九',
    singer: '黄祺',
    audio: require('./assets/3.mp4').default,
    color: ['#CEE0DF', '#B0BABC'],
  },
  {
    cover: 'https://y.gtimg.cn/music/photo_new/T002R800x800M000002DksTu0yG818_1.jpg?max_age=2592000',
    name: '想要一颗心',
    singer: '黄祺',
    audio: require('./assets/4.mp4').default,
    color: ['#1D1C26', '#21191F'],
  },
  {
    cover: 'https://y.gtimg.cn/music/photo_new/T002R800x800M0000038SQcl1z2iC8_1.jpg?max_age=2592000',
    name: '虚拟世界',
    singer: '黄祺',
    audio: require('./assets/5.mp4').default,
    color: ['#54626C', '#112430'],
  },
  {
    cover: 'https://y.gtimg.cn/music/photo_new/T002R800x800M000003toMGg4DAw3Y_1.jpg?max_age=2592000',
    name: '愚人自扰',
    singer: '黄祺',
    audio: require('./assets/7.mp4').default,
    color: ['#555555', '#0B0908'],
  },
  {
    cover: 'https://y.gtimg.cn/music/photo_new/T002R800x800M000004OXwe91yrzZK_1.jpg?max_age=2592000',
    name: '回音墙',
    singer: '黄祺',
    audio: require('./assets/6.mp4').default,
    color: ['#6B55CE', '#512A69'],
  },
];
