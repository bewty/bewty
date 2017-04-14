export const FETCH_ENTRY = 'FETCH_ENTRY';
export const ACTIVE_ENTRY = 'ACTIVE_ENTRY';
import axios from 'axios';

export function fetchEntry() {
  let entries;
  axios.post('/db/retrieveEntry')
  .then( result => {
    entries = result.data;
  });
  console.log('===fetchEntry===== invoked', entries);
  return {
    type: FETCH_ENTRY,
    payload: entries
  };
}

export function clickEntry(index) {
  return {
    type: ACTIVE_ENTRY,
    index: index
  };
}
