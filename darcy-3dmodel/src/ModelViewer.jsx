import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, DragControls } from '@react-three/drei';

function DraggableModel({ onLoaded }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/darcy_model.glb');

  useEffect(() => {
    if (groupRef.current) {
      onLoaded(groupRef.current);
    }
  }, [onLoaded]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function DraggableScene() {
  const { camera, gl } = useThree();
  const orbitRef = useRef();
  const [dragObject, setDragObject] = useState(null);
  const dragControls = useRef();

  const handleModelLoaded = (object) => {
    setDragObject(object);
  };

  useEffect(() => {
    if (dragObject && dragControls.current) {
      const controls = dragControls.current;

      const handleDragStart = () => {
        if (orbitRef.current) orbitRef.current.enabled = false;
      };

      const handleDragEnd = () => {
        if (orbitRef.current) orbitRef.current.enabled = true;
      };

      controls.addEventListener('dragstart', handleDragStart);
      controls.addEventListener('dragend', handleDragEnd);

      return () => {
        controls.removeEventListener('dragstart', handleDragStart);
        controls.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [dragObject]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} castShadow />

      <DraggableModel onLoaded={handleModelLoaded} />

      <OrbitControls ref={orbitRef} />

      {dragObject && (
        <DragControls
          ref={dragControls}
          args={[[dragObject], camera, gl.domElement]}
        />
      )}
    </>
  );
}

export default function ModelViewer() {
  return (
    <Canvas
      camera={{ position: [0, 10, 10], fov: 50 }}
      style={{ width: '100vw', height: '100vh' }}
      shadows
    >
      <DraggableScene />
    </Canvas>
  );
}
