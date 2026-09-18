import React from 'react';

interface AshokaStambhProps {
  className?: string;
  size?: number;
  color?: string;
  showMotto?: boolean;
}

/**
 * Ashoka Stambh (State Emblem of India - Lion Capital of Ashoka)
 * Featuring the three visible guardian lions, decorative abacus with Ashoka Chakra,
 * flanked by horse and bull emblems, resting on an inverted lotus base with "सत्यमेव जयते".
 */
export const AshokaStambh: React.FC<AshokaStambhProps> = ({
  className = 'w-10 h-14',
  size = 48,
  color = '#1e293b',
  showMotto = true,
}) => {
  return (
    <svg
      viewBox="0 0 100 130"
      width={size}
      height={(size * 130) / 100}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ashoka Stambh (State Emblem of India)"
      role="img"
    >
      <g fill={color} stroke={color} strokeLinejoin="round" strokeLinecap="round">
        {/* --- CENTRAL LION --- */}
        {/* Head & Crown */}
        <path
          d="M44 22 C44 14 56 14 56 22 C59 22 61 25 61 29 C61 34 57 37 54 39 L46 39 C43 37 39 34 39 29 C39 25 41 22 44 22 Z"
          fill={color}
          strokeWidth="0.8"
        />
        {/* Central Lion Ears */}
        <path d="M42 19 C41 16 43 14 45 16 Z M58 19 C59 16 57 14 55 16 Z" />
        {/* Central Lion Mane tufts */}
        <path
          d="M40 28 C37 32 38 41 43 46 C40 48 37 54 41 62 C43 65 47 67 50 67 C53 67 57 65 59 62 C63 54 60 48 57 46 C62 41 63 32 60 28"
          fill="none"
          strokeWidth="1.5"
        />
        <path
          d="M45 42 Q50 45 55 42 M46 48 Q50 51 54 48 M47 54 Q50 57 53 54 M48 60 Q50 62 52 60"
          fill="none"
          strokeWidth="1.2"
        />
        {/* Central Lion Snout & Eyes */}
        <ellipse cx="50" cy="27" rx="3.5" ry="2.5" fill="#ffffff" />
        <circle cx="50" cy="28" r="1.5" fill={color} />
        <circle cx="46.5" cy="24" r="1" fill="#ffffff" />
        <circle cx="53.5" cy="24" r="1" fill="#ffffff" />
        {/* Whiskers & Mouth */}
        <path d="M47 31 Q50 33 53 31" fill="none" strokeWidth="1" />

        {/* Central Lion Forelegs & Paws */}
        <path
          d="M45 52 L45 66 C45 69 43 70 42 72 L47 72 C48 70 48 68 48 66 L48 54 Z"
          fill={color}
        />
        <path
          d="M55 52 L55 66 C55 69 57 70 58 72 L53 72 C52 70 52 68 52 66 L52 54 Z"
          fill={color}
        />
        {/* Claws */}
        <line x1="43" y1="71.5" x2="43" y2="73" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="45" y1="71.5" x2="45" y2="73" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="55" y1="71.5" x2="55" y2="73" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="57" y1="71.5" x2="57" y2="73" stroke="#ffffff" strokeWidth="0.8" />

        {/* --- LEFT LION (PROFILE) --- */}
        {/* Head profile facing left */}
        <path
          d="M32 23 C28 23 23 26 21 31 C19 36 21 40 25 41 L27 45 C23 48 21 54 22 62 C23 68 26 71 30 72 L36 72 C33 68 33 62 34 56 C35 50 38 45 40 43 L37 38 C34 38 33 34 33 30 C33 26 34 24 32 23 Z"
          fill={color}
          strokeWidth="0.8"
        />
        <path d="M22 29 C21 27 23 25 25 27 Z" />
        {/* Left eye & mouth */}
        <circle cx="25" cy="31" r="1.1" fill="#ffffff" />
        <path d="M21 35 L25 35" stroke="#ffffff" strokeWidth="0.9" fill="none" />
        {/* Left Lion Mane strands */}
        <path
          d="M26 37 Q32 40 33 46 M24 45 Q31 49 33 56 M25 55 Q30 59 34 65"
          fill="none"
          strokeWidth="1.2"
        />
        {/* Left Lion Left Leg */}
        <path d="M23 62 L23 72 L27 72 L27 64 Z" fill={color} />
        <line x1="24.5" y1="71.5" x2="24.5" y2="73" stroke="#ffffff" strokeWidth="0.8" />

        {/* --- RIGHT LION (PROFILE) --- */}
        {/* Head profile facing right */}
        <path
          d="M68 23 C72 23 77 26 79 31 C81 36 79 40 75 41 L73 45 C77 48 79 54 78 62 C77 68 74 71 70 72 L64 72 C67 68 67 62 66 56 C65 50 62 45 60 43 L63 38 C66 38 67 34 67 30 C67 26 66 24 68 23 Z"
          fill={color}
          strokeWidth="0.8"
        />
        <path d="M78 29 C79 27 77 25 75 27 Z" />
        {/* Right eye & mouth */}
        <circle cx="75" cy="31" r="1.1" fill="#ffffff" />
        <path d="M79 35 L75 35" stroke="#ffffff" strokeWidth="0.9" fill="none" />
        {/* Right Lion Mane strands */}
        <path
          d="M74 37 Q68 40 67 46 M76 45 Q69 49 67 56 M75 55 Q70 59 66 65"
          fill="none"
          strokeWidth="1.2"
        />
        {/* Right Lion Right Leg */}
        <path d="M77 62 L77 72 L73 72 L73 64 Z" fill={color} />
        <line x1="75.5" y1="71.5" x2="75.5" y2="73" stroke="#ffffff" strokeWidth="0.8" />

        {/* --- ABACUS (CIRCULAR BASE PLATFORM) --- */}
        {/* Abacus top moulding rim */}
        <rect x="16" y="73" width="68" height="3" rx="1.5" fill={color} />

        {/* Abacus frieze band */}
        <rect x="18" y="76" width="64" height="14" fill={color} />
        <rect x="19" y="77" width="62" height="12" fill="#ffffff" />

        {/* Central Wheel on Abacus (Ashoka Chakra) */}
        <g transform="translate(50, 83)">
          <circle cx="0" cy="0" r="5" fill="none" stroke={color} strokeWidth="0.9" />
          <circle cx="0" cy="0" r="1.1" fill={color} />
          {/* 8 spokes simplified for miniature frieze scale */}
          <line x1="0" y1="-5" x2="0" y2="5" stroke={color} strokeWidth="0.6" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke={color} strokeWidth="0.6" />
          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke={color} strokeWidth="0.6" />
          <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" stroke={color} strokeWidth="0.6" />
        </g>

        {/* Left Galloping Horse silhouette on Abacus */}
        <path
          d="M26 84 C28 81 31 80 34 81 C33 83 31 84 33 86 L36 86 M30 84 L27 87 M33 83 L34 87"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right Charging Bull silhouette on Abacus */}
        <path
          d="M74 84 C72 81 69 81 66 82 C67 84 69 85 67 86 L64 86 M70 84 L73 87 M67 83 L66 87"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Abacus bottom moulding rim */}
        <rect x="16" y="90" width="68" height="3" rx="1" fill={color} />

        {/* --- INVERTED LOTUS BASE (BELL BASE) --- */}
        <path
          d="M22 93 C24 99 29 104 36 106 C42 107.5 46 108 50 108 C54 108 58 107.5 64 106 C71 104 76 99 78 93 Z"
          fill={color}
        />
        {/* Lotus petal fluting lines */}
        <path
          d="M32 93 C34 98 38 102 42 105 M42 93 C44 98 46 103 48 107 M58 93 C56 98 54 103 52 107 M68 93 C66 98 62 102 58 105"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.9"
        />

        {/* Base Pedestal line */}
        <rect x="25" y="108" width="50" height="2" rx="0.8" fill={color} />
      </g>

      {/* --- NATIONAL MOTTO: सत्यमेव जयते (Satyameva Jayate) --- */}
      {showMotto && (
        <text
          x="50"
          y="122"
          textAnchor="middle"
          fill={color}
          fontSize="8.5"
          fontWeight="700"
          fontFamily="'Mukta', 'Noto Sans Devanagari', 'Yatra One', 'Arial Unicode MS', sans-serif"
          letterSpacing="0.4"
        >
          सत्यमेव जयते
        </text>
      )}
    </svg>
  );
};

export function getAshokaStambhSvgString(color = '#111827', showMotto = true): string {
  return `<svg viewBox="0 0 100 130" width="100" height="130" xmlns="http://www.w3.org/2000/svg">
    <g fill="${color}" stroke="${color}" stroke-linejoin="round" stroke-linecap="round">
      <path d="M44 22 C44 14 56 14 56 22 C59 22 61 25 61 29 C61 34 57 37 54 39 L46 39 C43 37 39 34 39 29 C39 25 41 22 44 22 Z" fill="${color}" stroke-width="0.8"/>
      <path d="M42 19 C41 16 43 14 45 16 Z M58 19 C59 16 57 14 55 16 Z"/>
      <path d="M40 28 C37 32 38 41 43 46 C40 48 37 54 41 62 C43 65 47 67 50 67 C53 67 57 65 59 62 C63 54 60 48 57 46 C62 41 63 32 60 28" fill="none" stroke-width="1.5"/>
      <path d="M45 42 Q50 45 55 42 M46 48 Q50 51 54 48 M47 54 Q50 57 53 54 M48 60 Q50 62 52 60" fill="none" stroke-width="1.2"/>
      <ellipse cx="50" cy="27" rx="3.5" ry="2.5" fill="#ffffff"/>
      <circle cx="50" cy="28" r="1.5" fill="${color}"/>
      <circle cx="46.5" cy="24" r="1" fill="#ffffff"/>
      <circle cx="53.5" cy="24" r="1" fill="#ffffff"/>
      <path d="M47 31 Q50 33 53 31" fill="none" stroke-width="1"/>
      <path d="M45 52 L45 66 C45 69 43 70 42 72 L47 72 C48 70 48 68 48 66 L48 54 Z" fill="${color}"/>
      <path d="M55 52 L55 66 C55 69 57 70 58 72 L53 72 C52 70 52 68 52 66 L52 54 Z" fill="${color}"/>
      <line x1="43" y1="71.5" x2="43" y2="73" stroke="#ffffff" stroke-width="0.8"/>
      <line x1="45" y1="71.5" x2="45" y2="73" stroke="#ffffff" stroke-width="0.8"/>
      <line x1="55" y1="71.5" x2="55" y2="73" stroke="#ffffff" stroke-width="0.8"/>
      <line x1="57" y1="71.5" x2="57" y2="73" stroke="#ffffff" stroke-width="0.8"/>
      <path d="M32 23 C28 23 23 26 21 31 C19 36 21 40 25 41 L27 45 C23 48 21 54 22 62 C23 68 26 71 30 72 L36 72 C33 68 33 62 34 56 C35 50 38 45 40 43 L37 38 C34 38 33 34 33 30 C33 26 34 24 32 23 Z" fill="${color}" stroke-width="0.8"/>
      <circle cx="25" cy="31" r="1.1" fill="#ffffff"/>
      <path d="M21 35 L25 35" stroke="#ffffff" stroke-width="0.9" fill="none"/>
      <path d="M26 37 Q32 40 33 46 M24 45 Q31 49 33 56 M25 55 Q30 59 34 65" fill="none" stroke-width="1.2"/>
      <path d="M23 62 L23 72 L27 72 L27 64 Z" fill="${color}"/>
      <line x1="24.5" y1="71.5" x2="24.5" y2="73" stroke="#ffffff" stroke-width="0.8"/>
      <path d="M68 23 C72 23 77 26 79 31 C81 36 79 40 75 41 L73 45 C77 48 79 54 78 62 C77 68 74 71 70 72 L64 72 C67 68 67 62 66 56 C65 50 62 45 60 43 L63 38 C66 38 67 34 67 30 C67 26 66 24 68 23 Z" fill="${color}" stroke-width="0.8"/>
      <circle cx="75" cy="31" r="1.1" fill="#ffffff"/>
      <path d="M79 35 L75 35" stroke="#ffffff" stroke-width="0.9" fill="none"/>
      <path d="M74 37 Q68 40 67 46 M76 45 Q69 49 67 56 M75 55 Q70 59 66 65" fill="none" stroke-width="1.2"/>
      <path d="M77 62 L77 72 L73 72 L73 64 Z" fill="${color}"/>
      <line x1="75.5" y1="71.5" x2="75.5" y2="73" stroke="#ffffff" stroke-width="0.8"/>
      <rect x="16" y="73" width="68" height="3" rx="1.5" fill="${color}"/>
      <rect x="18" y="76" width="64" height="14" fill="${color}"/>
      <rect x="19" y="77" width="62" height="12" fill="#ffffff"/>
      <g transform="translate(50, 83)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="${color}" stroke-width="0.9"/>
        <circle cx="0" cy="0" r="1.1" fill="${color}"/>
        <line x1="0" y1="-5" x2="0" y2="5" stroke="${color}" stroke-width="0.6"/>
        <line x1="-5" y1="0" x2="5" y2="0" stroke="${color}" stroke-width="0.6"/>
        <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="${color}" stroke-width="0.6"/>
        <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" stroke="${color}" stroke-width="0.6"/>
      </g>
      <path d="M26 84 C28 81 31 80 34 81 C33 83 31 84 33 86 L36 86 M30 84 L27 87 M33 83 L34 87" stroke="${color}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M74 84 C72 81 69 81 66 82 C67 84 69 85 67 86 L64 86 M70 84 L73 87 M67 83 L66 87" stroke="${color}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <rect x="16" y="90" width="68" height="3" rx="1" fill="${color}"/>
      <path d="M22 93 C24 99 29 104 36 106 C42 107.5 46 108 50 108 C54 108 58 107.5 64 106 C71 104 76 99 78 93 Z" fill="${color}"/>
      <path d="M32 93 C34 98 38 102 42 105 M42 93 C44 98 46 103 48 107 M58 93 C56 98 54 103 52 107 M68 93 C66 98 62 102 58 105" fill="none" stroke="#ffffff" stroke-width="0.9"/>
      <rect x="25" y="108" width="50" height="2" rx="0.8" fill="${color}"/>
    </g>
    ${
      showMotto
        ? `<text x="50" y="122" text-anchor="middle" fill="${color}" font-size="8.5" font-weight="700" font-family="'Mukta','Noto Sans Devanagari','Arial Unicode MS',sans-serif" letter-spacing="0.4">सत्यमेव जयते</text>`
        : ''
    }
  </svg>`;
}

export async function getAshokaStambhPngDataUrl(
  targetWidth = 140,
  color = '#111827',
  showMotto = true
): Promise<string> {
  const targetHeight = Math.round((targetWidth * 130) / 100);
  const svg = getAshokaStambhSvgString(color, showMotto);
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve(svgDataUrl);
      }
    };
    img.onerror = () => {
      resolve(svgDataUrl);
    };
    img.src = svgDataUrl;
  });
}
