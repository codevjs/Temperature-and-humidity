import React from 'react';
import ReactDOM from 'react-dom/client';
import { Connector } from 'mqtt-react-hooks';import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const isDev = false;
const url = !isDev ? "ws://36.89.54.125:1884" : "ws://localhost:1884"

root.render(
  <React.StrictMode>
      <Connector brokerUrl={url}>
        <App />
      </Connector>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
