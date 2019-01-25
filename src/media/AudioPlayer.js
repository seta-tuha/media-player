import React from 'react';
import { Consumer } from './context';

const AudioPlayer = () => (
  <Consumer>
    {
      context => (
        <button
          onClick={context.playing ? context.pause : context.play}
        >
          {context.playing ? 'pause' : 'play'} {`${context.time} / ${context.duration}`}
        </button>
      )
    }
  </Consumer>
)

export default AudioPlayer;
