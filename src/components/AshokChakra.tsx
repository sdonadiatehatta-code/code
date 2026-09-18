import React from 'react';

interface AshokChakraProps {
  className?: string;
  size?: number;
  color?: string;
}

export const AshokChakra: React.FC<AshokChakraProps> = ({
  className = 'w-10 h-10',
  size = 40,
  color = '#000080',
}) => {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ashok Chakra"
      role="img"
    >
      {/* Outer circular rim */}
      <circle cx="0" cy="0" r="46" fill="none" stroke={color} strokeWidth="3" />
      {/* Inner guide ring */}
      <circle cx="0" cy="0" r="41" fill="none" stroke={color} strokeWidth="1" />
      
      {/* 24 Radial Spokes */}
      {spokes.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = Math.cos(rad) * 9;
        const y1 = Math.sin(rad) * 9;
        const x2 = Math.cos(rad) * 41;
        const y2 = Math.sin(rad) * 41;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}

      {/* Central Hub & Rings */}
      <circle cx="0" cy="0" r="9" fill={color} />
      <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
      <circle cx="0" cy="0" r="2.2" fill={color} />

      {/* 24 Outer Rim Accent Nodes */}
      {spokes.map((angle) => {
        const dotRad = ((angle + 7.5) * Math.PI) / 180;
        const dx = Math.cos(dotRad) * 43.5;
        const dy = Math.sin(dotRad) * 43.5;
        return (
          <circle
            key={`dot-${angle}`}
            cx={dx}
            cy={dy}
            r="1"
            fill={color}
          />
        );
      })}
    </svg>
  );
};

export function getAshokChakraSvgString(color = '#000080'): string {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);
  const lines = spokes
    .map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = (Math.cos(rad) * 9).toFixed(2);
      const y1 = (Math.sin(rad) * 9).toFixed(2);
      const x2 = (Math.cos(rad) * 41).toFixed(2);
      const y2 = (Math.sin(rad) * 41).toFixed(2);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
    })
    .join('');

  const dots = spokes
    .map((angle) => {
      const dotRad = ((angle + 7.5) * Math.PI) / 180;
      const dx = (Math.cos(dotRad) * 43.5).toFixed(2);
      const dy = (Math.sin(dotRad) * 43.5).toFixed(2);
      return `<circle cx="${dx}" cy="${dy}" r="1" fill="${color}"/>`;
    })
    .join('');

  return `<svg viewBox="-50 -50 100 100" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="46" fill="none" stroke="${color}" stroke-width="3"/>
    <circle cx="0" cy="0" r="41" fill="none" stroke="${color}" stroke-width="1"/>
    ${lines}
    <circle cx="0" cy="0" r="9" fill="${color}"/>
    <circle cx="0" cy="0" r="4.5" fill="#ffffff"/>
    <circle cx="0" cy="0" r="2.2" fill="${color}"/>
    ${dots}
  </svg>`;
}

export async function getAshokChakraPngDataUrl(size = 200, color = '#000080'): Promise<string> {
  const svg = getAshokChakraSvgString(color);
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
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
