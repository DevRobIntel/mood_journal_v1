// Chart init
let moodChart;
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('moodChart')?.getContext('2d');
    if (!ctx) {
        console.error('Canvas element not found!');
        return;
    }
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Mood Score (0-1)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 1 } }
        }
    });
    fetchEntries(); // Fetch after chart init
});

// Form submission
document.getElementById('journal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const entryText = document.getElementById('entry-text').value;
    if (!entryText) return alert('Please enter text.');

    try {
        const response = await fetch('/add_entry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entry_text: entryText })
        });
        const data = await response.json();
        if (data.success) {
            alert(`Entry added! Sentiment score: ${data.sentiment_score}`);
            document.getElementById('entry-text').value = '';
            fetchEntries();
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert('Error: ' + err);
    }
});

// Fetch entries
async function fetchEntries() {
    try {
        const response = await fetch('/get_entries');
        const data = await response.json();
        console.log('Fetch Entries Data:', data); // Debug
        if (data.labels) {
            moodChart.data.labels = data.labels;
            moodChart.data.datasets[0].data = data.scores;
            moodChart.update();
        } else {
            console.warn('No labels in response:', data);
        }
    } catch (err) {
        console.error('Error fetching entries:', err);
    }
}

// Premium button: Collect email and phone
document.getElementById('premium-button').addEventListener('click', async () => {
    const email = document.getElementById('premium-email').value;
    const phone = document.getElementById('premium-phone').value;
    if (!email || !phone) return alert('Please enter email and phone number.');

    try {
        const response = await fetch('/initiate_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone_number: phone })
        });
        const data = await response.json();
        if (data.checkout_url) {
            window.location.href = data.checkout_url; // Redirect to IntaSend checkout
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert('Error: ' + err);
    }
});