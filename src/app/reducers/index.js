import { combineReducers } from 'redux';
import FetchEntry from './reducer_fetch_entry.js';
import FetchMedia from './reducer_fetch_media.js';
import EntrySelected from './reducer_entry_selected.js';

const rootReducer = combineReducers({
  entries: FetchEntry,
  entrySelected: EntrySelected,
  fetchMedia: FetchMedia
});

export default rootReducer;
