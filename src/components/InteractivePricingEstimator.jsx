// src/components/InteractivePricingEstimator.jsx
import React, { useState } from 'react';
import { sound } from '../utils/soundEngine';

export default function InteractivePricingEstimator({ onSelectTier }) {
  const [pages, setPages] = useState(3);
  const [needsAI, setNeedsAI] = useState(false);
  const [hasDesign, setHasDesign] = useState(true);

  // Dynamic calculations
  const recommendedTier = needsAI || pages > 6 ? 'DEEP SPACE' : pages > 1 ? 'ORBIT' : 'LIFTOFF';
  const deliveryDays = recommendedTier === 'LIFTOFF' ? '3–5' : recommendedTier === 'ORBIT' ? '5–8' : '8–12';

  return (
    <div className="estimator-box" data-reveal>
      <div className="estimator-header">
        <span className="estimator-badge">⚡ INSTANT SCOPE CALCULATOR</span>
        <h3>Customize Your Build Requirements</h3>
      </div>

      <div className="estimator-controls">
        {/* Slider */}
        <div className="estimator-field">
          <div className="field-label-row">
            <span>ESTIMATED PAGES / SECTIONS</span>
            <strong>{pages} {pages === 1 ? 'Page (Landing)' : 'Sections'}</strong>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={pages}
            onChange={(e) => {
              setPages(Number(e.target.value));
              sound?.playTick?.();
            }}
            className="estimator-slider"
          />
        </div>

        {/* Toggles */}
        <div className="estimator-toggles">
          <button
            type="button"
            className={`toggle-chip ${needsAI ? 'is-active' : ''}`}
            onClick={() => {
              setNeedsAI(!needsAI);
              sound?.playTick?.();
            }}
          >
            {needsAI ? '✓ 24/7 AI Lead Agent Added' : '+ Add AI Lead Agent'}
          </button>

          <button
            type="button"
            className={`toggle-chip ${!hasDesign ? 'is-active' : ''}`}
            onClick={() => {
              setHasDesign(!hasDesign);
              sound?.playTick?.();
            }}
          >
            {!hasDesign ? '✓ Branding & Logo Design Needed' : '+ I Already Have a Logo'}
          </button>
        </div>
      </div>

      {/* Result Card */}
      <div className="estimator-result">
        <div>
          <span className="result-kicker">OPTIMAL PACKAGE</span>
          <h4 className="result-tier">{recommendedTier}</h4>
          <p className="result-days">⏱ Estimated Turnaround: {deliveryDays} Business Days</p>
        </div>

        <a 
          href="#contact" 
          className="estimator-cta"
          onClick={() => {
            sound?.playBeep?.(850, 0.1, 'triangle');
            onSelectTier?.(recommendedTier, `Custom estimate: ${pages} pages, AI: ${needsAI ? 'Yes' : 'No'}`);
          }}
        >
          Lock In This Spec <span>→</span>
        </a>
      </div>
    </div>
  );
}