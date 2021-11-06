import React from 'react';
import ReactDOM from 'react-dom';
import { DataGetter } from './component/DataGetter';

import "./web/index.css";

const App = (): JSX.Element => {
  console.log(new Date().toLocaleTimeString());
  return (
    <>
      {/* <ThreeSample scale={300} /> */}
      {/* <PixiSample /> */}
      <DataGetter />
    </>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));