import React, { useEffect, useRef, useState } from 'react';
import { Aircraft } from '../class/Aircraft';
// import { AircraftList } from '../class/AircraftList';
// import { Ac3DViewer } from './Ac3DViewerHooks';
// import { Aircraft3DViewer } from './Aircraft3DViewer';
import { AircraftTable } from './AircraftTable';
import { MapHooks } from './MapHooks';

// ここがコントローラーを担うことになってしまった
export const AcDatabaseHooks = (props: any) => {
  const receivedAircraft = useRef(new Set<string>());

  const Database: { [key: string]: Aircraft } = {};
  const [aircraftDatabase] = useState(Database);

  const [addAcList] = useState(new Array<Aircraft>());
  const [updateAcList] = useState(new Array<Aircraft>());
  const [removeAcList] = useState(new Array<Aircraft>());

  function clearList(list: object[]) {
    list.length = 0;
  }

  const isDuplicated = (ac: Aircraft): boolean => {
    // console.log(receivedAircraft.current.size)
    return receivedAircraft.current.has(ac.info.Icao);
  };

  const syncData = (ac: Aircraft) => {
    if (isDuplicated(ac)) {
      aircraftDatabase[ac.info.Icao] = ac;
      updateAcList.push(ac);
    } else {
      aircraftDatabase[ac.info.Icao] = ac;
      addAcList.push(ac);
      receivedAircraft.current.add(ac.info.Icao);
    }
  };

  useEffect(() => {
    // updateAcList, removeAcList is empty...
    clearList(addAcList);
    clearList(updateAcList);
    clearList(removeAcList);

    props.acList.acList.forEach((item: Aircraft) => {
      syncData(item);
    });

    Object.values(aircraftDatabase).forEach((item) => {
      if (item.isTimeout()) {
        console.log(`removeAc: ${item.info.Reg}`);
        removeAcList.push(item);
      }
    });

    // let debugMsg =
    //   '' +
    //   `addAcList ${addAcList.length}\n` +
    //   `updateAcList ${updateAcList.length}\n` +
    //   `removeAcList ${removeAcList.length}`;
    // console.log(debugMsg);

    // Why duplicate code ???
    // props.acList.acList.forEach((item: Aircraft) => {
    //   syncData(item);
    // });

    Object.values(aircraftDatabase).forEach((item) => {
      if (item.isTimeout() == true) {
        delete aircraftDatabase[item.info.Icao];
        receivedAircraft.current.delete(item.info.Icao);
        removeAcList.push(item);
      }
    });
  });

  return (
    <>
      {/*
      <Ac3DViewer
        addAcList={addAcList}
        updateAcList={updateAcList}
        removeAcList={removeAcList}
      />
      */}

      <MapHooks
        addAcList={addAcList}
        updateAcList={updateAcList}
        removeAcList={removeAcList}
      />
      <AircraftTable
        addAcList={addAcList}
        updateAcList={updateAcList}
        removeAcList={removeAcList}
      />
    </>
  );
};
