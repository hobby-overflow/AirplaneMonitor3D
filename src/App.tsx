import React from 'react';
import ReactDOM from 'react-dom';
import { DataGetterHooks } from './component/DataGetterHooks';

import './web/index.css';

const App = (): JSX.Element => {
  return (
    <>
      {/* <ThreeSample scale={300} /> */}
      {/* <PixiSample /> */}
      {/* <MapViewer /> */}
      <DataGetterHooks />
    </>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
