// Navigation functions
function navigateTo(destination) {
    switch(destination) {
        case 'players':
            window.location.href = 'players.html';
            break;
        case 'invest':
            window.location.href = 'invest.html';
            break;
        case 'tools':
            window.location.href = 'tools.html';
            break;
        case 'playground':
            window.location.href = 'playground.html';
            break;
        case 'graffiti':
            window.location.href = 'graffiti.html';
            break;
        case 'oracle':
            window.location.href = 'oracle.html';
            break;
        case 'void':
            window.location.href = 'void-portal.html';
            break;
        case 'consciousness':
            window.location.href = 'consciousness-playground.html';
            break;
        case 'wall':
            window.location.href = 'the-wall-deluxe.html';
            break;
        default:
            console.log('Unknown destination');
    }
}

// Modal functions
function showMembershipModal() {
    const modal = document.getElementById('membershipModal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');

    // Focus the first button in the modal
    setTimeout(() => {
        const firstButton = modal.querySelector('button:not(.close-modal)');
        if (firstButton) firstButton.focus();
    }, 100);
}

function closeMembershipModal() {
    const modal = document.getElementById('membershipModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('membershipModal');
    if (event.target == modal) {
        closeMembershipModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('membershipModal');
        if (modal.style.display === 'block') {
            closeMembershipModal();
        }

        const helpPanel = document.getElementById('helpPanel');
        if (helpPanel.classList.contains('active')) {
            toggleHelp();
        }
    }
});

// Help panel toggle
function toggleHelp() {
    const helpPanel = document.getElementById('helpPanel');
    const helpButton = document.querySelector('.help-icon');
    const isActive = helpPanel.classList.toggle('active');

    // Update aria-expanded attribute
    if (helpButton) {
        helpButton.setAttribute('aria-expanded', isActive.toString());
    }
}

// Signup function
function signup(tier) {
    const whopLinks = {
        'free': 'https://whop.com/sparkverse-511c/the-sparkverse-lobby/',
        'player': 'https://whop.com/sparkverse-511c/the-players-lounge/',
        'og': 'https://whop.com/sparkverse-511c/og-spark-lifetime-access/'
    };

    window.location.href = whopLinks[tier];
}

// Add particle effects on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = '#fff';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    particle.style.animation = 'particle-fade 1s ease-out forwards';

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-fade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// Constellation connection lines
function drawConstellationLines() {
    const sun = document.querySelector('.spark-sun');
    const constellations = document.querySelectorAll('.constellation');

    constellations.forEach(constellation => {
        const line = constellation.querySelector('.constellation-lines');
        if (line) {
            const sunRect = sun.getBoundingClientRect();
            const constRect = constellation.getBoundingClientRect();

            const sunX = sunRect.left + sunRect.width / 2;
            const sunY = sunRect.top + sunRect.height / 2;
            const constX = constRect.left + 60;
            const constY = constRect.top + 60;

            const angle = Math.atan2(constY - sunY, constX - sunX) * 180 / Math.PI;
            const length = Math.sqrt(Math.pow(constX - sunX, 2) + Math.pow(constY - sunY, 2));

            line.style.position = 'absolute';
            line.style.width = length + 'px';
            line.style.height = '1px';
            line.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)';
            line.style.transformOrigin = '0 0';
            line.style.transform = `rotate(${angle}deg)`;
            line.style.top = '60px';
            line.style.left = '60px';
        }
    });
}

// Initialize on load
window.addEventListener('load', () => {
    drawConstellationLines();

    // Add tooltips to tool dots
    document.querySelectorAll('.tool-dot').forEach(dot => {
        dot.addEventListener('mouseenter', (e) => {
            const tooltip = dot.getAttribute('data-tooltip');
            showTooltip(e.clientX, e.clientY, tooltip);
        });

        dot.addEventListener('mouseleave', hideTooltip);
    });
});

function showTooltip(x, y, text) {
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.position = 'fixed';
    tooltip.style.left = x + 10 + 'px';
    tooltip.style.top = y + 10 + 'px';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '0.9rem';
    tooltip.style.zIndex = '10000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.backdropFilter = 'blur(5px)';

    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) tooltip.remove();
}


// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    const isActive = mobileNav.classList.toggle('active');
    menuBtn.classList.toggle('active');

    // Update aria-expanded attribute
    menuBtn.setAttribute('aria-expanded', isActive.toString());

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileNav = document.getElementById('mobileNav');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            // Small delay to allow navigation
            setTimeout(() => {
                mobileNav.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }, 100);
        });
    });
});

// Track signup clicks for analytics
const originalSignup = signup;
signup = function(tier) {
    console.log(`[Sparkverse] Signup clicked: ${tier} tier`);
    console.log(`[Sparkverse] Timestamp: ${new Date().toISOString()}`);

    // Track with Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'signup_click', {
            'tier': tier,
            'page': window.location.pathname
        });
    }

    originalSignup(tier);
};

// Event Delegation - Handle all clicks with data attributes
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action], [data-navigate], [data-signup]');
    if (!target) return;

    // Handle navigation
    if (target.hasAttribute('data-navigate')) {
        const destination = target.getAttribute('data-navigate');
        navigateTo(destination);
    }

    // Handle actions
    if (target.hasAttribute('data-action')) {
        const action = target.getAttribute('data-action');
        switch(action) {
            case 'toggle-menu':
                toggleMobileMenu();
                break;
            case 'show-modal':
                showMembershipModal();
                break;
            case 'close-modal':
                closeMembershipModal();
                break;
            case 'toggle-help':
                toggleHelp();
                break;
        }
    }

    // Handle signup
    if (target.hasAttribute('data-signup')) {
        const tier = target.getAttribute('data-signup');
        signup(tier);
    }
});
