let chart;

function getStatusColor(level) {
    if (level < 100) return 'status-normal';
    if (level < 150) return 'status-alert';
    return 'status-danger';
}

function getStatusText(level) {
    if (level < 100) return 'NORMAL';
    if (level < 150) return 'ALERT';
    return 'DANGER';
}

async function fetchData() {
    try {
        const [readingsRes, summaryRes] = await Promise.all([
            fetch('/api/readings'), fetch('/api/summary')
        ]);
        const readings = await readingsRes.json();
        const summary = await summaryRes.json();
        if (readings.length > 0) updateUI(readings, summary);
    } catch (err) { console.error(err); }
}

function updateUI(readings, summary) {
    const current = readings[0].waterLevelCm;
    
    const card = document.getElementById('statusCard');
    document.getElementById('currentLevel').innerText = `${current} cm`;
    document.getElementById('statusText').innerText = getStatusText(current);
    card.className = `status-card ${getStatusColor(current)}`;

    document.getElementById('trend').innerText = summary.trend.toUpperCase();
    document.getElementById('avg').innerText = `${summary.average} cm`;
    document.getElementById('min').innerText = `${summary.min} cm`;
    document.getElementById('max').innerText = `${summary.max} cm`;

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    readings.slice(0, 10).forEach(r => {
        const time = new Date(r.timestamp).toLocaleTimeString();
        tbody.innerHTML += `<tr><td>${time}</td><td>${r.waterLevelCm}</td></tr>`;
    });

    updateChart(readings.slice(0, 20).reverse());
}

function updateChart(data) {
    const ctx = document.getElementById('levelChart').getContext('2d');
    const labels = data.map(d => new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}));
    const levels = data.map(d => d.waterLevelCm);

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = levels;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'Level (cm)', data: levels, borderColor: '#007bff', fill: false }] },
            options: { responsive: true, animation: false }
        });
    }
}

async function generateAdvisory() {
    const btn = document.getElementById('btnAdvisory');
    const box = document.getElementById('advisoryOutput');
    btn.innerText = "Generating...";
    try {
        const summaryRes = await fetch('/api/summary');
        const summary = await summaryRes.json();
        const res = await fetch('/api/advisory', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(summary)
        });
        const data = await res.json();
        box.innerText = data.advisory;
        box.classList.remove('hidden');
    } catch (err) {
        box.innerText = "Error connecting to AI service.";
        box.classList.remove('hidden');
    } finally {
        btn.innerText = "Generate AI Advisory";
    }
}

fetchData();
setInterval(fetchData, 5000);