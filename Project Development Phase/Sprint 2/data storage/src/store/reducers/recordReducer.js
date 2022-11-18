/* eslint-disable no-param-reassign */
import * as recordLabels from 'action-labels/recordLabels';

import { PAGE_SIZE } from 'config/constants';

const initialState = {
  dataList: [],
  isLoading: false,
  pageNo: 1,
  pageSize: PAGE_SIZE,
  records: [],
  totalRecords: 0,
  showingSearchData: false,
  searchEpoch: null,
};

export default function recordReducer(state = initialState, action) {
  switch (action.type) {
    case recordLabels.SEARCH_INIT: {
      state = Object.assign({}, initialState, {
        isLoading: true,
        pageNo: 1,
        searchEpoch: action.data,
        showingSearchData: true,
      });
      return state;
    }
    case recordLabels.LOAD_DATA_INIT: {
      state = Object.assign({}, initialState, {
        isLoading: true,
        pageNo: 1,
        searchEpoch: null,
        showingSearchData: false,
      });
      return state;
    }
    case recordLabels.SEARCH_SUCCESS:
    case recordLabels.LOAD_DATA_SUCCESS: {
      const { dataList, totalRecords } = action.data;
      state = Object.assign({}, state, {
        dataList,
        records: dataList.slice(0, PAGE_SIZE),
        totalRecords,
        isLoading: false,
        pageNo: 1,
      });
      return state;
    }
    case recordLabels.SEARCH_FAILED:
    case recordLabels.LOAD_DATA_FAILED: {
      state = Object.assign({}, state, { isLoading: false });
      return state;
    }
    case recordLabels.PAGE_CHANGE: {
      const pageNo = action.data;
      const { dataList } = state;
      const start = (pageNo - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      state = Object.assign({}, state, { pageNo, records: dataList.slice(start, end) });
      return state;
    }
    default:
      return state;
  }
}
