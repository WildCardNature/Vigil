import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const VIOLET = "#b3a5ef";
const MINT = "#73ceac";
const GRAPHITE = "#101317";

function Line({ points, color = VIOLET, opacity = 0.35 }) {
  const geometry = useMemo(() => {
    const next = new THREE.BufferGeometry();
    next.setFromPoints(points.map((point) => new THREE.Vector3(...point)));
    return next;
  }, [points]);
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

function Orbit({ radius, y, speed = 1, color = VIOLET, tilt = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.06 * speed;
  });
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 8, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  );
}

function Tower() {
  const tower = useRef();
  useFrame(({ clock, pointer }) => {
    if (!tower.current) return;
    tower.current.rotation.y = clock.elapsedTime * 0.035 + pointer.x * 0.08;
    tower.current.rotation.x = pointer.y * 0.025;
  });

  const ribs = useMemo(() => Array.from({ length: 7 }, (_, index) => index), []);
  return (
    <group ref={tower} position={[1.35, 0.2, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 3.7, 1.5]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.38} />
      </mesh>
      {ribs.map((index) => <Orbit key={index} radius={1.12 - index * 0.045} y={-1.48 + index * 0.48} speed={index % 2 ? -1 : 1} />)}
      <Orbit radius={2.0} y={2.22} speed={1.2} />
      <Orbit radius={1.35} y={2.22} speed={-0.8} color={MINT} tilt={0.04} />
      <Line points={[[0, 1.85, 0], [0, 3.05, 0]]} opacity={0.65} />
      <mesh position={[0, 3.08, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color={VIOLET} />
      </mesh>
      <Line points={[[-2.4, -2.15, 1.7], [0, -1.85, 0], [2.4, -2.15, 1.7]]} color={MINT} opacity={0.28} />
    </group>
  );
}

function SignalLandscape() {
  const horizonLines = useMemo(() => {
    const lines = [];
    for (let index = -8; index <= 8; index += 1) {
      lines.push([[index * 0.8, 1.4, -5], [index * 1.6, -16, 3]]);
    }
    for (let depth = 0; depth < 18; depth += 1) {
      const y = 1 - depth * 1.05;
      const width = 6 + depth * 0.65;
      lines.push([[-width, y, -2 + depth * 0.1], [width, y, -2 + depth * 0.1]]);
    }
    return lines;
  }, []);

  return (
    <group>
      {horizonLines.map((points, index) => (
        <Line key={index} points={points} color={index % 5 === 0 ? MINT : VIOLET} opacity={index % 5 === 0 ? 0.13 : 0.075} />
      ))}
    </group>
  );
}

function Stars() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(420 * 3);
    let seed = 17;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (random() - 0.5) * 18;
      positions[index + 1] = 4 - random() * 22;
      positions[index + 2] = -2 - random() * 7;
    }
    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return next;
  }, []);
  return (
    <points geometry={geometry}>
      <pointsMaterial color={VIOLET} size={0.018} transparent opacity={0.52} sizeAttenuation />
    </points>
  );
}

function Screen({ texture, position, rotation, accent = VIOLET }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.045]}>
        <planeGeometry args={[2.25, 5.06]} />
        <meshBasicMaterial color="#222933" transparent opacity={0.96} />
      </mesh>
      <mesh>
        <planeGeometry args={[2.1, 4.67]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <Line points={[[-1.32, -2.7, 0], [-1.32, 2.7, 0], [1.32, 2.7, 0]]} color={accent} opacity={0.62} />
      <mesh position={[-1.32, -2.7, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function MovingSignal({ offset, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const value = (clock.elapsedTime * 0.22 + offset) % 1;
    ref.current.position.set(-4.5 + value * 9, -2.7 - value * 11.5, -0.8 + Math.sin(value * Math.PI) * 0.6);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Scene({ progressRef, screenshots }) {
  const textures = useLoader(THREE.TextureLoader, screenshots);
  const { camera, pointer, size } = useThree();

  useFrame((_, delta) => {
    const progress = progressRef.current;
    const narrow = size.width < 760;
    const targetY = -progress * 14.2;
    const targetX = narrow ? 0 : pointer.x * 0.18;
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4.5, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 4, delta);
    camera.lookAt(0, camera.position.y, 0);
  });

  return (
    <>
      <color attach="background" args={[GRAPHITE]} />
      <fog attach="fog" args={[GRAPHITE, 6, 17]} />
      <Stars />
      <SignalLandscape />
      <Tower />
      <Screen texture={textures[0]} position={[1.05, -4.75, 0]} rotation={[0, -0.12, 0]} />
      <Screen texture={textures[1]} position={[-1.05, -9.35, 0]} rotation={[0, 0.12, 0]} accent={MINT} />
      <Screen texture={textures[3]} position={[1.05, -14.05, 0]} rotation={[0, -0.1, 0]} />
      <Screen texture={textures[2]} position={[-0.65, -17.4, -1.1]} rotation={[0, 0.1, 0]} accent={MINT} />
      <MovingSignal offset={0} color={VIOLET} />
      <MovingSignal offset={0.38} color={MINT} />
      <MovingSignal offset={0.72} color="#f28e96" />
    </>
  );
}

export default function WatchtowerCanvas({ progressRef, screenshots }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <Scene progressRef={progressRef} screenshots={screenshots} />
    </Canvas>
  );
}
