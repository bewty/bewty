const initialState = 'https://www.youtube.com/watch?v=kffacxfA7G4';

export default function(state = initialState, action) {
  console.log('Action FETCH_MEDIA', action.payload);
  switch (action.type) {
  case 'FETCH_MEDIA':
    return action.payload;
  }
  return state;
}
