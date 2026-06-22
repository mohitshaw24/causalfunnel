import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://causalfunnel-backend-i5fy.onrender.com/api';;

export default function Dashboard() {
    const [view, setView] = useState('sessions');
    
    return (
        <div style={{ display: 'flex', fontFamily: 'sans-serif' }}>
            {/* Sidebar Navigation */}
            <nav style={{ width: '200px', padding: '20px', background: '#f4f4f4', height: '100vh', borderRight: '1px solid #ddd' }}>
                <h2 style={{ color: '#333' }}>CausalFunnel</h2>
                <button 
                    onClick={() => setView('sessions')} 
                    style={btnStyle(view === 'sessions')}
                >
                    Sessions View
                </button>
                <button 
                    onClick={() => setView('heatmap')} 
                    style={btnStyle(view === 'heatmap')}
                >
                    Heatmap View
                </button>
            </nav>
            
            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '30px' }}>
                {view === 'sessions' ? <SessionsView /> : <HeatmapView />}
            </main>
        </div>
    );
}

// Helper for button styling
const btnStyle = (isActive) => ({
    display: 'block', width: '100%', padding: '10px', marginBottom: '10px',
    border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer',
    backgroundColor: isActive ? '#007bff' : 'white',
    color: isActive ? 'white' : 'black'
});

function SessionsView() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE}/sessions`).then(res => setSessions(res.data));
    }, []);

    const loadJourney = async (sessionId) => {
        setSelectedSession(sessionId);
        const res = await axios.get(`${API_BASE}/sessions/${sessionId}/events`);
        setEvents(res.data);
    };

    return (
        <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ flex: 1 }}>
                <h3>All Sessions</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {sessions.map(s => (
                        <li 
                            key={s._id} 
                            onClick={() => loadJourney(s._id)} 
                            style={{
                                padding: '12px', border: '1px solid #eee', marginBottom: '5px', 
                                cursor: 'pointer', background: selectedSession === s._id ? '#e2e6ea' : 'white'
                            }}
                        >
                            <strong>ID:</strong> {s._id.slice(-6)}... <br/>
                            <small>{s.totalEvents} events | Last seen: {new Date(s.lastSeen).toLocaleTimeString()}</small>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div style={{ flex: 2 }}>
                <h3>User Journey Timeline</h3>
                {events.length > 0 ? (
                    <div style={{ borderLeft: '2px solid #007bff', paddingLeft: '20px' }}>
                        {events.map(e => (
                            <div key={e._id} style={{ marginBottom: '20px', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: '-26px', top: '5px', width: '10px', height: '10px', 
                                    background: e.eventType === 'click' ? 'red' : 'green', borderRadius: '50%'
                                }}></div>
                                <strong style={{textTransform: 'uppercase', fontSize: '12px', color: '#666'}}>{e.eventType}</strong>
                                <br/>
                                <span style={{fontSize: '14px'}}>{e.pageUrl}</span>
                                {e.eventType === 'click' && (
                                    <span style={{marginLeft: '10px', color: 'red'}}>
                                        (X: {e.clickX}, Y: {e.clickY})
                                    </span>
                                )}
                                <br/>
                                <small style={{color: '#999'}}>{new Date(e.timestamp).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Select a session to view the user journey.</p>
                )}
            </div>
        </div>
    );
}

function HeatmapView() {
    const [pageUrl, setPageUrl] = useState('');
    const [clicks, setClicks] = useState([]);

    const loadHeatmap = async () => {
        if(!pageUrl) return alert('Please enter a URL');
        const res = await axios.get(`${API_BASE}/heatmap`, { params: { pageUrl } });
        setClicks(res.data);
    };

    return (
        <div>
            <h3>Click Heatmap</h3>
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Paste the exact Page URL here..." 
                    value={pageUrl} 
                    onChange={(e) => setPageUrl(e.target.value)}
                    style={{padding: '8px', width: '400px', marginRight: '10px'}}
                />
                <button onClick={loadHeatmap} style={{padding: '8px 16px'}}>Load Data</button>
            </div>
            
            {/* Mock Page Container to plot coordinates */}
            <div style={{ 
                position: 'relative', width: '100%', maxWidth: '1000px', height: '600px', 
                border: '1px solid #ccc', background: '#f9f9f9', overflow: 'hidden'
            }}>
                <p style={{position: 'absolute', top: '20px', left: '20px', color: '#888'}}>
                    Visualizing {clicks.length} clicks for: <br/><code>{pageUrl}</code>
                </p>
                
                {/* Plotting the clicks */}
                {clicks.map((c, i) => (
                    <div 
                        key={i} 
                        style={{ 
                            position: 'absolute', 
                            left: `${c.clickX}px`, 
                            top: `${c.clickY}px`, 
                            width: '12px', 
                            height: '12px', 
                            background: 'rgba(255, 0, 0, 0.6)', 
                            border: '1px solid white',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                        }} 
                        title={`Click at X:${c.clickX}, Y:${c.clickY}`}
                    />
                ))}
            </div>
        </div>
    );
}