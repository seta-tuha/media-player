import React, { Component } from 'react';
import { string, bool, func } from 'prop-types';

import { Provider } from './context';
import getPlayer from './utils';

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

  setPlayerEvents = () => {
    this.player.onplay = () => {
      this.setState({
        playing: true,
        ended: false
      })
      this.props.onPlay && this.props.onPlay();
    }

    this.player.onpause = () => {
      this.setState({
        playing: false
      })
      this.props.onPause && this.props.onPause();
    }

    this.player.onended = () => {
      this.setState({
        playing: false,
        time: 0,
        ended: true
      })
      this.props.onEnd && this.props.onEnd();
    }

    this.player.ontimeupdate = () => {
      this.setState({
        time: this.player.currentTime
      })
    }
  }

  componentDidMount() {
    const { type, url, autoPlay, videoEl } = this.props;
    getPlayer(url, type, videoEl)
      .then(player => {
        this.player = player;
        this.setState({
          duration: this.player.duration
        });
        this.setPlayerEvents();
        autoPlay && this.player.play();
      });
  }

  componentDidUpdate(prevProps) {
    const { url: prevUrl, videoEl: prevVideoEl } = prevProps;
    const { url, type, autoPlay, videoEl } = this.props;

    if (url !== prevUrl || videoEl !== prevVideoEl) {
      console.log('change url')
      getPlayer(url, type, videoEl)
        .then(player => {
          console.log(player);
          this.player = player;
          this.setState({
            ...initialState,
            duration: this.player.duration
          });
          this.setPlayerEvents();
          autoPlay && this.player.play();
        })
    }
  }

  render() {
    const { time, duration, playing, ended } = this.state;
    const { url } = this.props;
    return (
      <Provider value={{
        url,
        time,
        duration,
        playing,
        ended,
        play: this.play,
        pause: this.pause
      }}>
        {
          this.props.children
        }
      </Provider>
    )
  }
}
