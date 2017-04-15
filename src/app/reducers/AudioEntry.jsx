const AudioEntry = (state = {}, action) => {
  switch (action.type) {
  case 'SET_SOURCE_URL':
    return {
      url: action.url
    };
  default:
    return state;
  }
};

const AudioEntries = (state = [], action) => {
  switch (action.type) {
  case 'SET_SOURCE_URL':
    return [
      ...state,
      AudioEntry(undefined, action)
    ];
  default:
    return state;
  }
};

export default AudioEntries;