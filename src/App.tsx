import React from 'react';
import ReactDOM from 'react-dom';
import { DataGetter } from './component/DataGetter';

import './web/index.css';

const App = (): JSX.Element => {
  return (
    <>
      {/* <ThreeSample scale={300} /> */}
      {/* <PixiSample /> */}
      {/* <MapViewer /> */}
      <DataGetter />
    </>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
