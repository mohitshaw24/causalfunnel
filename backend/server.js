const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ FIXED: Explicitly allow specific origins with credentials
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'null'  // For file:// protocol
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/causalfunnel';

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// --- API ENDPOINTS ---
// (Keep all your routes below exactly as they were!)

// Mongoose Schema for Events
const eventSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, index: true },
    eventType: { type: String, required: true, enum: ['page_view', 'click'] },
    pageUrl: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    clickX: { type: Number },
    clickY: { type: Number }
});

const Event = mongoose.model('Event', eventSchema);

// --- API ENDPOINTS ---

// 1. Receive and store events
app.post('/api/events', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. Fetch list of sessions with event counts (Aggregation is efficient here)
app.get('/api/sessions', async (req, res) => {
    try {
        const sessions = await Event.aggregate([
            {
                $group: {
                    _id: '$sessionId',
                    totalEvents: { $sum: 1 },
                    firstSeen: { $min: '$timestamp' },
                    lastSeen: { $max: '$timestamp' }
                }
            },
            { $sort: { lastSeen: -1 } }
        ]);
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Fetch all events for a specific session (User Journey)
app.get('/api/sessions/:sessionId/events', async (req, res) => {
    try {
        const events = await Event.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Fetch click data for a page (Heatmap)
app.get('/api/heatmap', async (req, res) => {
    try {
        const { pageUrl } = req.query;
        if (!pageUrl) return res.status(400).json({ error: 'pageUrl is required' });
        
        const clicks = await Event.find({ 
            eventType: 'click', 
            pageUrl: pageUrl 
        }).select('clickX clickY timestamp');
        
        res.json(clicks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));