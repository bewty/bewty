export const FETCH_ENTRY = 'FETCH_ENTRY';
export const ENTRY_SELECTED = 'ENTRY_SELECTED';
export const FETCH_MEDIA = 'FETCH_MEDIA';
import axios from 'axios';

export function fetchEntry(entries) {
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

export function fetchMedia(url) {
  console.log('action=====fetchMedia===url', url);
  return {
    type: FETCH_MEDIA,
    payload: url
  };
}

