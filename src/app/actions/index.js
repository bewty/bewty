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
  return {
    type: FETCH_MEDIA,
    payload: url
  };
}

export const setSourceUrl = (url) => {
  return {
    type: 'SET_SOURCE_URL',
    url
  };
};

export const stopRecordAndSet = (blob, stop, url) => {
  return {
    type: 'STOP_RECORD_AND_SET',
    blob,
    stop,
    url
  };
};

export const setStartState = (start) => {
  return {
    type: 'SET_START_STATE',
    start
  };
};

export const resetStartStop = (start, stop) => {
  return {
    type: 'RESET_START_STOP',
    start,
    stop
  };
};
