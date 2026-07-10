#!/usr/bin/env python3
"""
TokenScope Backend API - Cost Data Fetcher
Fetches real costs from AI provider APIs and serves to frontend
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json

app = Flask(__name__)
CORS(app)

# ===== PROVIDER CONFIGURATIONS =====
PROVIDERS = {
    'claude': {
        'name': 'Claude',
        'api_type': 'anthropic',
        'requires_key': True,
        'key_env': 'ANTHROPIC_API_KEY'
    },
    'openai': {
        'name': 'OpenAI',
        'api_type': 'openai',
        'requires_key': True,
        'key_env': 'OPENAI_API_KEY'
    },
    'gemini': {
        'name': 'Gemini',
        'api_type': 'google',
        'requires_key': True,
        'key_env': 'GOOGLE_API_KEY'
    },
    'deepseek': {
        'name': 'DeepSeek',
        'api_type': 'deepseek',
        'requires_key': True,
        'key_env': 'DEEPSEEK_API_KEY'
    }
}

# ===== MOCK DATA (for testing) =====
MOCK_COSTS = {
    'claude': [
        {'date': '2026-07-09', 'input_tokens': 1500000, 'output_tokens': 500000, 'cost': 12.50, 'model': 'claude-opus-4-8'},
        {'date': '2026-07-08', 'input_tokens': 800000, 'output_tokens': 200000, 'cost': 5.50, 'model': 'claude-sonnet-5'},
        {'date': '2026-07-07', 'input_tokens': 600000, 'output_tokens': 150000, 'cost': 3.90, 'model': 'claude-sonnet-5'},
        {'date': '2026-07-06', 'input_tokens': 1200000, 'output_tokens': 400000, 'cost': 10.20, 'model': 'claude-opus-4-8'},
    ],
    'openai': [
        {'date': '2026-07-09', 'input_tokens': 2000000, 'output_tokens': 1000000, 'cost': 25.00, 'model': 'gpt-4o'},
        {'date': '2026-07-08', 'input_tokens': 1500000, 'output_tokens': 500000, 'cost': 17.50, 'model': 'gpt-4-turbo'},
        {'date': '2026-07-07', 'input_tokens': 1000000, 'output_tokens': 300000, 'cost': 10.00, 'model': 'gpt-4-turbo'},
    ],
    'gemini': [
        {'date': '2026-07-09', 'input_tokens': 5000000, 'output_tokens': 2000000, 'cost': 8.75, 'model': 'gemini-1.5-pro'},
        {'date': '2026-07-08', 'input_tokens': 3000000, 'output_tokens': 1000000, 'cost': 5.00, 'model': 'gemini-1.5-flash'},
    ],
    'deepseek': [
        {'date': '2026-07-09', 'input_tokens': 10000000, 'output_tokens': 5000000, 'cost': 6.95, 'model': 'deepseek-v3'},
        {'date': '2026-07-08', 'input_tokens': 5000000, 'output_tokens': 2000000, 'cost': 3.48, 'model': 'deepseek-v2.5'},
    ]
}

# ===== ROUTES =====

@app.route('/', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'ok',
        'service': 'TokenScope Backend API',
        'version': '1.0',
        'providers': list(PROVIDERS.keys()),
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/providers', methods=['GET'])
def get_providers():
    """List all available providers"""
    return jsonify({
        'providers': PROVIDERS,
        'count': len(PROVIDERS)
    })

@app.route('/api/<provider>/costs', methods=['GET'])
def get_provider_costs(provider):
    """
    Get cost history for a provider
    Query params:
    - days: number of days to return (default: 7, max: 120)
    - from_date: start date (YYYY-MM-DD)
    """

    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404

    days = request.args.get('days', default=7, type=int)
    if days > 120:
        days = 120
    if days < 1:
        days = 1

    # Get mock data (TODO: replace with real API calls)
    data = MOCK_COSTS.get(provider, [])

    # Return requested number of days
    return jsonify({
        'provider': provider,
        'days_requested': days,
        'days_returned': len(data[:days]),
        'costs': data[:days],
        'status': 'mock_data',  # TODO: change to 'live' when real APIs wired
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/<provider>/balance', methods=['GET'])
def get_provider_balance(provider):
    """Get current balance/credit for a provider"""

    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404

    # TODO: Implement real balance fetching from provider APIs
    return jsonify({
        'provider': provider,
        'balance': 0.00,
        'status': 'not_implemented',
        'message': 'Real balance fetching coming soon'
    }), 501

@app.route('/api/<provider>/validate-key', methods=['POST'])
def validate_key(provider):
    """Validate an API key for a provider (optional - for test connectivity)"""

    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404

    data = request.get_json()
    key = data.get('key', '')

    if not key:
        return jsonify({'valid': False, 'error': 'No key provided'}), 400

    # TODO: Implement real key validation
    return jsonify({
        'provider': provider,
        'valid': True,  # Fake validation
        'status': 'mock_validation',
        'message': 'Real key validation coming soon'
    })

@app.route('/api/<provider>/backfill', methods=['POST'])
def backfill_history(provider):
    """
    Trigger 120-day backfill for a provider
    Requires API key in request body
    """

    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404

    data = request.get_json()
    key = data.get('key', '')

    if not key:
        return jsonify({'error': 'API key required for backfill'}), 400

    # TODO: Implement real backfill logic
    # This would:
    # 1. Use the API key to connect to provider
    # 2. Fetch last 120 days of costs
    # 3. Store in database
    # 4. Return progress

    return jsonify({
        'provider': provider,
        'status': 'queued',
        'message': 'Backfill job queued (real implementation coming soon)',
        'estimated_duration_seconds': 300
    }), 202

# ===== ERROR HANDLERS =====

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'status': 404}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'status': 500}), 500

# ===== MAIN =====

if __name__ == '__main__':
    print("=" * 60)
    print("TokenScope Backend API")
    print("=" * 60)
    print(f"Starting server on http://localhost:5000")
    print(f"Available providers: {', '.join(PROVIDERS.keys())}")
    print(f"\nEndpoints:")
    print(f"  GET  /                          - Health check")
    print(f"  GET  /api/providers             - List providers")
    print(f"  GET  /api/<provider>/costs      - Get cost history")
    print(f"  GET  /api/<provider>/balance    - Get account balance")
    print(f"  POST /api/<provider>/validate-key - Test API key")
    print(f"  POST /api/<provider>/backfill   - Trigger 120-day backfill")
    print("=" * 60)
    app.run(debug=True, host='127.0.0.1', port=5000)
