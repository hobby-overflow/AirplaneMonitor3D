import React from 'react';
import mapboxgl, { CustomLayerInterface } from 'mapbox-gl';
import * as THREE from 'three';

import MapInitialize from '../class/MapInitalize';
import { MapboxMatrix } from '../class/MapboxMatrix';
import { Scenery } from '../class/Scenery';

import '../Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapViewer extends React.Component<{}, { value: any }> {
  constructor(props: any) {
    super(props);
  }

  private camera = new THREE.Camera();
  private renderer!: THREE.WebGLRenderer;
  private map!: mapboxgl.Map;

  private mapBoxMatrix = new MapboxMatrix();

  componentDidMount = () => {
    this.map = MapInitialize();

    const origin = this.mapBoxMatrix.getOrigin();
    const scenery = new Scenery(origin);
    const scene = scenery.getScene();

    const customLayer: CustomLayerInterface = {
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',
      onAdd: (_, gl) => {
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.map.getCanvas(),
          context: gl,
          antialias: true,
        });
        this.renderer.autoClear = false;
      },
      render: (_: WebGLRenderingContext, matrix) => {
        const cameraMatrix = this.mapBoxMatrix.calculateCameraMatrix(matrix);

        this.camera.projectionMatrix = cameraMatrix.m.multiply(cameraMatrix.l);
        this.renderer.resetState();
        this.renderer.render(scene, this.camera);
        this.map.triggerRepaint();
      },
    };
    this.map.on('style.load', () => {
      this.map.addLayer(customLayer);
      this.map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      });
    });
  };
  render = () => {
    return <div id="mapContainer"></div>;
  };
}
