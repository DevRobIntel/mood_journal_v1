# Mood Journal: AI-Powered Emotion Tracker

## Overview

A web app for journaling, AI sentiment analysis, mood trends, and personalized mood recommendations. Aligned with SDG 3 (Good Health and Well-Being). Monetized with IntaSend checkout for premium features like trend exports.

## Features

- Journal entries with AI sentiment analysis (Hugging Face).
- Mood trend charts (Chart.js).
- AI-powered mood recommendations (non-premium feature).
- CRUD operations via Supabase.
- Premium subscription via IntaSend (hosted checkout link) for exporting trends.

## Setup

1. Clone the repository.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set environment variables in a `.env` file (e.g., `SUPABASE_URL`, `SUPABASE_KEY`, `HF_TOKEN`, `INTASEND_SECRET_KEY`, `INTASEND_PUBLISHABLE_KEY`).
4. Run the app: `python app.py`.

## Tech Stack

- Flask (backend framework)
- Supabase (database and auth)
- Hugging Face (sentiment analysis and recommendations)
- Chart.js (data visualization)
- IntaSend (payment processing)

## Monetization Notes

- Utilizes IntaSend `collect.checkout` for secure payment links.
- Collects phone and email for M-Pesa or card payment support.
- Premium feature (trend export) requires a one-time payment of 100 KES.

## Development Process

- Developed by Robert Kibugi
- Email: devrobertkibugi@gmail.com
- GitHub: https://github.com/DevRobIntel
- LinkedIn: https://www.linkedin.com/in/robertkibugi/

## Testing

### Sample Journal Entry

- **Entry Text:** "Today was a productive day! I finally got the Mood Journal app running after resolving the Flask and IntaSend issues. Feeling excited about the hackathon deadline on September 2nd. The sentiment analysis seems to work well—looking forward to seeing my mood trends!"
- **Expected Sentiment Score:** ~0.9 (positive sentiment)
- **Instructions:** Paste this entry text into the app's textarea, submit, and verify the sentiment score on the UI. Check the chart for the updated trend.

### Sample Recommendation Test

- **Setup:** Submit 3-5 entries with varying sentiments (e.g., positive, neutral, negative) using the sample entry or others.
- **Action:** Click the "Get Recommendation" button.
- **Expected Output:**
  - If average sentiment < 0.4: "Your recent moods seem low. Try a short walk or talking to a friend to boost your spirits."
  - If average sentiment > 0.6: "Great job maintaining positive moods! Keep up the good work with journaling."
  - If average sentiment 0.4-0.6: "Your moods are balanced. Consider adding exercise to stabilize them further."
- **Instructions:** Test with different entry combinations to ensure the recommendation adapts to mood trends.

## Deployment

- Deployed on Render - https://mood-journal-v1-3.onrender.com/
