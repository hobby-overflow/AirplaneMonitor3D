import React from "react";
import * as THREE from "three";

// export const Sample1 = () => {
export class ThreeSample extends React.Component<{scale: number},{}>{
    constructor(props: any) {
        super(props);
    }
    createBox = () => {
        const width = innerWidth;
        const height = innerHeight;

        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#three") as HTMLCanvasElement
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, width / height);
        camera.position.set(0,0, +1000);

        const scale = this.props.scale;
        const geometry = new THREE.BoxGeometry(scale,scale,scale,);
        const material = new THREE.MeshNormalMaterial();
        const box = new THREE.Mesh(geometry, material);
        scene.add(box);

        tick();

        function tick() {
            box.rotation.y += 0.01;
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
    }
    
    componentDidMount() {
        this.createBox();
    }
    render() {
        return (
            <canvas id="three"></canvas>
        )
    }
}