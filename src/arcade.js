import { ARCADE_CHANNELS } from './content.js';

export const ARCADE_START = { mode: 'menu', channel: 0, index: 0 };

const wrap = (i, n) => (i + n) % n;

// In list mode the last row (index === items.length) is "< BACK".
export function arcadeReducer(state, action) {
  const { mode, channel, index } = state;
  const rows = mode === 'menu' ? ARCADE_CHANNELS.length : ARCADE_CHANNELS[channel].items.length + 1;
  switch (action.type) {
    case 'up':
      return mode === 'menu' ? { ...state, channel: wrap(channel - 1, rows) } : { ...state, index: wrap(index - 1, rows) };
    case 'down':
      return mode === 'menu' ? { ...state, channel: wrap(channel + 1, rows) } : { ...state, index: wrap(index + 1, rows) };
    case 'enter':
      if (mode === 'menu') return { mode: 'list', channel, index: 0 };
      return index === rows - 1 ? { ...ARCADE_START, channel } : state;
    case 'back':
      return mode === 'list' ? { ...ARCADE_START, channel } : state;
    case 'pick':
      return mode === 'menu' ? { mode: 'list', channel: action.index, index: 0 } : arcadeReducer({ ...state, index: action.index }, { type: 'enter' });
    case 'reset':
      return ARCADE_START;
    default:
      return state;
  }
}

export const ARCADE_KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowRight: 'enter',
  Enter: 'enter',
  ' ': 'enter',
  ArrowLeft: 'back',
  Backspace: 'back',
};
