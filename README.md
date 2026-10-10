# Bantay-Baha: Flood Monitoring App

## Overview
A full-stack, mobile-responsive web application that simulates an IoT flood monitoring sensor, provides real-time data analytics, and uses Google Gemini AI to generate automated public safety advisories in English and Filipino. 

## How to Run Locally
1. Clone the repository: `git clone [repository_url]`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add:
   `GEMINI_API_KEY=your_actual_api_key_here`
4. Start the Express server: `npm start` (Runs on http://localhost:3000)
5. In a separate terminal, start the IoT simulator: `node simulator.js`
6. Open `http://localhost:3000` in your browser.

## AI Prompt Used
```text
"Based on the following flood sensor data, write a short public advisory (maximum 3 sentences) instructing residents what to do. Provide the advisory in English, followed by Filipino. Data: Current Level: {currentLevel}cm, Trend: {trend}, Average: {average}cm. Normal is <100cm, Alert is 100-149cm, Danger is >=150cm. Use only these numbers."
