import React from 'react';
import ReactDOM from 'react-dom';
// import { DataGetter } from './component/DataGetter';
import { MapViewer } from './component/MapViewer';

import './web/index.css';

const App = (): JSX.Element => {
  return (
    <>
      {/* <ThreeSample scale={300} /> */}
      {/* <PixiSample /> */}
      <MapViewer />
    </>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
