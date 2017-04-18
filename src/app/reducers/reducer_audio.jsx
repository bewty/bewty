export default (state = {}, action) => {
  switch (action.type) {
  case 'SET_SOURCE_URL':
    return Object.assign({}, state, {
      src: action.url
    });
  case 'STOP_RECORD_AND_SET':
    return Object.assign({}, state, {
      blob: action.blob,
      stop: action.stop,
      src: action.url
    });
  case 'SET_START_STATE':
    return Object.assign({}, state, {
      start: action.start
    });
  case 'RESET_START_STOP':
    return Object.assign({}, state, {
      start: action.start,
      stop: action.stop
    });
  case 'SET_START_AND_TRANSCRIPT':
    return Object.assign({}, state, {
      start: action.start,
      transcript: action.transcript
    });
  default:
    return state;
  }
};
