import React from 'react';
import { Consumer } from './context';

const SimplePlayer = () => (
  <Consumer>
    {
      context => (
        <div>
          <button onClick={() => context.seekTo(context.time - 10)}>backward</button>
          <button
            onClick={context.playing ? context.pause : context.play}
          >
            {context.playing ? 'pause' : 'play'} {`${context.time.toFixed(2)} / ${context.duration.toFixed(2)}`}
          </button>
          <button onClick={() => context.seekTo(context.time + 10)}>forward</button>
        </div>
      )
    }
  </Consumer>
)

export default SimplePlayer;
