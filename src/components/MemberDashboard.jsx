import React, { useState, useEffect } from 'react';
import { supabase, getUser, signOut, getUserProfile, getMemberContent, getUserSoulMap } from '../lib/supabase';

export default function MemberDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [soulMap, setSoulMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          window.location.href = '/auth';
          return;
        }

        setUser(currentUser);

        const { data: profileData } = await getUserProfile(currentUser.id);
        setProfile(profileData);

        if (profileData?.tier) {
          const { data: contentData } = await getMemberContent(profileData.tier);
          setContent(contentData || []);
        }

        const { data: soulMapData } = await getUserSoulMap(currentUser.id);
        setSoulMap(soulMapData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="loading">Opening The First Spark...</div>;
  }

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%);
          color: #fff;
        }
        .dashboard-header {
          background: rgba(255, 200, 87, 0.1);
          border-bottom: 2px solid rgba(255, 200, 87, 0.3);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dashboard-header h1 {
          margin: 0;
          color: #ffc857;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .tier-badge {
          background: #ffc857;
          color: #1a1a2e;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        .logout-btn {
          background: transparent;
          color: #ffc857;
          border: 1px solid #ffc857;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .logout-btn:hover {
          background: rgba(255, 200, 87, 0.1);
        }
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .tab-navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid rgba(255, 200, 87, 0.2);
        }
        .tab-button {
          background: none;
          color: rgba(255, 255, 255, 0.6);
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
        }
        .tab-button.active {
          color: #ffc857;
          border-bottom-color: #ffc857;
        }
        .tab-button:hover {
          color: #ffc857;
        }
        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .content-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 200, 87, 0.3);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .content-card:hover {
          border-color: rgba(255, 200, 87, 0.6);
          transform: translateY(-4px);
        }
        .content-card h3 {
          color: #ffc857;
          margin: 0 0 10px 0;
        }
        .content-card p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 15px 0;
          font-size: 14px;
        }
        .content-card button {
          background: #ffc857;
          color: #1a1a2e;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }
        .soul-map-section {
          background: rgba(255, 200, 87, 0.08);
          border: 2px solid rgba(255, 200, 87, 0.4);
          border-radius: 8px;
          padding: 30px;
          text-align: center;
        }
        .soul-map-section h2 {
          color: #ffc857;
          margin: 0 0 10px 0;
        }
        .soul-map-section button {
          background: #ffc857;
          color: #1a1a2e;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 15px;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%);
          color: #ffc857;
          font-size: 20px;
        }
      `}</style>

      <div className="dashboard-header">
        <h1>✨ The First Spark</h1>
        <div className="user-info">
          <div className="tier-badge">{profile?.tier_name || 'Seeker'}</div>
          <span>{user?.email}</span>
          <button className="logout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content Library
          </button>
          <button 
            className={`tab-button ${activeTab === 'soulmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('soulmap')}
          >
            Soul Map
          </button>
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {activeTab === 'content' && (
          <div>
            <h2 style={{ color: '#ffc857', marginBottom: '20px' }}>Your Content</h2>
            {content.length > 0 ? (
              <div className="content-grid">
                {content.map((item) => (
                  <div key={item.id} className="content-card">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <button>Access Content</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Upgrade your tier to access more content.</p>
            )}
          </div>
        )}

        {activeTab === 'soulmap' && (
          <div>
            <h2 style={{ color: '#ffc857', marginBottom: '20px' }}>Your Soul Map</h2>
            {soulMap ? (
              <div className="soul-map-section">
                <h3>Your Sacred Blueprint</h3>
                <p>Sun: {soulMap.sun_sign}</p>
                <p>Moon: {soulMap.moon_sign}</p>
                <p>Rising: {soulMap.rising_sign}</p>
                <button>View Full Soul Map</button>
              </div>
            ) : (
              <div className="soul-map-section">
                <h3>Create Your Soul Map</h3>
                <p>Discover your astrological blueprint and spiritual essence.</p>
                <button onClick={() => window.location.href = '/soul-map-creator'}>
                  Begin Soul Mapping
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ color: '#ffc857' }}>Profile Settings</h2>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member Since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
              <p><strong>Current Tier:</strong> {profile?.tier_name || 'Seeker'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
