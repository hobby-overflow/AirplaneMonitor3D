import axios from "axios";
import React, {useEffect, useState} from "react";
import {StatusMonitorHooks} from "./StatusMonitorHooks";

const useInterval = (callback: Function, delay?: number) => {
  useEffect(() => {
    const intervalId = setInterval(() => callback(), delay || 0);
    return () => clearInterval(intervalId);
  }, [callback, delay]);
}

export const DataGetterHooks = () => {
  const [acList, setAcList] = useState();
  const [statusCode, setStatusCode] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [totalAc, setTotalAc] = useState(0);
  
  let aircraftList = {};
  console.log(aircraftList)

  let isRequestSending = false;

  useInterval(() => {
    console.log(`OnInterval ${isRequestSending}`);
    let url = 'http://localhost:8080/json';
    if (isRequestSending == false) {
      isRequestSending = true;
      axios
        .get(url)
        .then((response) => {
          aircraftList = response.data.acList;
          console.log(aircraftList);
          setStatusCode(0);
          setStatusMessage('Data receiving');
        })
        .catch(() => {
          setStatusCode(1);
          setStatusMessage("Can't access data...");
        })
        .finally(() => isRequestSending = false);
    }
  }, 1000);

  // useEffect(() => {
  //   intervalId = setInterval(() => tick(), 1000);
  //   console.log('setInterval in useEffect()')

  //   return (() => clearInterval(intervalId));
  // }, []);

  // const tick = () => {
  //   count += 1;

  //   if (count == 5) {
  //     aircraftList["JJP"] = "JA13JJ";
  //   }
  //   if (count == 7) {
  //     aircraftList["ADO"] = "JA10AN";
  //   }
  //   console.log(JSON.stringify(aircraftList));

  //   console.log(isRequestSending);
  //   let url = 'http://localhost:8080/json';
  //   if (isRequestSending == false) {
  //     isRequestSending = true;
  //     axios
  //       .get(url)
  //       .then((response) => {
  //         setAcList(response.data.acList);
  //         setStatusCode(0);
  //         setStatusMessage('Data receiving');

  //         setTotalAc(response.data.totalAc);
  //         console.log(`${response.data.totalAc}:${totalAc}`);
  //       })
  //       .catch(() => {
  //         setStatusCode(1);
  //         setStatusMessage("Can't access Data...");
  //       })
  //       .finally(() => isRequestSending = false);
  //   }
  // }
  
  return (
    <>
      <StatusMonitorHooks statusCode={statusCode} statusMessage={statusMessage} />
    </>
  );
}
