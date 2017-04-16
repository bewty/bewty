const initialState = 'https://www.youtube.com/watch?v=kffacxfA7G4';

export default function(state = initialState, action) {
  switch (action.type) {
  case 'FETCH_MEDIA':
    return action.payload;
  }
  return state;
}
