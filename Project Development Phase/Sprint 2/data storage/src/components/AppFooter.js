import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Footer style={{ textAlign: 'center' }}>
      IBM TEAM ID-PNT2022TMID36015 ©&nbsp;
      {currentYear}
    </Footer>);
};

export default AppFooter;
