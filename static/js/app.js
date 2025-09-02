// Entry submission
document.getElementById('submitEntry').addEventListener('click', async () => {
    const entryText = document.getElementById('entryText').value.trim();
    if (!entryText) {
        alert('Please enter a journal entry.');
        return;
    }
    document.getElementById('submitEntry').disabled = true;
    try {
        const response = await fetch('/add_entry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entry_text: entryText })
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('sentimentResult').innerText = `Entry added! Sentiment score: ${data.sentiment_score.toFixed(2)}`;
            document.getElementById('entryText').value = ''; // Clear input
            updateChart();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        document.getElementById('submitEntry').disabled = false;
    }
});

// Chart update
let moodChart;
async function updateChart() {
    const response = await fetch('/get_entries');
    const data = await response.json();
    if (data.labels && data.scores) {
        const ctx = document.getElementById('moodChart').getContext('2d');
        if (moodChart) moodChart.destroy(); // Destroy previous chart
        moodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Mood Score (0-1)',
                    data: data.scores,
                    borderColor: '#6B46C1',
                    backgroundColor: 'rgba(107, 70, 193, 0.2)',
                    fill: true,
                    tension: 0.4 // Smooth line
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, max: 1 } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}
updateChart(); // Initial load

// Recommendation
document.getElementById('getRecommendation').addEventListener('click', async () => {
    document.getElementById('getRecommendation').disabled = true;
    try {
        const response = await fetch('/generate_recommendation');
        const data = await response.json();
        if (data.success) {
            document.getElementById('recommendationText').innerText = data.recommendation;
        } else {
            document.getElementById('recommendationText').innerText = `Error: ${data.error}`;
        }
    } catch (err) {
        document.getElementById('recommendationText').innerText = `Error: ${err.message}`;
    } finally {
        document.getElementById('getRecommendation').disabled = false;
    }
});

// Payment (Updated to handle form submission)
document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('premiumPhone').value.trim();
    const email = document.getElementById('premiumEmail').value.trim();
    if (!phone || !email) {
        alert('Please enter both email and phone number.');
        return;
    }
    document.querySelector('#paymentForm button').disabled = true;
    try {
        const response = await fetch('/initiate_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: phone, email: email })
        });
        const data = await response.json();
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        } else {
            alert(data.error || 'Payment initiation failed');
        }
    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        document.querySelector('#paymentForm button').disabled = false;
    }
});

// Check premium status and show export button
async function checkPremiumStatus() {
    const userId = '550e8400-e29b-41d4-a716-446655440000'; // Premium test user
    try {
        const response = await fetch(`/check_premium?user_id=${userId}`);
        const data = await response.json();
        if (data.is_premium) {
            document.getElementById('exportButton').style.display = 'block';
            document.getElementById('exportLink').href = `/export_trends?user_id=${userId}`;
        }
    } catch (err) {
        console.error('Error checking premium status:', err);
    }
}
checkPremiumStatus(); // Initial check
setInterval(checkPremiumStatus, 30000); // Check every 30 seconds (optional)