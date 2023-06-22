import { CustomLayerInterface, Map } from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import { Camera, WebGLRenderer } from 'three';
import { Aircraft, Info } from '../class/Aircraft';
import { MapboxMatrix } from '../class/MapboxMatrix';
import MapInitialize from '../class/MapInitalize';
import { Scenery } from '../class/Scenery';

import '../Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

type MapHooks = {
  addAcList: Array<Aircraft>;
  updateAcList: Array<Aircraft>;
  removeAcList: Array<Aircraft>;
};

export function MapHooks(props: MapHooks) {
  const scenery = useRef<Scenery>();

  useEffect(() => {
    scenery.current = initMapView();
    scenery.current.setLocation(
      new Aircraft({
        alt: 3000,
        Lat: 42.78555721328673,
        Long: 141.68891120222779,
        Spd: 140,
        Trak: 360,
        Type: 'B77W',
      })
    );

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key == 's') {
        console.log(scenery.current?.getScene().children);
      }
    });
  }, []);

  useEffect(() => {
    // function isReadyScenery(scenery: Scenery) {
    //   if (scenery != null) {
    //     return true;
    //   }
    //   return false;
    // }

    function hasLocation(ac: Aircraft) {
      return ac.info.Long != null;
    }

    Object.values(props.addAcList).forEach((ac) => {
      if (hasLocation(ac)) scenery.current?.setLocation(ac);
    });
    Object.values(props.updateAcList).forEach((ac) => {
      if (hasLocation(ac)) scenery.current?.setLocation(ac);
    });
    Object.values(props.removeAcList).forEach((ac) => {
      scenery.current?.removeAircraft(ac);
    });
  });

  return <div id="mapContainer"></div>;
}

function initMapView() {
  const camera = new Camera();
  const map: Map = MapInitialize();
  const mapboxMatrix = new MapboxMatrix();
  const origin = mapboxMatrix.getOrigin();
  const scenery = new Scenery(origin);
  const scene = scenery.getScene();

  let renderer: WebGLRenderer;

  const customLayer: CustomLayerInterface = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: (_, gl) => {
      renderer = new WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: false,
      });
      renderer.autoClear = false;
    },
    render: (_: WebGLRenderingContext, matrix) => {
      const cameraMatrix = mapboxMatrix.calculateCameraMatrix(matrix);
      camera.projectionMatrix = cameraMatrix.m.multiply(cameraMatrix.l);
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };
  map.on('style.load', () => {
    map.addLayer(customLayer);
    map.addLayer({
      id: 'sky',
      type: 'sky',
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0, 0],
        'sky-atmosphere-sun-intensity': 15,
      },
    });
  });
  return scenery;
}
