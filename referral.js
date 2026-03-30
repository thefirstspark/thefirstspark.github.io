// ========================================
// SPARK REFERRAL ENGINE
// Tracks referrals via ?ref=CODE URL params
// Rewards: badges, unlocks, leaderboard
// ========================================

(function() {
    'use strict';

    const STORAGE_KEY = 'spark_referral';
    const REF_PARAM = 'ref';

    // Generate a unique referral code for this user
    function generateRefCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'SP-';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Get or create referral data
    function getReferralData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);

        const data = {
            myCode: generateRefCode(),
            referredBy: null,
            referrals: [],
            badges: [],
            totalReferred: 0,
            createdAt: new Date().toISOString()
        };
        saveReferralData(data);
        return data;
    }

    function saveReferralData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Check for incoming referral
    function checkIncomingReferral() {
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get(REF_PARAM);

        if (!refCode) return;

        const data = getReferralData();

        // Don't self-refer
        if (refCode === data.myCode) return;

        // Only track first referral
        if (data.referredBy) return;

        data.referredBy = refCode;
        data.referredAt = new Date().toISOString();
        data.referredPage = window.location.pathname;
        saveReferralData(data);

        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'referral_landed', {
                'ref_code': refCode,
                'landing_page': window.location.pathname
            });
        }

        // Log the referral for the referrer (stored in a separate key)
        logReferralForReferrer(refCode);
    }

    // Track referral count in a shared counter
    function logReferralForReferrer(refCode) {
        const counterKey = 'spark_ref_counter_' + refCode;
        const count = parseInt(localStorage.getItem(counterKey) || '0') + 1;
        localStorage.setItem(counterKey, count.toString());
    }

    // Badge definitions
    const BADGES = {
        first_spark: { name: 'First Spark', icon: '✦', desc: 'Referred your first person', threshold: 1 },
        flame_starter: { name: 'Flame Starter', icon: '🔥', desc: 'Referred 5 people', threshold: 5 },
        signal_booster: { name: 'Signal Booster', icon: '📡', desc: 'Referred 10 people', threshold: 10 },
        spark_recruiter: { name: 'Spark Recruiter', icon: '⚡', desc: 'Referred 25 people', threshold: 25 },
        constellation_builder: { name: 'Constellation Builder', icon: '🌌', desc: 'Referred 50 people', threshold: 50 }
    };

    // Check and award badges
    function checkBadges(data) {
        const count = data.totalReferred;
        let newBadge = null;

        Object.entries(BADGES).forEach(([key, badge]) => {
            if (count >= badge.threshold && !data.badges.includes(key)) {
                data.badges.push(key);
                newBadge = badge;
            }
        });

        if (newBadge) {
            saveReferralData(data);
            showBadgeNotification(newBadge);
        }

        return newBadge;
    }

    // Badge notification
    function showBadgeNotification(badge) {
        const notif = document.createElement('div');
        notif.className = 'spark-badge-notif';
        notif.innerHTML = `
            <div class="badge-notif-icon">${badge.icon}</div>
            <div class="badge-notif-text">
                <div class="badge-notif-title">Badge Unlocked!</div>
                <div class="badge-notif-name">${badge.name}</div>
                <div class="badge-notif-desc">${badge.desc}</div>
            </div>
        `;
        document.body.appendChild(notif);

        // Inject styles if not present
        if (!document.getElementById('spark-badge-styles')) {
            const style = document.createElement('style');
            style.id = 'spark-badge-styles';
            style.textContent = `
                .spark-badge-notif {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #12121a, #1a1a2e);
                    border: 1px solid #d4af37;
                    border-radius: 12px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10000;
                    animation: badgeSlideIn 0.5s ease, badgeFadeOut 0.5s ease 4s forwards;
                    box-shadow: 0 10px 40px rgba(212,175,55,0.3);
                }
                .badge-notif-icon { font-size: 2rem; }
                .badge-notif-title {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: #d4af37;
                }
                .badge-notif-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #e8e8e8;
                }
                .badge-notif-desc {
                    font-size: 0.8rem;
                    color: rgba(232,232,232,0.5);
                }
                @keyframes badgeSlideIn {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes badgeFadeOut {
                    to { transform: translateX(100px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => notif.remove(), 5000);
    }

    // Get referral link for sharing
    function getReferralLink(path) {
        const data = getReferralData();
        const base = 'https://thefirstspark.shop';
        const page = path || '/discover.html';
        return `${base}${page}?ref=${data.myCode}`;
    }

    // Expose API globally
    window.SparkReferral = {
        getData: getReferralData,
        getLink: getReferralLink,
        getCode: function() { return getReferralData().myCode; },
        getBadges: function() {
            const data = getReferralData();
            return data.badges.map(key => BADGES[key]).filter(Boolean);
        },
        getAllBadges: function() { return BADGES; },
        trackConversion: function(action) {
            // Track when a referred user completes an action
            const data = getReferralData();
            if (data.referredBy) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'referral_conversion', {
                        'ref_code': data.referredBy,
                        'action': action,
                        'page': window.location.pathname
                    });
                }
            }
        }
    };

    // Auto-initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        checkIncomingReferral();

        // Update quiz counter when someone completes the archetype quiz
        const existingArchetype = localStorage.getItem('spark_archetype');
        if (existingArchetype) {
            const count = parseInt(localStorage.getItem('archetype_quiz_count') || '0');
            localStorage.setItem('archetype_quiz_count', Math.max(count, 1).toString());
        }
    });

})();
