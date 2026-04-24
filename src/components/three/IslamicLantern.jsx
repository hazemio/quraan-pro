import React, { useRef, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* ───────────────────────────────────────────────
   Individual pieces of the Islamic lantern
   ─────────────────────────────────────────────── */

/** Hexagonal lantern body */
function LanternBody({ darkMode }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Gold metallic material
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(hovered ? '#f0d060' : '#D4AF37'),
    metalness: 0.85,
    roughness: 0.18,
    emissive: new THREE.Color('#7a5c00'),
    emissiveIntensity: hovered ? 0.6 : 0.25,
  }), [hovered])

  // Glass panel material — teal/green tinted
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: darkMode ? new THREE.Color('#0d3320') : new THREE.Color('#b8f0d0'),
    transparent: true,
    opacity: 0.55,
    metalness: 0.0,
    roughness: 0.05,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#00ff88'),
    emissiveIntensity: darkMode ? 0.08 : 0.03,
  }), [darkMode])

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main hex body */}
      <mesh castShadow material={goldMat}>
        <cylinderGeometry args={[0.55, 0.62, 1.4, 6, 1]} />
      </mesh>

      {/* Glass panels between the hex ribs — 6 panels */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.56, 0, Math.sin(angle) * 0.56]}
            rotation={[0, -angle, 0]}
            material={glassMat}
          >
            <planeGeometry args={[0.54, 1.32]} />
          </mesh>
        )
      })}

      {/* Top cap */}
      <mesh position={[0, 0.78, 0]} material={goldMat}>
        <cylinderGeometry args={[0.62, 0.55, 0.12, 6]} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -0.78, 0]} material={goldMat}>
        <cylinderGeometry args={[0.55, 0.62, 0.12, 6]} />
      </mesh>

      {/* Top pyramid finial */}
      <mesh position={[0, 1.06, 0]} material={goldMat}>
        <coneGeometry args={[0.35, 0.55, 6]} />
      </mesh>

      {/* Bottom pyramid */}
      <mesh position={[0, -1.06, 0]} rotation={[Math.PI, 0, 0]} material={goldMat}>
        <coneGeometry args={[0.28, 0.42, 6]} />
      </mesh>

      {/* Hanging ring */}
      <mesh position={[0, 1.42, 0]} material={goldMat}>
        <torusGeometry args={[0.14, 0.03, 8, 20]} />
      </mesh>

      {/* Decorative ring bands */}
      {[-0.45, 0, 0.45].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} material={goldMat}>
          <cylinderGeometry args={[0.64, 0.64, 0.04, 6]} />
        </mesh>
      ))}

      {/* Inner glow sphere (simulates candle) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ff8800"
          emissiveIntensity={hovered ? 3.5 : 2.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

/** Decorative star ring above/below the lantern */
function StarRing({ y = 0, radius = 1.1, count = 8, scale = 0.12 }) {
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[Math.PI / 2, 0, angle]}
          >
            <torusGeometry args={[scale, scale * 0.22, 6, 6]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.9}
              roughness={0.1}
              emissive="#7a5c00"
              emissiveIntensity={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/** Thin chain links from top ring */
function Chain() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37', metalness: 0.9, roughness: 0.15,
  }), [])
  return (
    <group position={[0, 1.62, 0]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.18, 0]} rotation={[0, (i % 2) * (Math.PI / 2), 0]} material={mat}>
          <torusGeometry args={[0.07, 0.018, 8, 14]} />
        </mesh>
      ))}
    </group>
  )
}

/** Outer slow-rotating decorative Islamic star ring */
function OuterDecorRing({ darkMode }) {
  const ref = useRef()
  useFrame((_, delta) => { ref.current.rotation.y += delta * 0.25 })
  return (
    <group ref={ref}>
      <StarRing y={0.5} radius={0.95} count={12} scale={0.08} />
      <StarRing y={-0.5} radius={0.95} count={12} scale={0.08} />
    </group>
  )
}

/** The whole lantern with Float from drei */
function IslamicLantern({ darkMode }) {
  const groupRef = useRef()

  // Gentle sway
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12
    }
  })

  return (
    <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.5}>
      <group ref={groupRef}>
        <Chain />
        <LanternBody darkMode={darkMode} />
        <OuterDecorRing darkMode={darkMode} />
      </group>
    </Float>
  )
}

/** Full Canvas Scene */
function Scene({ darkMode }) {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={darkMode ? 0.3 : 0.7} color={darkMode ? '#1a2a3a' : '#fff8e0'} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={darkMode ? 1.2 : 1.8}
        color={darkMode ? '#e8d5a3' : '#fff5cc'}
        castShadow
      />
      <directionalLight position={[-3, -2, -2]} intensity={0.3} color="#2d7a56" />
      {/* Warm point light simulating candle glow */}
      <pointLight position={[0, 0, 0]} intensity={darkMode ? 2.5 : 1.2} color="#ff9933" distance={4} decay={2} />
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#D4AF37" distance={5} decay={2} />

      {/* Sparkles (float around in dark mode) */}
      {darkMode && (
        <Sparkles
          count={40}
          scale={[3.5, 4, 3.5]}
          size={1.5}
          speed={0.4}
          opacity={0.7}
          color="#D4AF37"
        />
      )}

      <IslamicLantern darkMode={darkMode} />

      {/* Subtle orbit — limited to prevent accidental spin */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.8}
        rotateSpeed={0.5}
      />
    </>
  )
}

/** Loading fallback */
function LanternFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <motion_div />
      <p className="font-cairo text-sm" style={{ color: 'var(--text-muted)' }}>جاري تحميل المشهد ثلاثي الأبعاد...</p>
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div
        className="w-12 h-12 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: '#D4AF37',
          borderRightColor: 'rgba(212,175,55,0.3)',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p className="font-cairo text-sm" style={{ color: 'var(--text-muted)' }}>جاري التحميل...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ───────────────────────────────────────────────
   Public export — lazy-loaded by HomePage
   ─────────────────────────────────────────────── */
export default function IslamicLanternScene({ darkMode, className = '' }) {
  return (
    <div className={`w-full h-full ${className}`} style={{ cursor: 'grab' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene darkMode={darkMode} />
        </Suspense>
      </Canvas>
    </div>
  )
}
