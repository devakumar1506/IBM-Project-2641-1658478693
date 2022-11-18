import React, { Component } from 'react';

import {
  Row, Col, Input, Icon, Button, notification,
} from 'antd';

import { isValidDate } from 'utils/date';

const { Search } = Input;

class SearchBox extends Component {
  state = {
    searchTerm: '',
  }

  onSearch = (value) => {
    const { searchData, searchEpoch } = this.props;
    if (!isValidDate(value)) {
      notification.error({
        message: 'Invalid date',
        description: 'Please enter date in MM/DD/YYYY format',
      });
      return;
    }

    const epoch = new Date(value).getTime();

    if (epoch !== searchEpoch) searchData(epoch);
  }

  onSearchTermChange = (e) => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm });
  }

  onClearSearch = () => {
    const { clearSearch } = this.props;
    this.setState({ searchTerm: '' });
    clearSearch();
  }

  render() {
    const { showingSearchData, searchEpoch } = this.props;
    const { searchTerm } = this.state;
    return (
      <div>
        <Row gutter={16}>
          <Col span={showingSearchData ? 23 : 24}>
            <Search
              onSearch={this.onSearch}
              onChange={this.onSearchTermChange}
              value={searchTerm}
              placeholder="Search for records after departure date (e.g. 03/25/2018)"
              enterButton
            />
          </Col>
          {showingSearchData && (
            <Col span={1}>
              <Button
                type="primary"
                shape="circle"
                onClick={this.onClearSearch}
              >
                <Icon type="close" />
              </Button>
            </Col>)}
        </Row>
        {showingSearchData && (
          <div style={{ margin: '10px 0' }}>
            {`Records where departure date is after: ${new Date(searchEpoch).toDateString()}`}
          </div>
        )}
      </div>);
  }
}

export default SearchBox;
