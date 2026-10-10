const API_URL = 'http://localhost:3000/api/readings';
let currentLevel = 85.0; 

async function sendReading() {
    const change = (Math.random() * 6) - 3;
    currentLevel += change;
    currentLevel = Math.max(0, Math.min(500, currentLevel)); 

    const payload = {
        sensorId: "CREEK-01",
        waterLevelCm: parseFloat(currentLevel.toFixed(1)),
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            console.log(`Sent: ${payload.waterLevelCm}cm`);
        }
    } catch (error) {
        console.error('Failed to send reading. Is the server running?');
    }
}

setInterval(sendReading, 5000);
console.log('Simulator started. Press Ctrl+C to stop.');








