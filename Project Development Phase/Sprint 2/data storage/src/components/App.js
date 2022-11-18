import React, { Component } from 'react';
import { Layout, BackTop } from 'antd';

import RecordTable from 'components/RecordTable';
import Pagination from 'components/Pagination';

import AppHeader from 'components/AppHeader';
import AppFooter from 'components/AppFooter';

import './App.css';
import SearchBox from './SearchBox';

const { Content } = Layout;

class App extends Component {
  componentDidMount() {
    const { loadData } = this.props;
    loadData();
  }

  onChangePage = (pageNo) => {
    const { pageChange } = this.props;
    pageChange(pageNo);
  }

  render() {
    const {
      records, isLoading,
      pageNo, pageSize, totalRecords,
      showingSearchData, searchEpoch,
      clearSearch, searchData,
    } = this.props;
    return (
      <Layout className="layout">
        <BackTop />
        <AppHeader />
        <Content className="container">
          <div className="content">
            <SearchBox
              showingSearchData={showingSearchData}
              searchEpoch={searchEpoch}
              clearSearch={clearSearch}
              searchData={searchData}
            />
            <RecordTable records={records} isLoading={isLoading} />
            <Pagination
              showingNow={records && records.length}
              pageNo={pageNo}
              pageSize={pageSize}
              totalRecords={totalRecords}
              changePage={this.onChangePage}
            />
          </div>
        </Content>
        <AppFooter />
      </Layout>);
  }
}

export default App;
