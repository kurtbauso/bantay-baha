require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let readings = [];

const getStatus = (level) => {
    if (level < 100) return 'Normal';
    if (level < 150) return 'Alert';
    return 'Danger';
};

app.post('/api/readings', (req, res) => {
    const { sensorId, waterLevelCm, timestamp } = req.body;

    if (!sensorId || typeof waterLevelCm !== 'number' || waterLevelCm < 0 || waterLevelCm > 500) {
        return res.status(400).json({ error: 'Invalid data. Ensure sensorId is present and waterLevelCm is between 0 and 500.' });
    }

    const newReading = { sensorId, waterLevelCm, timestamp: timestamp || new Date().toISOString() };
    readings.push(newReading);
    res.status(201).json({ message: 'Reading saved successfully.' });
});

app.get('/api/readings', (req, res) => {
    const recent = readings.slice(-50).reverse();
    res.json(recent);
});

app.get('/api/summary', (req, res) => {
    if (readings.length === 0) return res.json({ message: 'No data available' });

    const levels = readings.map(r => r.waterLevelCm);
    const average = (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1);
    const min = Math.min(...levels);
    const max = Math.max(...levels);

    const statusCounts = { Normal: 0, Alert: 0, Danger: 0 };
    levels.forEach(l => statusCounts[getStatus(l)]++);

    let trend = 'steady';
    if (readings.length >= 10) {
        const last5 = levels.slice(-5);
        const prev5 = levels.slice(-10, -5);
        const avgLast5 = last5.reduce((a, b) => a + b, 0) / 5;
        const avgPrev5 = prev5.reduce((a, b) => a + b, 0) / 5;
        
        if (avgLast5 > avgPrev5 + 2) trend = 'rising';
        else if (avgLast5 < avgPrev5 - 2) trend = 'falling';
    }

    res.json({ average, min, max, statusCounts, trend, currentLevel: levels[levels.length - 1] });
});


app.post('/api/advisory', async (req, res) => {
    const summary = req.body;
    
    const fallbackAdvisory = "WARNING: Automated advisory system offline. Current status requires monitoring. Babala: Ang sistema ng abiso ay offline. Mangyaring magmatyag sa kasalukuyang sitwasyon.";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Based on the following flood sensor data, write a short public advisory (maximum 3 sentences) instructing residents what to do. Provide the advisory in English, followed by Filipino. Data: Current Level: ${summary.currentLevel}cm, Trend: ${summary.trend}, Average: ${summary.average}cm. Normal is <100cm, Alert is 100-149cm, Danger is >=150cm. Use only these numbers.`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({ advisory: text });
    } catch (error) {
        console.error("AI Error:", error);
        res.json({ advisory: fallbackAdvisory }); 
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});