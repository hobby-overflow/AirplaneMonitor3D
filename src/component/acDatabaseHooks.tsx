import React, { useEffect, useState } from 'react';
import { Aircraft } from '../class/Aircraft';
import { AircraftList } from '../class/AircraftList';
import { Aircraft3DViewer } from './Aircraft3DViewer';
import { AircraftTable } from './AircraftTable';

// ここがコントローラーを担うことになってしまった
export const AcDatabaseHooks = (props: any) => {
  const receivedAircraft = new Set<string>();

  const aircraftDatabase: { [key: string]: Aircraft } = {};

  const [addAcList] = useState(new Array<Aircraft>());
  const [updateAcList] = useState(new Array<Aircraft>());
  const [removeAcList] = useState(new Array<Aircraft>());

  const isDuplicated = (ac: Aircraft): boolean => {
    return receivedAircraft.has(ac.info.Icao);
  };

  const syncData = (ac: Aircraft) => {
    if (isDuplicated(ac) == true) {
      aircraftDatabase[ac.info.Icao] = ac;
      updateAcList.push(ac);
    } else {
      aircraftDatabase[ac.info.Icao] = ac;
      addAcList.push(ac);
      receivedAircraft.add(ac.info.Icao);
    }
  };

  useEffect(() => {
    props.acList.acList.forEach((item: Aircraft) => {
      syncData(item);
    });

    props.acList.acList.forEach((item: Aircraft) => {
      syncData(item);
    });

    Object.values(aircraftDatabase).forEach((item) => {
      if (item.isTimeout() == true) {
        delete aircraftDatabase[item.info.Icao];
        receivedAircraft.delete(item.info.Icao);
        removeAcList.push(item);
      }
    });
  });

  return (
    <>
    {/*
      <Aircraft3DViewer
        addAcList={addAcList}
        updateAcList={updateAcList}
        removeAcList={removeAcList}
      />
      */}
      <AircraftTable
        addAcList={addAcList}
        updateAcList={updateAcList}
        removeAcList={removeAcList}
      />
    </>
  );
};
