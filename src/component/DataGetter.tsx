import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AircraftList } from '../class/AircraftList';
import { AcDatabaseHooks } from './acDatabaseHooks';
import { AircraftDatabase } from './AircraftDatabase';
import { StatusMonitor } from './StatusMonitor';

const useInterval = (callback: Function, delay?: number) => {
  useEffect(() => {
    const intervalId = setInterval(() => callback(), delay || 0);
    return () => clearInterval(intervalId);
  }, [callback, delay]);
};

export const DataGetter = () => {
  const [acList, setAcList] = useState();
  const [statusCode, setStatusCode] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  let isRequestSending = false;

  useInterval(() => {
    let url = 'http://localhost:8080/json';
    if (isRequestSending == false) {
      isRequestSending = true;
      axios
        .get(url)
        .then((response) => {
          setStatusCode(0);
          setStatusMessage('Data receiving');
          setAcList(response.data.acList);
        })
        .catch(() => {
          setStatusCode(1);
          setStatusMessage("Can't access data...");
        })
        .finally(() => (isRequestSending = false));
    }
  }, 1000);

  return (
    <>
      <StatusMonitor statusCode={statusCode} statusMessage={statusMessage} />
      <AcDatabaseHooks acList={new AircraftList(acList)} />
    </>
  );
};
