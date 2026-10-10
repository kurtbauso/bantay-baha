require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_for_now');

let readings = [];

const getStatus = (level) => {
    if (level < 100) return 'Normal';
    if (level < 150) return 'Alert';
    return 'Danger';
};

app.post('/api/readings', (req, res) => {
    const { sensorId, waterLevelCm, timestamp } = req.body;
    if (!sensorId || typeof waterLevelCm !== 'number' || waterLevelCm < 0 || waterLevelCm > 500) {
        return res.status(400).json({ error: 'Invalid data.' });
    }
    readings.push({ sensorId, waterLevelCm, timestamp: timestamp || new Date().toISOString() });
    res.status(201).json({ message: 'Reading saved.' });
});

app.get('/api/readings', (req, res) => {
    res.json(readings.slice(-50).reverse());
});

app.get('/api/summary', (req, res) => {
    if (readings.length === 0) return res.json({ message: 'No data' });
    const levels = readings.map(r => r.waterLevelCm);
    const average = (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1);
    const statusCounts = { Normal: 0, Alert: 0, Danger: 0 };
    levels.forEach(l => statusCounts[getStatus(l)]++);

    let trend = 'steady';
    if (readings.length >= 10) {
        const avgLast5 = levels.slice(-5).reduce((a, b) => a + b, 0) / 5;
        const avgPrev5 = levels.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
        if (avgLast5 > avgPrev5 + 2) trend = 'rising';
        else if (avgLast5 < avgPrev5 - 2) trend = 'falling';
    }
    res.json({ average, min: Math.min(...levels), max: Math.max(...levels), statusCounts, trend, currentLevel: levels[levels.length - 1] });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
