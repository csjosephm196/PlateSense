import { useState, useMemo } from 'react';

// "Organic" 8-Region Model
// ViewBox: 0 0 500 400
// Features "wrinkly" paths to simulate gyri/sulci for a more realistic lateral view.

const ORGANIC_PATHS = {
    'Prefrontal Cortex': {
        // The very front tip, wrinkled
        d: `M 50,220 
            C 40,180 50,130 90,105
            C 105,95 120,95 130,95
            C 125,120 125,160 130,220
            C 110,225 80,230 50,220 Z`,
        color: '#6366f1', description: '• Focus\n• Personality',
        zIndex: 1
    },
    'Frontal Lobe': {
        // Large top-front area, behind prefrontal
        d: `M 130,95
            C 160,80 200,75 240,80
            C 255,85 265,95 260,110
            C 255,140 240,165 240,165
            C 200,160 160,155 130,220
            C 125,160 125,120 130,95 Z`,
        color: '#3b82f6', description: '• Movement\n• Planning',
        zIndex: 1
    },
    'Parietal Lobe': {
        // Top-Rear - Smoothed top
        d: `M 240,80
            C 270,75 310,80 350,110
            C 370,135 365,165 350,165
            C 340,210 290,200 240,165
            C 220,140 230,100 240,80 Z`,
        color: '#10b981', description: '• Touch\n• Space',
        zIndex: 1
    },
    'Occipital Lobe': {
        // Extreme Rear
        d: `M 350,110
            C 380,130 390,170 380,200
            C 370,220 340,230 320,225
            C 330,200 340,180 350,165
            C 355,155 360,130 350,110 Z`,
        color: '#8b5cf6', description: '• Vision\n• Color',
        zIndex: 1
    },
    'Temporal Lobe': {
        // Bottom "Thumb"
        d: `M 130,220
            C 130,260 160,285 200,290
            C 240,295 280,280 300,250
            C 310,240 320,225 320,225
            C 290,160 260,155 240,165
            C 200,160 160,155 130,220 Z`,
        color: '#f59e0b', description: '• Hearing\n• Memory',
        zIndex: 0
    },
    'Cerebellum': {
        // Tucked under, textured oval
        d: `M 280,260
            C 320,260 350,270 340,310
            C 330,340 290,345 260,335
            C 240,325 240,280 280,260 Z`,
        color: '#14b8a6', description: '• Balance\n• Coordination',
        zIndex: 0
    },
    'Amygdala': {
        // Internal - modeled as overlays
        d: `M 170,240 
            C 165,235 170,225 180,225
            C 190,225 195,235 190,245
            C 185,255 175,250 170,240 Z`,
        color: '#ef4444', description: '• Emotion\n• Fear',
        zIndex: 2,
        internal: true
    },
    'Hippocampus': {
        // Internal - Seahorse shape extending back
        d: `M 195,235
            C 215,225 235,225 255,240
            C 265,250 255,260 245,260
            C 225,260 205,250 195,235 Z`,
        color: '#ec4899', description: '• Memory\n• Navigation',
        zIndex: 2,
        internal: true
    }
};

// Texture pattern for the "organic" look
const OrganicTexture = () => (
    <pattern id="gyri-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M5,10 Q10,5 15,10 T25,10" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        <path d="M0,5 Q5,0 10,5 T20,5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    </pattern>
);

const DATA_KEY_MAPPING = {
    'Prefrontal Cortex': 'Prefrontal Cortex',
    'Frontal Lobe': 'Frontal Lobe',
    'Hippocampus': 'Hippocampus',
    'Amygdala': 'Amygdala',
    'Occipital Lobe': 'Occipital Lobe',
    'Temporal Lobe': 'Temporal Lobe',
    'Cerebellum': 'Cerebellum',
    'Parietal Lobe': 'Parietal Lobe'
};

export default function BrainModel({ data, onRegionSelect, selectedRegion }) {
    const [hoveredRegion, setHoveredRegion] = useState(null);

    const regionStatus = useMemo(() => {
        if (!data?.regions) return {};
        const status = {};

        Object.entries(data.regions).forEach(([key, val]) => {
            const visualKey = DATA_KEY_MAPPING[key];
            if (visualKey) status[visualKey] = { ...val, originalKey: key };
        });

        const defaults = [
            'Frontal Lobe', 'Parietal Lobe', 'Prefrontal Cortex',
            'Occipital Lobe', 'Temporal Lobe', 'Cerebellum', 'Amygdala', 'Hippocampus'
        ];

        defaults.forEach(key => {
            if (!status[key]) status[key] = { score: 75, status: 'Neutral', originalKey: key };
        });

        return status;
    }, [data]);

    return (
        <div className="w-full h-[400px] bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl flex items-center justify-center bg-grid-slate-800/[0.2]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none" />

            <svg
                viewBox="0 0 500 400"
                className="w-full h-full max-w-[600px] drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 40px rgba(99, 102, 241, 0.1))' }}
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <OrganicTexture />
                </defs>

                <g transform="translate(10, 10)">
                    {Object.entries(ORGANIC_PATHS)
                        .sort(([, a], [, b]) => (a.zIndex || 0) - (b.zIndex || 0))
                        .map(([name, pathData]) => {
                            const regionInfo = regionStatus[name];
                            const isHovered = hoveredRegion === name;
                            const isSelected = selectedRegion === name;
                            const isInternal = pathData.internal;

                            // Determine color based on score
                            let healthColor = '#334155'; // Default slate
                            if (regionInfo) {
                                if (regionInfo.score >= 80) healthColor = '#10b981';      // Green (Good)
                                else if (regionInfo.score >= 50) healthColor = '#f59e0b'; // Amber (Average)
                                else healthColor = '#ef4444';                             // Red (Poor)
                            }

                            let fillColor = healthColor;
                            // visual feedback for hover AND selection
                            if (isHovered) fillColor = '#cbd5e1'; // Slate-300 on hover
                            if (isSelected && !isHovered) fillColor = '#e2e8f0'; // Slate-200 if selected but not hovered (to keep it distinct)

                            // Internal structures (Amygdala/Hippocampus) styling
                            let opacity = 1;
                            let strokeColor = '#000000'; // Always black boundaries
                            let strokeWidth = (isHovered || isSelected) ? 3 : 1.5;

                            if (isInternal) {
                                opacity = 0.9;
                                strokeColor = '#000000';
                                strokeWidth = (isHovered || isSelected) ? 3 : 1.5;
                            }

                            return (
                                <g key={name}
                                    className="transition-all duration-300 ease-out cursor-pointer group"
                                    onMouseEnter={() => setHoveredRegion(name)}
                                    onMouseLeave={() => setHoveredRegion(null)}
                                    onClick={() => onRegionSelect && onRegionSelect(name)}
                                    style={{
                                        transformOrigin: 'center',
                                        transform: (isHovered || isSelected) ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                >
                                    {/* Base Shape */}
                                    <path
                                        d={pathData.d}
                                        fill={fillColor}
                                        stroke={strokeColor}
                                        strokeWidth={strokeWidth}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fillOpacity={opacity}
                                        style={{
                                            filter: (isHovered || isSelected) ? 'url(#glow)' : 'none',
                                        }}
                                    />

                                    {/* Gyri/Sulci Texture - Apply to all except small internal ones */}
                                    {!isInternal && (
                                        <path
                                            d={pathData.d}
                                            fill="url(#gyri-pattern)"
                                            stroke="none"
                                            className="pointer-events-none opacity-50"
                                            style={{ mixBlendMode: 'overlay' }}
                                        />
                                    )}
                                </g>
                            );
                        })}
                </g>
            </svg>

            {/* Overlay UI */}
            <div className="absolute top-6 left-6 pointer-events-none">
                <h3 className="text-white font-bold text-lg tracking-tight">Neuro-Insight 2D</h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mt-1">Anatomical Lateral View</p>
            </div>

            {hoveredRegion && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-5 py-3 rounded-2xl pointer-events-none animate-in fade-in slide-in-from-bottom-2 z-20 min-w-[200px] text-center shadow-2xl">
                    <span className="text-white font-bold text-sm block tracking-wide">{hoveredRegion}</span>
                    <span className="text-slate-400 text-[10px] uppercase tracking-widest block mb-1.5">{ORGANIC_PATHS[hoveredRegion].description}</span>
                    {regionStatus[hoveredRegion] ? (
                        <div className="inline-flex items-center justify-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${regionStatus[hoveredRegion].score > 70 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            <span className={`text-xs font-black ${regionStatus[hoveredRegion].score > 70 ? 'text-emerald-300' : 'text-red-300'}`}>
                                Score: {regionStatus[hoveredRegion].score}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-500 italic">No active data</span>
                    )}
                </div>
            )}
        </div>
    );
}
