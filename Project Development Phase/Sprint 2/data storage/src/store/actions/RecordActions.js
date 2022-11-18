import { loadDataFromAPI, loadSortedDataFromLocal } from 'sources/RecordSource';

import {
  LOAD_DATA_INIT,
  LOAD_DATA_SUCCESS,
  LOAD_DATA_FAILED,
  PAGE_CHANGE,
  SEARCH_INIT,
  SEARCH_SUCCESS,
  SEARCH_FAILED,
} from 'action-labels/recordLabels';

// normal actions
export const loadDataInit = () => ({
  type: LOAD_DATA_INIT,
});

export const loadDataSuccess = data => ({
  type: LOAD_DATA_SUCCESS,
  data,
});

export const loadDataFailed = data => ({
  type: LOAD_DATA_FAILED,
  data,
});

export const pageChange = data => ({
  type: PAGE_CHANGE,
  data,
});

export const searchInit = epoch => ({
  type: SEARCH_INIT,
  data: epoch,
});

export const searchSuccess = data => ({
  type: SEARCH_SUCCESS,
  data,
});

export const searchFailed = data => ({
  type: SEARCH_FAILED,
  data,
});

// Async Action
export const loadDataAction = () => loadDataFromAPI();
export const searchDataAction = dateTime => loadSortedDataFromLocal(dateTime);
