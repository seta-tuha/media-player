export default {
  tag: 'audio',
  init(el, url) {
    el.src = url;
    return Promise.resolve(el);
  },
}