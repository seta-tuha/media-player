import { loadJS } from '../utils';

export default function getPlayer(url, type, el) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject('No url provided')
    }

    switch (type) {
      case 'audio':
        const audioPlayer = new Audio();
        audioPlayer.oncanplay = (e) => {
          resolve(audioPlayer);
        };
        audioPlayer.src = url;
        break;

      case 'video':
        if (el) {
          el.oncanplay = (e) => {
            resolve(el);
          }
          el.src = url;
        }
        break;

      case 'youtube':
        if(!el) {
          break;
        }
        var player = null;
        const onYouTubeIframeAPIReady = () => {
          const youtubePlayer = {};
          let animationFrame = null;
          const getTime = () => {
            animationFrame = requestAnimationFrame(getTime);
            youtubePlayer.currentTime = player.getCurrentTime();
            youtubePlayer.ontimeupdate();
          }
          const stopGettingTime = () => {
            cancelAnimationFrame(animationFrame);
          }
          player = new window.YT.Player(el, {
            height: '390',
            width: '640',
            playerVars: {
              controls: 0,
              enablejsapi: 0,
              origin: 'http://localhost:3000'
            },
            videoId: url,
            events: {
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
                  case window.YT.PlayerState.CUED:
                    youtubePlayer.duration = player.getDuration();
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
          const getPlayerDurationInterval = setInterval(() => {
            if (player && player.getDuration && player.getDuration()) {
              youtubePlayer.duration = player.getDuration();
              clearInterval(getPlayerDurationInterval);
              resolve(youtubePlayer);
            }
          }, 100);
        };

        loadJS("https://www.youtube.com/iframe_api", 'youtubeAPI')
          .then(() => {
            if (window.onYouTubeIframeAPIReady) {
              player.loadVideoById(url);
            } else {
              window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
            }
          });

        break;
      default:
        reject('Unsupported type');
    }
  })
}
