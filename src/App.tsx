import React from 'react';
import ReactDOM from 'react-dom';

import { AxiosGet } from './component/AxiosGet';

import './web/index.css';

const App = (): JSX.Element => {
  return (
    <>
      {/* <ThreeSample scale={300} /> */}
      {/* <PixiSample /> */}
      {/* <MapViewer /> */}
      <AxiosGet value={ null } />
    </>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
