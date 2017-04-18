export default (state = {}, action) => {
  switch (action.type) {
  case 'SET_SOURCE_URL':
    return {
      src: action.url
    };
  case 'STOP_RECORD_AND_SET':
    return {
      blob: action.blob,
      stop: action.stop,
      src: action.url
    };
  case 'SET_START_STATE':
    return {
      start: action.start
    };
  default:
    return state;
  }
};
