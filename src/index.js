import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import NameForm from './nameform';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<div><App /><NameForm /></div>, document.getElementById('root'));
registerServiceWorker();
