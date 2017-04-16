const initialState = {'watson_results': '', 'text': '', 'entry_type': '', '_id': '', 'tags': [ ], 'audio': {'key': null, 'bucket': null}, 'video': {'avg_data': null, 'key': null, 'bucket': null, 'raw_data': null}, 'created_at': ''};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'ENTRY_SELECTED':
    return action.payload;
  }
  return state;
}
