import { loadJS } from '../utils';

export default {
  tag: 'div',
  init(el, url) {
    return new Promise(resolve => {
      const onYouTubeIframeAPIReady = () => {
        const youtubePlayer = {};
        let animationFrame = null;
        
        const player = new window.YT.Player(el, {
          height: '390',
          width: '640',
          playerVars: {
            controls: 0,
            enablejsapi: 0,
            origin: 'http://localhost:3000'
          },
          videoId: url,
          events: {
            'onReady': () => { youtubePlayer.oncanplay && youtubePlayer.oncanplay() },
            'onStateChange': (event) => {
              switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                  youtubePlayer.onplay && youtubePlayer.onplay();
                  getTime();
                  break;
                case window.YT.PlayerState.PAUSED:
                  youtubePlayer.onpause && youtubePlayer.onpause();
                  stopGettingTime();
                  break;
                case window.YT.PlayerState.ENDED:
                  youtubePlayer.onended && youtubePlayer.onended();
                  stopGettingTime();
                  break;
                default:
                  break;
              }
            }
          }
        });
        youtubePlayer.play = () => player.playVideo();
        youtubePlayer.pause = () => player.pauseVideo();
        youtubePlayer.stop = () => player.stopVideo();
        const getTime = () => {
          animationFrame = requestAnimationFrame(getTime);
          youtubePlayer.currentTime = player.getCurrentTime();
          youtubePlayer.ontimeupdate();
        }
        const stopGettingTime = () => {
          cancelAnimationFrame(animationFrame);
        }
        Object.defineProperty(youtubePlayer, 'src', { set(url) { player.loadVideoById(url); }})
        Object.defineProperty(youtubePlayer, 'duration', { get() { return player.getDuration(); } })
        resolve(youtubePlayer);
      };
      loadJS("https://www.youtube.com/iframe_api", 'youtubeAPI')
        .then(() => {
          window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        });
    });
  }
}