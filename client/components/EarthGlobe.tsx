import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

export type HeatPoint = { lat: number; lon: number; intensity: number };

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function HeatPulses({ points, radius = 1.02 }: { points: HeatPoint[]; radius?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const s = 0.2 + 0.15 * Math.sin(t * 2 + i);
      child.scale.setScalar(0.6 + s);
      const m = child as THREE.Mesh;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 + 0.4 * Math.sin(t * 2 + i);
      mat.needsUpdate = true;
    });
  });

  return (
    <group ref={group}>
      {points.map((p, i) => {
        const pos = latLonToVec3(p.lat, p.lon, radius);
        return (
          <mesh position={pos.toArray()} key={i}>
            <sphereGeometry args={[0.01 + p.intensity * 0.02, 8, 8]} />
            <meshBasicMaterial color="#ff3b3b" transparent opacity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function Rotator({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export function EarthGlobe({ points }: { points: HeatPoint[] }) {
  const atmosphere = useMemo(() => new THREE.Color("#7dd3fc"), []);
  return (
    <div className="h-80 w-full rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Stars radius={50} depth={20} count={2000} factor={2} fade />
        <Rotator>
          <Sphere args={[1, 64, 64]}>
            <meshPhongMaterial color="#0b1220" emissive="#0b1220" shininess={8} />
          </Sphere>
          <mesh>
            <sphereGeometry args={[1.03, 64, 64]} />
            <meshBasicMaterial color={atmosphere} transparent opacity={0.06} />
          </mesh>
          <gridHelper args={[10, 30, 0x1f2937, 0x111827]} position={[0, -1.2, 0]} />
          <HeatPulses points={points} />
        </Rotator>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
