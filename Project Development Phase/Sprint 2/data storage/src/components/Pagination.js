/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';

const ButtonGroup = Button.Group;

const PAGE_BUTTON_LIMIT = 10;

const getPageButtons = (pageNo, pageSize, totalRecords, changePage) => {
  const showPageNos = [];
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  let pageToAdd = pageNo - Math.floor(PAGE_BUTTON_LIMIT / 2);

  if (pageNo + PAGE_BUTTON_LIMIT - 1 > totalPages) {
    pageToAdd = totalPages - PAGE_BUTTON_LIMIT + 1;
  }
  if (pageNo === 1 || pageToAdd < 1) {
    pageToAdd = 1;
  }
  while (showPageNos.length < PAGE_BUTTON_LIMIT && pageToAdd <= totalPages) {
    showPageNos.push(pageToAdd);
    pageToAdd += 1;
  }
  return showPageNos.map(pNo => (
    <Button
      key={pNo}
      disabled={pNo === pageNo}
      onClick={() => { changePage(pNo); }}
    >
      {pNo}
    </Button>
  ));
};

class Pagination extends Component {
  onChangePage = (newPageNo) => {
    const {
      pageNo, pageSize, totalRecords, changePage,
    } = this.props;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    if (newPageNo > 0 && newPageNo !== pageNo
      && newPageNo <= totalPages) {
      changePage(newPageNo);
    }
  };

  render() {
    const {
      pageNo, pageSize, totalRecords, showingNow,
    } = this.props;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    const pageButtons = getPageButtons(pageNo, pageSize, totalRecords, this.onChangePage);
    const start = !showingNow ? 0 : ((pageNo - 1) * pageSize) + 1;
    const end = !showingNow ? 0 : start + showingNow - 1;
    const pageDetails = `Showing ${start} to ${end} of ${totalRecords || 0}`;
    return (
      <Row type="flex" align="middle">
        <Col span={6}>
          {pageDetails}
        </Col>
        <Col span={18}>
          <ButtonGroup>
            <Button
              key="previous"
              disabled={pageNo === 1}
              onClick={() => { this.onChangePage(pageNo - 1); }}
            >
              &lt;
            </Button>
            {pageButtons}
            <Button
              key="next"
              disabled={pageNo === totalPages}
              onClick={() => { this.onChangePage(pageNo + 1); }}
            >
              &gt;
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    );
  }
}

export default Pagination;
