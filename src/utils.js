export function loadJS(src, libraryName) {
  return new Promise(function (resolve, reject) {
    ((d, s, id, cb) => {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        setTimeout(resolve, 0);
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = src;
      fjs.parentNode.insertBefore(js, fjs);
      js.onload = resolve;
      js.onerror = reject;
    })(document, 'script', libraryName);
  })
}
