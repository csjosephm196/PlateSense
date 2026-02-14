import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const REGIONS = [
    { name: 'Prefrontal Cortex', position: [0, 0.5, 1.2], color: '#6366f1', description: 'Executive function & focus' },
    { name: 'Hippocampus', position: [0, -0.2, 0], color: '#10b981', description: 'Memory & learning' },
    { name: 'Amygdala', position: [0.4, -0.4, 0.2], color: '#f43f5e', description: 'Mood & emotion' },
    { name: 'Occipital Lobe', position: [0, 0.2, -1.2], color: '#8b5cf6', description: 'Visual processing' },
    { name: 'Temporal Lobe', position: [1.2, -0.2, 0.2], color: '#f59e0b', description: 'Auditory & language' },
    { name: 'Cerebellum', position: [0, -0.8, -0.8], color: '#14b8a6', description: 'Coordination' },
];

function BrainPart({ name, position, color, onHover, score = 80 }) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    // Health color logic: 
    // score > 70: Greenish
    // score > 40: Yellowish
    // score <= 40: Reddish
    const healthColor = useMemo(() => {
        if (score > 75) return color;
        if (score > 50) return '#fbbf24'; // Warning amber
        return '#ef4444'; // Danger red
    }, [score, color]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.position.y = position[1] + Math.sin(t + position[0]) * 0.05;
            // Subtle pulse if unhealthy
            if (score < 50) {
                const pulse = 1 + Math.sin(t * 4) * 0.05;
                mesh.current.scale.set(pulse, pulse, pulse);
            }
        }
    });

    return (
        <group
            position={position}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHover(true);
                onHover({ name, color: healthColor, score });
            }}
            onPointerOut={() => {
                setHover(false);
                onHover(null);
            }}
        >
            <Sphere args={[0.35, 32, 32]} ref={mesh}>
                <MeshDistortMaterial
                    color={hovered ? '#ffffff' : healthColor}
                    speed={hovered ? 5 : 2}
                    distort={0.4}
                    radius={1}
                    emissive={healthColor}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
            {hovered && (
                <Text
                    position={[0, 0.6, 0]}
                    fontSize={0.15}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {name}
                </Text>
            )}
        </group>
    );
}

function BrainConnection({ start, end }) {
    const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
    const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </line>
    );
}

export default function BrainModel({ data, onRegionSelect }) {
    const [activeRegion, setActiveRegion] = useState(null);

    const regionScores = useMemo(() => {
        if (!data?.regions) return {};
        const scores = {};
        Object.entries(data.regions).forEach(([key, val]) => {
            scores[key] = val.score;
        });
        return scores;
    }, [data]);

    return (
        <div className="w-full h-[400px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <group>
                        {/* Brain Core - semi-transparent shell */}
                        <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
                            <meshStandardMaterial
                                color="#1e293b"
                                transparent
                                opacity={0.15}
                                roughness={0}
                                metalness={1}
                            />
                        </Sphere>

                        {/* Regions */}
                        {REGIONS.map((region) => (
                            <BrainPart
                                key={region.name}
                                {...region}
                                score={regionScores[region.name] || 80}
                                onHover={(info) => {
                                    setActiveRegion(info);
                                    if (onRegionSelect) onRegionSelect(info ? info.name : null);
                                }}
                            />
                        ))}

                        {/* Neuro-connections */}
                        {REGIONS.slice(0, -1).map((r, i) => (
                            <BrainConnection key={i} start={r.position} end={REGIONS[i + 1].position} />
                        ))}
                    </group>
                </Float>
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute top-6 left-6 pointer-events-none">
                <h3 className="text-white font-bold text-lg tracking-tight">Neuro-Insight 3D</h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mt-1">Real-time Mind Analysis</p>
            </div>

            {activeRegion && (
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold">{activeRegion.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeRegion.score > 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {activeRegion.score}% Health
                        </span>
                    </div>
                    <p className="text-slate-300 text-xs">
                        {REGIONS.find(r => r.name === activeRegion.name)?.description}
                    </p>
                </div>
            )}

            {/* Tooltip for interaction */}
            <div className="absolute top-6 right-6 px-3 py-1.5 bg-brand-purple/20 border border-brand-purple/30 rounded-full">
                <span className="text-brand-purple text-[10px] font-bold uppercase tracking-widest">Interactive</span>
            </div>
        </div>
    );
}
