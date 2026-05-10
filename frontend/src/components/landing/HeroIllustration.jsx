/**
 * Book-themed decorative art for the hero (SVG, no external assets).
 */
export default function HeroIllustration({ className = '' }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-lg ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 480 420"
        className="h-auto w-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#386355" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9d7f60" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="spine1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5f9480" />
            <stop offset="100%" stopColor="#3f665c" />
          </linearGradient>
          <linearGradient id="spine2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c19972" />
            <stop offset="100%" stopColor="#83664e" />
          </linearGradient>
          <linearGradient id="spine3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dfece7" />
            <stop offset="100%" stopColor="#92b8a9" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="240" cy="360" rx="200" ry="28" fill="url(#heroBg)" opacity="0.6" />

        <g filter="url(#soft)">
          <path
            d="M120 320 L120 140 L200 120 L200 300 Z"
            fill="url(#spine1)"
            opacity="0.95"
          />
          <path
            d="M200 300 L200 100 L310 85 L310 285 Z"
            fill="url(#spine2)"
            opacity="0.98"
          />
          <path
            d="M310 285 L310 115 L395 108 L395 278 Z"
            fill="url(#spine3)"
            opacity="0.92"
          />
        </g>

        <rect
          x="125"
          y="155"
          width="4"
          height="130"
          rx="2"
          fill="rgba(255,255,255,0.25)"
        />
        <rect
          x="218"
          y="125"
          width="4"
          height="150"
          rx="2"
          fill="rgba(255,255,255,0.2)"
        />
        <rect
          x="318"
          y="135"
          width="3"
          height="125"
          rx="1.5"
          fill="rgba(55,96,88,0.35)"
        />

        <g opacity="0.9">
          <circle cx="95" cy="95" r="52" fill="#386355" fillOpacity="0.15" />
          <circle cx="400" cy="180" r="36" fill="#a67c56" fillOpacity="0.2" />
          <path
            d="M60 260 Q140 220 220 250 T400 235"
            stroke="#5f9480"
            strokeWidth="2"
            strokeOpacity="0.35"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        <g transform="translate(320 48)">
          <rect
            width="120"
            height="88"
            rx="12"
            fill="white"
            fillOpacity="0.12"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
          />
          <path
            d="M20 28h80M20 44h56M20 60h72"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="92" cy="26" r="8" fill="#c19972" fillOpacity="0.85" />
        </g>

        <text
          x="240"
          y="395"
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="11"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="0.2em"
        >
          BOOKSBIN
        </text>
      </svg>
    </div>
  )
}
