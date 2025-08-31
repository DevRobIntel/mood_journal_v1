# Mood Journal: AI-Powered Emotion Tracker

## Overview

A web app for journaling, AI sentiment analysis, and mood trends. SDG 3 aligned. Monetized with IntaSend checkout for premium.

## Features

- Journal entries with AI analysis (Hugging Face).
- Mood trend charts (Chart.js).
- CRUD via Supabase.
- Premium subscription via IntaSend (hosted checkout link).

## Setup

1. Clone repo.
2. `pip install -r requirements.txt`
3. Set .env vars.
4. Run `python app.py`

## Tech Stack

- Flask, Supabase, Hugging Face, Chart.js, IntaSend.

## Monetization Notes

- Uses IntaSend collect.checkout for secure payment links.
- Collects phone/email for M-Pesa/Card support.
- In prod: Handle webhooks for confirmation.

## Development Process

- [Add team details]

## Testing

### Sample Journal Entry

- **Date:** August 31, 2025
- **Time:** 01:20 PM EAT
- **Entry Text:** "Today was a productive day! I finally got the Mood Journal app running after resolving the Flask and IntaSend issues. Feeling excited about the hackathon deadline on September 2nd. The sentiment analysis seems to work well—looking forward to seeing my mood trends!"
- **Expected Sentiment Score:** ~0.9 (positive sentiment)
- **Instructions:** Paste this entry into the app's textarea and submit to verify functionality. Check the chart for the sentiment score.

For enhancements: Add user auth, payment status polling.
