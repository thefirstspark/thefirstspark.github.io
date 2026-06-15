(function (global) {
    const BASE = 'https://soul-maps.thefirstspark.shop/';

    function dayOfYear(date) {
        const d = date || new Date();
        const start = new Date(d.getFullYear(), 0, 0);
        return Math.floor((d - start) / 86400000);
    }

    function getFeaturedMaps(maps, count, date) {
        if (!maps || !maps.length) return [];
        const day = dayOfYear(date);
        const start = day % maps.length;
        const featured = [];
        for (let i = 0; i < Math.min(count, maps.length); i++) {
            featured.push({
                ...maps[(start + i) % maps.length],
                rotationIndex: (start + i) % maps.length
            });
        }
        return { featured, day, start, total: maps.length };
    }

    function descToChips(desc) {
        if (!desc) return [];
        return desc.split('\u00b7').map(function(s) { return s.trim(); }).filter(Boolean).slice(0, 4);
    }

    function renderHeroProof(container, options) {
        if (!container) return;
        const maps = global.SOUL_MAP_ROTATION || [];
        const checkoutUrl = options.checkoutUrl || 'https://whop.com/checkout/plan_anQKP3Pzf1cGm';
        const { featured } = getFeaturedMaps(maps, 1, options.date);
        const map = featured[0];
        const chips = map ? descToChips(map.desc) : ['Life Path 5', 'Expression 11', 'Soul Urge 7', 'Taurus/Gemini'];
        const chipsHtml = '<div class="hero-proof-chips">' +
            chips.map(function(c) { return '<span class="hero-proof-chip">' + c + '</span>'; }).join('') +
            '</div>';
        const mapHref = map ? (BASE + map.href) : (BASE + 'kjp519.html');
        const mapLabel = map ? 'Today\u2019s featured map' : 'Founder map';
        const mapName = map ? map.name : 'KJP \u00b7 Life Path 5';
        const mapDesc = map ? map.desc : 'The map routing Book Zero and the tour.';

        const ytWatch = 'https://youtu.be/-DaJ6J_PBe0?si=JBe_eLUiEgmq3tdd';
        const ytEmbed = 'https://www.youtube.com/embed/-DaJ6J_PBe0';

        container.innerHTML =
            '<div class="hero-proof-yt">' +
                '<iframe src="' + ytEmbed + '" title="Two Fires, One Match \u2014 On The Case With Paula Zahn" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>' +
            '</div>' +
            '<a href="' + ytWatch + '" class="hero-proof-id" target="_blank" rel="noopener noreferrer">' +
                '<div class="hero-proof-id-label">As seen on Investigation Discovery</div>' +
                '<div class="hero-proof-id-title">Two Fires, One Match</div>' +
                '<div class="hero-proof-id-sub">Paula Zahn \u00b7 29-year cold case \u00b7 Open on YouTube</div>' +
            '</a>' +
            '<div class="hero-proof-visual">' +
                '<img src="/preview-soulmaps.png" alt="Soul Map page preview" class="hero-proof-img" width="600" height="400" loading="lazy">' +
                chipsHtml +
                '<a href="' + mapHref + '" class="hero-proof-map" target="_blank" rel="noopener noreferrer">' +
                    '<div class="hero-proof-map-label">' + mapLabel + '</div>' +
                    '<div class="hero-proof-map-name">' + mapName + '</div>' +
                    '<div class="hero-proof-map-desc">' + mapDesc + '</div>' +
                    '<div class="hero-proof-map-enter">Read full map \u2192</div>' +
                '</a>' +
            '</div>' +
            '<div class="hero-proof-footer">' +
                '<a href="' + checkoutUrl + '" class="hero-proof-price" target="_blank" rel="noopener noreferrer">Get yours \u00b7 $44</a>' +
                '<a href="' + BASE.replace(/\/$/, '') + '/" class="hero-proof-archive" target="_blank" rel="noopener noreferrer">48 maps in archive</a>' +
            '</div>';
    }

    function renderSpotlight(container, options) {
        if (!container) return;
        const maps = global.SOUL_MAP_ROTATION || [];
        const count = options.count || 3;
        const { featured, day, start, total } = getFeaturedMaps(maps, count, options.date);

        if (!featured.length) {
            container.innerHTML = '';
            return;
        }

        const archiveUrl = options.archiveUrl || (BASE.replace(/\/$/, '') + '/');
        const showMeta = options.showRotationMeta !== false;
        const showArchiveLink = options.showArchiveLink !== false;
        const checkoutUrl = options.checkoutUrl || 'https://whop.com/checkout/plan_anQKP3Pzf1cGm';
        const cards = featured.map(function (map) {
            return (
                '<div class="map-spotlight-card">' +
                    '<a href="' + BASE + map.href + '" class="map-spotlight-link" target="_blank" rel="noopener noreferrer">' +
                        '<div class="map-spotlight-sub">' + map.sub + '</div>' +
                        '<div class="map-spotlight-name">' + map.name + '</div>' +
                        '<div class="map-spotlight-desc">' + map.desc + '</div>' +
                        '<div class="map-spotlight-enter">Read map →</div>' +
                    '</a>' +
                    '<a href="' + checkoutUrl + '" class="map-spotlight-buy" target="_blank" rel="noopener noreferrer">Get yours · OG Edition $44 →</a>' +
                '</div>'
            );
        }).join('');

        const meta = showMeta
            ? '<p class="map-spotlight-meta">Today\u2019s spotlight \u00b7 maps ' + (start + 1) + '\u2013' + (((start + featured.length - 1) % total) + 1) + ' of ' + total + ' \u00b7 new trio every day</p>'
            : '';

        const archiveLink = showArchiveLink
            ? '<a href="' + archiveUrl + '" class="map-spotlight-archive" target="_blank" rel="noopener noreferrer">Browse full archive →</a>'
            : '';

        container.innerHTML =
            '<div class="map-spotlight-grid">' + cards + '</div>' +
            meta +
            archiveLink;
    }

    global.SoulMapRotation = {
        dayOfYear: dayOfYear,
        getFeaturedMaps: getFeaturedMaps,
        renderHeroProof: renderHeroProof,
        renderSpotlight: renderSpotlight,
        BASE: BASE
    };
})(typeof window !== 'undefined' ? window : globalThis);