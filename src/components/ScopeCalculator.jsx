// src/components/ScopeCalculator.jsx
import React, { useState } from 'react';
import { sound } from '../utils/soundEngine';

const BUSINESS_TYPES = [
  { id: 'hospitality', label: 'Restaurant / Hotel', tier: 'ORBIT', days: '5–8 Days', recommendedPlan: 'ORBIT' },
  { id: 'education', label: 'Coaching / Academy', tier: 'LIFTOFF', days: '3–5 Days', recommendedPlan: 'LIFTOFF' },
  { id: 'agency', label: 'Agency / Studio', tier: 'ORBIT', days: '5–8 Days', recommendedPlan: 'ORBIT' },
  { id: 'startup', label: 'SaaS / AI Venture', tier: 'DEEP SPACE', days: '8–12 Days', recommendedPlan: 'DEEP SPACE' }
];

const GOALS = [
  { id: 'brand', label: 'High-Impact Brand Presence', weight: 0 },
  { id: 'bookings', label: 'Instant Reservations / Leads', weight: 1 },
  { id: 'automation', label: '24/7 AI Chat & Automation', weight: 2 }
];

export default function ScopeCalculator({ onApplyConfig }) {
  const [selectedType, setSelectedType] = useState(BUSINESS_TYPES[0]);
  const [selectedGoal, setSelectedGoal] = useState(GOALS[1]);

  // Determine computed tier based on business type & complexity goal
  const computedTier = selectedGoal.weight === 2 
    ? 'DEEP SPACE' 
    : (selectedGoal.weight === 1 && selectedType.tier === 'LIFTOFF') 
      ? 'ORBIT' 
      : selectedType.tier;

  const estimatedDays = computedTier === 'LIFTOFF' ? '3–5' : computedTier === 'ORBIT' ? '5–8' : '8–12';

  const handleApply = () => {
    sound.playBeep(900, 0.12, 'sine');
    onApplyConfig({
      service: `${selectedType.label} Website`,
      plan: computedTier,
      note: `Goal: ${selectedGoal.label} for a ${selectedType.label}. Estimated completion: ${estimatedDays} business days.`
    });

    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="scope-calculator-card" data-reveal>
      <div className="calc-header">
        <div className="calc-tag">
          <span>◇</span> INTERACTIVE SCOPE ESTIMATOR
        </div>
        <p className="calc-sub">Select your parameters to instantly estimate package, architecture & delivery window.</p>
      </div>

      <div className="calc-body">
        {/* Step 1: Business Type */}
        <div className="calc-group">
          <label className="calc-label"><b>01</b> SELECT INDUSTRY</label>
          <div className="calc-options">
            {BUSINESS_TYPES.map((b) => (
              <button
                type="button"
                key={b.id}
                className={`calc-chip ${selectedType.id === b.id ? 'is-active' : ''}`}
                onMouseEnter={() => sound.playTick()}
                onClick={() => {
                  sound.playTick();
                  setSelectedType(b);
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Primary Objective */}
        <div className="calc-group">
          <label className="calc-label"><b>02</b> CORE FUNCTIONALITY GOAL</label>
          <div className="calc-options">
            {GOALS.map((g) => (
              <button
                type="button"
                key={g.id}
                className={`calc-chip ${selectedGoal.id === g.id ? 'is-active' : ''}`}
                onMouseEnter={() => sound.playTick()}
                onClick={() => {
                  sound.playTick();
                  setSelectedGoal(g);
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Output Frame */}
        <div className="calc-output">
          <div className="output-left">
            <span className="output-kicker">RECOMMENDED ARCHITECTURE</span>
            <div className="output-tier-row">
              <h3 className="output-tier-name">{computedTier}</h3>
              <span className="output-tag">{estimatedDays} DAYS TO LAUNCH</span>
            </div>
            <p className="output-desc">
              Tailored with responsive React components, zero-overhead hosting, and custom conversion paths for your industry.
            </p>
          </div>

          <div className="output-right">
            <button
              type="button"
              className="calc-apply-btn"
              onClick={handleApply}
              onMouseEnter={() => sound.playTick()}
            >
              Lock In Scope & Enquire <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}