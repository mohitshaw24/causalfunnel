(function() {
    const API_URL = 'http://localhost:5000/api/events';
    console.log('🎯 Tracker loaded! API URL:', API_URL); // ADD THIS

    function getSessionId() {
        let sessionId = localStorage.getItem('cf_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('cf_session_id', sessionId);
            console.log('🆕 New session created:', sessionId); // ADD THIS
        }
        return sessionId;
    }

    function sendEvent(eventType, data = {}) {
        const payload = {
            sessionId: getSessionId(),
            eventType: eventType,
            pageUrl: window.location.href,
            timestamp: new Date().toISOString(),
            ...data
        };

        console.log('📤 Sending event:', eventType, payload); // ADD THIS

        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            const success = navigator.sendBeacon(API_URL, blob);
            console.log('📡 Beacon sent:', success); // ADD THIS
        } else {
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            })
            .then(res => console.log('✅ Fetch success:', res.status))
            .catch(err => console.error('❌ Fetch error:', err)); // ADD THIS
        }
    }

    console.log('✅ Tracker initialized'); // ADD THIS
    sendEvent('page_view');

    document.addEventListener('click', function(e) {
        console.log('🖱️ Click detected at:', e.clientX, e.clientY); // ADD THIS
        sendEvent('click', {
            clickX: e.clientX,
            clickY: e.clientY
        });
    });
})();