import React from 'react';
import {
  Affix, Layout,
} from 'antd';

const { Header } = Layout;

const AppHeader = () => (
  <Affix>
    <Header>
      <div className="header-logo" />
      <h2 className="header-heading">
        Indexed DB Search
      </h2>
    </Header>
  </Affix>
);

export default AppHeader;
