// src/components/PerformanceBadge.jsx
import React from 'react';
import { sound } from '../utils/soundEngine';

const METRICS = [
  { label: 'PERFORMANCE', score: 100, color: '#4ade80' },
  { label: 'ACCESSIBILITY', score: 100, color: '#4ade80' },
  { label: 'BEST PRACTICES', score: 100, color: '#4ade80' },
  { label: 'SEO RATING', score: 100, color: '#4ade80' },
];

export default function PerformanceBadge() {
  return (
    <aside aria-label="Performance audit metrics" className="perf-badge-strip" data-reveal>
      <div className="perf-badge-inner">
        
        {/* Left descriptor */}
        <div className="perf-badge-meta">
          <span className="perf-badge-tag">
            <span className="perf-pulse-dot" /> GOOGLE LIGHTHOUSE AUDIT
          </span>
          <p className="perf-badge-desc">
            Sub-second first contentful paint. Zero runtime bloat.
          </p>
        </div>

        {/* 4 Score Gauges */}
        <div className="perf-scores-grid">
          {METRICS.map((m) => (
            <div 
              key={m.label} 
              className="perf-score-item"
              onMouseEnter={() => sound?.playTick?.()}
            >
              <div className="perf-ring-wrap">
                <svg className="perf-ring-svg" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="perf-ring-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* 100% Progress Stroke */}
                  <path
                    className="perf-ring-fill"
                    strokeDasharray="100, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="perf-score-num">{m.score}</span>
              </div>
              <span className="perf-score-label">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Speed tag */}
        <div className="perf-badge-speed">
<strong>{'< 0.8s'}</strong>
          <span>4G LOAD SPEED</span>
        </div>

      </div>
    </aside>
  );
}