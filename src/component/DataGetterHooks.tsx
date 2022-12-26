import axios from "axios";
import React, {useEffect, useState} from "react";
import {StatusMonitorHooks} from "./StatusMonitorHooks";

export const DataGetterHooks = () => {
  const [acList, setAcList] = useState({});
  const [statusCode, setStatusCode] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [totalAc, setTotalAc] = useState(0);

  let intervalId: any;
  let isRequestSending = false;

  useEffect(() => {
    intervalId = setInterval(() => tick(), 1000);
    console.log('setInterval in useEffect()')

    return (() => clearInterval(intervalId));
  }, []);

  const tick = () => {
    let url = 'http://localhost:8080/json';
    if (isRequestSending == false) {
      isRequestSending = true;
      axios
        .get(url)
        .then((response) => {
          setAcList(response.data.acList);
          setStatusCode(0);
          setStatusMessage('Data receiving');

          setTotalAc(response.data.totalAc);
          console.log(`${response.data.totalAc}:${totalAc}`);
        })
        .catch(() => {
          setStatusCode(1);
          setStatusMessage("Can't access Data...");
        })
        .finally(() => isRequestSending = false);
    }
  }
  
  return (
    <>
      <StatusMonitorHooks statusCode={statusCode} statusMessage={statusMessage} />
    </>
  );
}
