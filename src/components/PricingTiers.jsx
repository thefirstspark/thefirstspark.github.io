import React from 'react';
import { TIERS } from '../lib/tiers';

export default function PricingTiers() {
  return (
    <div className="pricing-container">
      <style>{`
        .pricing-container {
          padding: 60px 20px;
          background: linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%);
          min-height: 100vh;
        }
        .pricing-header {
          text-align: center;
          margin-bottom: 60px;
          color: #ffc857;
        }
        .pricing-header h1 {
          font-size: 48px;
          margin: 0 0 20px 0;
          background: linear-gradient(135deg, #ffc857 0%, #ffb744 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pricing-header p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .tier-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 200, 87, 0.2);
          border-radius: 12px;
          padding: 40px 30px;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .tier-card:hover {
          border-color: rgba(255, 200, 87, 0.6);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 200, 87, 0.1);
        }
        .tier-card.featured {
          border-color: #ffc857;
          transform: scale(1.05);
          background: rgba(255, 200, 87, 0.1);
        }
        .featured-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffc857;
          color: #1a1a2e;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .tier-name {
          font-size: 28px;
          color: #ffc857;
          margin: 20px 0 10px 0;
          font-weight: 700;
        }
        .tier-description {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 20px;
          min-height: 40px;
        }
        .tier-price {
          font-size: 44px;
          color: #fff;
          font-weight: 700;
          margin: 20px 0 5px 0;
        }
        .tier-price span {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }
        .tier-features {
          list-style: none;
          padding: 30px 0;
          margin: 0;
          flex-grow: 1;
        }
        .tier-features li {
          color: rgba(255, 255, 255, 0.8);
          padding: 10px 0;
          padding-left: 25px;
          position: relative;
          font-size: 14px;
        }
        .tier-features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #ffc857;
          font-weight: bold;
        }
        .tier-button {
          background: #ffc857;
          color: #1a1a2e;
          border: none;
          padding: 14px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
          margin-top: 20px;
        }
        .tier-button:hover {
          background: #ffb744;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 200, 87, 0.3);
        }
      `}</style>

      <div className="pricing-header">
        <h1>Your Path Awaits</h1>
        <p>Choose the tier that resonates with your spiritual journey and unlock the wisdom of The First Spark.</p>
      </div>

      <div className="pricing-grid">
        {Object.entries(TIERS).map(([key, tier]) => (
          <div key={key} className={`tier-card ${key === 'soul_map' ? 'featured' : ''}`}>
            {key === 'soul_map' && <div className="featured-badge">Most Popular</div>}
            
            <div className="tier-name">{tier.name}</div>
            <div className="tier-description">{tier.description}</div>
            
            <div className="tier-price">
              ${tier.price / 100}
              {!tier.one_time && <span>/month</span>}
              {tier.one_time && <span> one-time</span>}
            </div>

            <ul className="tier-features">
              {tier.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <a href="https://www.thefirstspark.shop" target="_blank" rel="noopener noreferrer">
              <button className="tier-button">
                Get Started on Wix
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
