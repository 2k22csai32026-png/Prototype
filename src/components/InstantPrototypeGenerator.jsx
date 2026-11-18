import React, { useState } from 'react';

const industryTemplates = {
  manufacturing: {
    title: 'Industrial & Export Catalog',
    badge: 'Factory Direct',
    products: [
      { name: 'Genuine Leather Executive Bag', moq: '50 pcs', price: '$45.00' },
      { name: 'Classic Bifold Wallet (Bulk)', moq: '200 pcs', price: '$8.50' },
      { name: 'Handcrafted Leather Jacket', moq: '30 pcs', price: '$85.00' }
    ]
  },
  restaurant: {
    title: 'Quick Order & Table Menu',
    badge: 'Cafe & Dining',
    products: [
      { name: 'Chocolate Decadence Pancakes', moq: 'Fresh', price: '₹249' },
      { name: 'Artisan Cold Brew Coffee', moq: 'Brewed', price: '₹179' },
      { name: 'Wood-Fired Margherita Pizza', moq: 'Hot', price: '₹399' }
    ]
  },
  retail: {
    title: 'Boutique Storefront',
    badge: 'E-Commerce',
    products: [
      { name: 'Minimalist Cotton Hoodie', moq: '10 pcs', price: '₹1,299' },
      { name: 'Designer Canvas Tote', moq: '25 pcs', price: '₹699' }
    ]
  },
  // Add Real Estate category here:
  realEstate: {
    title: 'Property & Housing Listings',
    badge: 'Real Estate',
    products: [
      { name: 'Modern 3BHK Luxury Apartment', moq: 'Ready to Move', price: '₹85 Lakhs' },
      { name: 'Commercial Office Space (1200 sq.ft)', moq: 'Prime Location', price: '₹1.2 Cr' },
      { name: 'Independent Duplex Villa', moq: 'Gated Community', price: '₹1.8 Cr' }
    ]
  }
};
export default function InstantPrototypeGenerator() {
  const [businessName, setBusinessName] = useState('XYZ Manufactures');
  const [industry, setIndustry] = useState('manufacturing');

  const activeTemplate = industryTemplates[industry];

  const handleWhatsAppInquiry = (productName) => {
    const text = encodeURIComponent(`Hi! I checked the live prototype for ${businessName} built by PROTOTYPE and I'm interested in ordering/inquiring about: ${productName}. Let's discuss!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <section className="service-details">
      <div className="trust-heading" style={{ maxWidth: '100%', marginBottom: '60px' }}>
        <p className="section-label">
          INTERACTIVE STUDIO TOOL
        </p>
        <h2>
          INSTANT PROTOTYPE
          <br />
          <span>GENERATOR.</span>
        </h2>
        <p className="trust-intro" style={{ marginTop: '24px' }}>
          Type any local business name below to instantly spin up a live mobile-ready web catalog mockup and test direct WhatsApp ordering.
        </p>
      </div>

      <div className="details-content" style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Control Panel */}
          <div className="trust-card" style={{ padding: '34px', minHeight: 'auto', background: '#0d0d0d', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <span className="section-label" style={{ marginBottom: '20px', display: 'block' }}>01 / CONFIGURE BUSINESS</span>
            
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', color: '#777777', marginBottom: '8px' }}>BUSINESS NAME</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ width: '100%', background: 'transparent', color: '#fff', fontSize: '15px', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', color: '#777777', marginBottom: '12px' }}>SELECT INDUSTRY TEMPLATE</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.keys(industryTemplates).map((key) => (
                  <button
                    key={key}
                    onClick={() => setIndustry(key)}
                    style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: industry === key ? 'rgba(255, 255, 255, 0.1)' : 'transparent', color: industry === key ? '#fff' : '#a0a0a0', border: industry === key ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)', fontWeight: industry === key ? '700' : '400', transition: 'all 0.2s ease' }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '1px' }}>{industryTemplates[key].badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#9c9c9c', lineHeight: '1.6', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '16px' }}>
              {/* 💡 <strong style={{ color: '#fff' }}>Pitch Strategy:</strong> Share this live preview link with local business owners so they can test their own brand name on mobile instantly. */}
            </p>
          </div>

          {/* Right Phone Mockup View */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '340px', backgroundColor: '#06080c', border: '4px solid rgba(255, 255, 255, 0.2)', borderRadius: '24px', padding: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#777777', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{activeTemplate.badge}</span>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: '2px 0 0 0' }}>{businessName || 'Your Business Name'}</h4>
                </div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px', color: '#d0d0d0' }}>
                  <p style={{ fontWeight: 'bold', margin: '0', color: '#fff' }}>✨ Live Storefront Preview</p>
                  <p style={{ margin: '3px 0 0 0', opacity: '0.7', fontSize: '10px' }}>Optimized for direct WhatsApp orders.</p>
                </div>

                {activeTemplate.products.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0d0d0d', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{item.name}</span>
                      <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#fff', fontWeight: 'bold' }}>{item.price}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#777777' }}>MOQ: {item.moq}</span>
                      <button 
                        onClick={() => handleWhatsAppInquiry(item.name)}
                        style={{ padding: '6px 12px', backgroundColor: '#ffffff', color: '#080808', fontWeight: '700', borderRadius: '4px', fontSize: '10px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                      >
                        💬 Order via WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
                <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#777777', letterSpacing: '1px' }}>
                  Powered by <strong style={{ color: '#fff' }}>PROTOTYPE</strong> 
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}