import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRoot from './AppRoot';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppRoot />, document.getElementById('root'));
registerServiceWorker();
