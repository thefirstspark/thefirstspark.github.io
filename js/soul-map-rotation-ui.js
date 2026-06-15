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

    function renderHeroProof(container, options) {
        if (!container) return;
        const maps = global.SOUL_MAP_ROTATION || [];
        const checkoutUrl = options.checkoutUrl || 'https://whop.com/checkout/plan_anQKP3Pzf1cGm';
        const { featured } = getFeaturedMaps(maps, 1, options.date);
        const map = featured[0];
        const mapBlock = map
            ? (
                '<a href="' + BASE + map.href + '" class="hero-proof-map" target="_blank" rel="noopener noreferrer">' +
                    '<div class="hero-proof-map-label">Today\u2019s featured map</div>' +
                    '<div class="hero-proof-map-name">' + map.name + '</div>' +
                    '<div class="hero-proof-map-desc">' + map.desc + '</div>' +
                    '<div class="hero-proof-map-enter">Read full map \u2192</div>' +
                '</a>'
            )
            : (
                '<a href="' + BASE + 'kjp519.html" class="hero-proof-map" target="_blank" rel="noopener noreferrer">' +
                    '<div class="hero-proof-map-label">Founder map</div>' +
                    '<div class="hero-proof-map-name">KJP \u00b7 Life Path 5</div>' +
                    '<div class="hero-proof-map-desc">The map routing Book Zero and the tour.</div>' +
                    '<div class="hero-proof-map-enter">Read KJP\u2019s map \u2192</div>' +
                '</a>'
            );

        container.innerHTML =
            '<a href="https://www.investigationdiscovery.com/video/on-the-case-with-paula-zahn-investigation-discovery-atve-us/two-fires-one-match" class="hero-proof-id" target="_blank" rel="noopener noreferrer">' +
                '<div class="hero-proof-id-label">As seen on Investigation Discovery</div>' +
                '<div class="hero-proof-id-title">Two Fires, One Match</div>' +
                '<div class="hero-proof-id-sub">Paula Zahn \u00b7 29-year cold case solved</div>' +
            '</a>' +
            '<div class="hero-proof-visual">' +
                '<img src="/preview-soulmaps.png" alt="Soul Map page preview" class="hero-proof-img" width="600" height="400" loading="eager">' +
                mapBlock +
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