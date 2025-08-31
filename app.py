from flask import Flask, render_template, request, jsonify
from supabase import create_client, Client
import requests
import os
from dotenv import load_dotenv
from intasend import APIService
import datetime

load_dotenv()

app = Flask(__name__)

# Supabase setup
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Hugging Face setup
HF_TOKEN = os.getenv('HF_TOKEN')
HF_MODEL = "finiteautomata/bertweet-base-sentiment-analysis"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

# IntaSend setup
INTASEND_SECRET_KEY = os.getenv('INTASEND_SECRET_KEY')
INTASEND_PUBLISHABLE_KEY = os.getenv('INTASEND_PUBLISHABLE_KEY')
intasend_service = APIService(token=INTASEND_SECRET_KEY, publishable_key=INTASEND_PUBLISHABLE_KEY, test=True)

@app.route('/')
def index():
    """Render the main journal page."""
    return render_template('index.html')

@app.route('/add_entry', methods=['POST'])
def add_entry():
    """Handle journal entry submission, analyze sentiment, and store in Supabase."""
    try:
        entry_text = request.json.get('entry_text')
        if not entry_text:
            return jsonify({'error': 'No entry text provided'}), 400

        # Sanitize input
        entry_text = entry_text.strip()

        # Call HF API for sentiment
        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        payload = {"inputs": entry_text}
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        print("API Response:", response.status_code, response.text)  # Debug
        if response.status_code != 200:
            return jsonify({'error': 'Sentiment analysis failed'}), 500

        result = response.json()
        # Handle multi-class output: map the highest score to a 0-1 range
        sentiments = result[0]
        max_sentiment = max(sentiments, key=lambda x: x['score'])
        sentiment_score = {
            'NEU': 0.5,
            'POS': 0.9,
            'NEG': 0.1
        }.get(max_sentiment['label'], 0.5) * max_sentiment['score']

        # Insert into Supabase
        data = {
            'entry_text': entry_text,
            'sentiment_score': sentiment_score,
            'created_at': datetime.datetime.utcnow().isoformat()  # Ensure created_at is set
        }
        insert_response = supabase.table('journal_entries').insert(data).execute()
        if hasattr(insert_response, 'error') and insert_response.error:
            return jsonify({'error': str(insert_response.error)}), 500

        return jsonify({'success': True, 'sentiment_score': sentiment_score})
    except Exception as e:
        print("Exception:", str(e))  # Debug
        return jsonify({'error': str(e)}), 500

@app.route('/get_entries')
def get_entries():
    """Fetch all journal entries from Supabase for charting."""
    try:
        response = supabase.table('journal_entries').select('*').order('created_at', desc=True).execute()
        if hasattr(response, 'error') and response.error:
            return jsonify({'error': str(response.error)}), 500

        entries = response.data
        labels = [entry['created_at'][:10] for entry in entries]
        scores = [entry['sentiment_score'] for entry in entries]
        return jsonify({'labels': labels, 'scores': scores})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_entry/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    """Delete a journal entry (CRUD example)."""
    try:
        response = supabase.table('journal_entries').delete().eq('id', entry_id).execute()
        if hasattr(response, 'error') and response.error:
            return jsonify({'error': str(response.error)}), 500
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/initiate_payment', methods=['POST'])
def initiate_payment():
    """Initiate IntaSend checkout for premium subscription."""
    try:
        phone_number = request.json.get('phone_number')
        email = request.json.get('email')
        if not phone_number or not email:
            return jsonify({'error': 'Phone number and email are required'}), 400

        # Generate checkout link
        response = intasend_service.collect.checkout(
            phone_number=phone_number,
            email=email,
            amount=100,
            currency="KES",
            comment="Premium Mood Journal Subscription",
            redirect_url="http://localhost:5000/payment_success"
        )

        checkout_url = response.get("url")
        if not checkout_url:
            return jsonify({'error': 'Failed to generate checkout URL'}), 500

        return jsonify({'checkout_url': checkout_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/payment_success')
def payment_success():
    """Success handler: In prod, verify via webhook or status check."""
    return "Payment successful! Premium features unlocked. Return to the app."

if __name__ == '__main__':
    app.run(debug=False)