export const FETCH_ENTRY = 'FETCH_ENTRY';
export const ENTRY_SELECTED = 'ENTRY_SELECTED';
import axios from 'axios';

export function fetchEntry(entries) {
  console.log('action=====fetchEntry===entries', entries);
  return {
    type: FETCH_ENTRY,
    payload: entries
  };
}

export function selectEntry(entry) {
  return {
    type: ENTRY_SELECTED,
    payload: entry
  };
}
