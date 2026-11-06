// src/hooks/useTilt.js
import { useEffect, useRef } from 'react';

export function useTilt(maxTilt = 10) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 2;
      const yPercent = (y / rect.height - 0.5) * 2;

      el.style.transform = `perspective(1000px) rotateX(${-yPercent * maxTilt}deg) rotateY(${xPercent * maxTilt}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
      el.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [maxTilt]);

  return ref;
}