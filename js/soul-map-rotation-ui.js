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
        renderSpotlight: renderSpotlight,
        BASE: BASE
    };
})(typeof window !== 'undefined' ? window : globalThis);