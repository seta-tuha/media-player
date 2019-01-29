import React, { Component } from 'react';
import { string, bool, func } from 'prop-types';

import { Provider } from './context';

const initialState = {
  playing: false,
  time: 0,
  ended: false,
  duration: 0,
}

export default class MediaWrapper extends Component {
  static propTypes = {
    type: string,
    url: string.isRequired,
    autoPlay: bool,
    onPlay: func,
    onPause: func,
    onEnd: func
  }

  static defaultProps = {
    autoPlay: false,
    type: 'audio'
  }

  state = { ...initialState }

  play = () => {
    this.player && this.player.play();
  }

  pause = () => {
    this.player && this.player.pause();
  }

  seekTo = (time) => {
    this.player && this.player.seekTo(time);
  }

  setPlayerEvents = () => {
    const { autoPlay } = this.props;

    this.player.onplay = () => {
      this.setState({
        playing: true,
        ended: false
      })
      this.props.onPlay && this.props.onPlay();
      this.getTime();
    }

    this.player.onpause = () => {
      this.setState({
        playing: false
      })
      this.props.onPause && this.props.onPause();
      this.stopGettingTime();
    }

    this.player.onended = () => {
      this.setState({
        playing: false,
        time: 0,
        ended: true
      })
      this.props.onEnd && this.props.onEnd();
    }

    this.player.oncanplay = () => {
      autoPlay && this.player.play();
      this.getDuration();
    }
  }

  getTime = () => {
    this.animationFrame = requestAnimationFrame(this.getTime);
    this.setState({
      time: this.player.currentTime,
      duration: this.player.duration
    })
  }

  stopGettingTime = () => {
    cancelAnimationFrame(this.animationFrame);
  };

  getDuration = () => {
    const getDurationInterval = setInterval(() => {
      if (this.player && this.player.duration > 0) {
        this.setState({
          duration: this.player.duration
        });
        clearInterval(getDurationInterval);
      }
    }, 100);
  }

  componentDidMount() {
    const { url, mediaEl } = this.props;
    mediaEl.init(this.refs.mediaPlayer, url)
      .then(player => {
        this.player = player;
        this.setPlayerEvents();
      });
  }

  componentDidUpdate(prevProps) {
    const { url: prevUrl } = prevProps;
    const { url } = this.props;
    if (url !== prevUrl) {
      this.player.src = url;
      this.setState({
        ...initialState
      })
    }
  }

  render() {
    const { time, duration, playing, ended } = this.state;
    const { url, mediaEl } = this.props;
    const { tag: MediaPlayer } = mediaEl;

    return (
      <Provider value={{
        url,
        time,
        duration,
        playing,
        ended,
        play: this.play,
        pause: this.pause,
        seekTo: this.seekTo
      }}>
        <MediaPlayer ref="mediaPlayer" />
        {
          this.props.children
        }
      </Provider>
    )
  }
}
