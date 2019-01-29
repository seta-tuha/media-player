export default {
  tag: 'audio',
  init(el, url) {
    el.src = url;
    el.seekTo = (time) => {
      el.currentTime = time;
    }
    return Promise.resolve(el);
  },
}
