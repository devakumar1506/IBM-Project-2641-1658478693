import {
  loadDataInit,
  loadDataSuccess,
  searchInit,
  searchSuccess,
} from 'store/actions/RecordActions';

import { putBulkData, getData } from 'utils/indexedDB';

import normalize from 'normalizers/recordsList';

import records from 'sources/recordGenerator';
import { PAGE_SIZE } from 'config/constants';

const RECORD_SOURCE_KEY = 'rs-last-downloaded';

export const loadDataFromAPI = () => (async (dispatch) => {
  dispatch(loadDataInit());

  // Checking for local copy before making API call
  const lastDownloaded = localStorage.getItem(RECORD_SOURCE_KEY);
  if (lastDownloaded) {
    const recordsData = await getData(null) || [];
    dispatch(loadDataSuccess({
      dataList: recordsData,
      totalRecords: recordsData.length,
    }));
    return;
  }

  // Local data not found (or stale), making (mocking) API call
  await setTimeout(() => {}, 2000);
  const recordsNormalized = normalize(records);
  putBulkData(recordsNormalized);
  localStorage.setItem(RECORD_SOURCE_KEY, new Date().getTime());
  dispatch(loadDataSuccess({
    dataList: recordsNormalized.slice(0, PAGE_SIZE),
    totalRecords: recordsNormalized.length,
  }));
});

export const loadSortedDataFromLocal = lowerBound => (async (dispatch) => {
  dispatch(searchInit(lowerBound));
  const recordsData = await getData(null, lowerBound, true) || [];
  dispatch(searchSuccess({
    dataList: recordsData,
    totalRecords: recordsData.length,
  }));
});
