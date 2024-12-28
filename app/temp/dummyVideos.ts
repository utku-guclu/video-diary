export const dummyVideos = [
    {
      id: '1',
      title: 'Beach Sunset',
      description: 'Beautiful sunset at the beach',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      createdAt: Date.now(),
      thumbnail: 'https://picsum.photos/200/300',
      duration: 120
    },
    {
      id: '2',
      title: 'Mountain Hiking',
      description: 'Adventure in the mountains',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      createdAt: Date.now() - 86400000,
      thumbnail: 'https://picsum.photos/200/300',
      duration: 180
    }
  ];

  export default dummyVideos;