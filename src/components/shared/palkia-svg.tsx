import * as React from "react";

interface PalkiaSvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function PalkiaSvg({ size = 200, className, ...props }: PalkiaSvgProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="palkia-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="palkia-pearl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="50%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
        <linearGradient id="palkia-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e4e4e7" />
          <stop offset="50%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#71717a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Body base */}
      <ellipse cx="100" cy="120" rx="45" ry="55" fill="url(#palkia-body)" />
      
      {/* Neck */}
      <path
        d="M85 75 Q100 50 115 75 L110 95 Q100 85 90 95 Z"
        fill="url(#palkia-body)"
      />
      
      {/* Head */}
      <ellipse cx="100" cy="45" rx="25" ry="22" fill="url(#palkia-body)" />
      
      {/* Head crest */}
      <path
        d="M100 23 L95 5 Q100 10 105 5 L100 23"
        fill="url(#palkia-pearl)"
        filter="url(#glow)"
      />
      <path
        d="M82 32 L70 18 Q78 25 75 15 L85 30"
        fill="url(#palkia-pearl)"
        filter="url(#glow)"
      />
      <path
        d="M118 32 L130 18 Q122 25 125 15 L115 30"
        fill="url(#palkia-pearl)"
        filter="url(#glow)"
      />
      
      {/* Eyes */}
      <ellipse cx="90" cy="42" rx="6" ry="7" fill="#fff" />
      <ellipse cx="110" cy="42" rx="6" ry="7" fill="#fff" />
      <ellipse cx="91" cy="43" rx="3" ry="4" fill="#ef4444" />
      <ellipse cx="111" cy="43" rx="3" ry="4" fill="#ef4444" />
      <circle cx="92" cy="41" r="1" fill="#fff" />
      <circle cx="112" cy="41" r="1" fill="#fff" />
      
      {/* Shoulder pearls */}
      <circle cx="55" cy="100" r="18" fill="url(#palkia-pearl)" filter="url(#glow)" />
      <circle cx="145" cy="100" r="18" fill="url(#palkia-pearl)" filter="url(#glow)" />
      <circle cx="55" cy="100" r="10" fill="#fdf4ff" opacity="0.5" />
      <circle cx="145" cy="100" r="10" fill="#fdf4ff" opacity="0.5" />
      
      {/* Arms */}
      <path
        d="M55 115 Q35 130 30 155 Q28 165 35 170 L50 155 Q55 145 60 130 Z"
        fill="url(#palkia-body)"
      />
      <path
        d="M145 115 Q165 130 170 155 Q172 165 165 170 L150 155 Q145 145 140 130 Z"
        fill="url(#palkia-body)"
      />
      
      {/* Claws */}
      <path d="M30 170 L20 185 L35 175" fill="url(#palkia-metal)" />
      <path d="M38 172 L33 190 L45 178" fill="url(#palkia-metal)" />
      <path d="M165 170 L175 185 L160 175" fill="url(#palkia-metal)" />
      <path d="M157 172 L162 190 L150 178" fill="url(#palkia-metal)" />
      
      {/* Chest plate */}
      <path
        d="M80 85 Q100 75 120 85 L115 120 Q100 130 85 120 Z"
        fill="url(#palkia-metal)"
        opacity="0.8"
      />
      
      {/* Chest diamond */}
      <path
        d="M100 90 L108 100 L100 115 L92 100 Z"
        fill="url(#palkia-pearl)"
        filter="url(#glow)"
      />
      
      {/* Legs */}
      <path
        d="M75 165 Q70 180 65 195 L75 195 Q80 185 85 175 Z"
        fill="url(#palkia-body)"
      />
      <path
        d="M125 165 Q130 180 135 195 L125 195 Q120 185 115 175 Z"
        fill="url(#palkia-body)"
      />
      
      {/* Tail */}
      <path
        d="M100 175 Q95 190 105 195 Q115 190 110 175"
        fill="url(#palkia-body)"
      />
      
      {/* Wing-like fins */}
      <path
        d="M50 80 Q30 60 25 80 Q30 95 50 90"
        fill="url(#palkia-pearl)"
        opacity="0.8"
      />
      <path
        d="M150 80 Q170 60 175 80 Q170 95 150 90"
        fill="url(#palkia-pearl)"
        opacity="0.8"
      />
    </svg>
  );
}
