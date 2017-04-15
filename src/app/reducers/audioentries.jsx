const audioentries = (state = null, action) => {
  switch (action.type) {
  case 'SET_SOURCE_URL':
    return action.url;
  default:
    return state;
  }
};

export default audioentries;