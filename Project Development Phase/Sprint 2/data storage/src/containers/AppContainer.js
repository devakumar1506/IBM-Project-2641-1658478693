import { connect } from 'react-redux';
import App from 'components/App';

import {
  pageChange,
  loadDataAction,
  searchDataAction,
} from 'store/actions/RecordActions';

function mapStateToProps(state) {
  const { record } = state;
  const {
    pageNo, pageSize, isLoading, records, totalRecords,
    showingSearchData, searchEpoch,
  } = record;
  return {
    records,
    isLoading,
    pageNo,
    pageSize,
    totalRecords,
    showingSearchData,
    searchEpoch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadData: () => dispatch(loadDataAction()),
    clearSearch: () => dispatch(loadDataAction()),
    pageChange: pageNo => dispatch(pageChange(pageNo)),
    searchData: dateTime => dispatch(searchDataAction(dateTime)),
  };
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
