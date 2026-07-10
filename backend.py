#!/usr/bin/env python3
"""
TokenScope Backend API - Real Cost Data Fetcher
Fetches actual costs from AI provider APIs
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json
import requests

app = Flask(__name__)
CORS(app)

# ===== PROVIDER CONFIGURATIONS =====
PROVIDERS = {
    'claude': {
        'name': 'Claude',
        'api_type': 'anthropic',
        'api_key_env': 'ANTHROPIC_API_KEY'
    },
    'openai': {
        'name': 'OpenAI',
        'api_type': 'openai',
        'api_key_env': 'OPENAI_API_KEY'
    },
    'gemini': {
        'name': 'Gemini',
        'api_type': 'google',
        'api_key_env': 'GOOGLE_API_KEY'
    },
    'deepseek': {
        'name': 'DeepSeek',
        'api_type': 'deepseek',
        'api_key_env': 'DEEPSEEK_API_KEY'
    }
}

# ===== MOCK DATA (fallback) =====
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
    ],
    'gemini': [
        {'date': '2026-07-09', 'input_tokens': 5000000, 'output_tokens': 2000000, 'cost': 8.75, 'model': 'gemini-1.5-pro'},
    ],
    'deepseek': [
        {'date': '2026-07-09', 'input_tokens': 10000000, 'output_tokens': 5000000, 'cost': 6.95, 'model': 'deepseek-v3'},
    ]
}

# ===== API INTEGRATIONS =====

def fetch_claude_costs(api_key, days=7):
    """Fetch real cost data from Anthropic"""
    try:
        url = 'https://api.anthropic.com/v1/admin/cost-report'

        headers = {
            'x-api-key': api_key,
            'content-type': 'application/json'
        }

        params = {
            'limit': days,
            'start_date': (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d'),
            'end_date': datetime.now().strftime('%Y-%m-%d')
        }

        r = requests.get(url, headers=headers, params=params, timeout=10)

        if r.status_code == 401:
            return {'error': 'Invalid API key', 'status': 401}
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}', 'status': r.status_code}

        data = r.json()
        costs = []

        if 'data' in data:
            for day in data['data']:
                costs.append({
                    'date': day.get('date'),
                    'input_tokens': day.get('input_tokens', 0),
                    'output_tokens': day.get('output_tokens', 0),
                    'cost': day.get('total_cost', 0),
                    'model': day.get('model', 'unknown')
                })

        return {'costs': costs, 'source': 'live'}

    except Exception as e:
        return {'error': str(e), 'source': 'error'}

def fetch_openai_costs(api_key, days=7):
    """Fetch real cost data from OpenAI"""
    try:
        url = 'https://api.openai.com/v1/dashboard/usage'

        headers = {
            'Authorization': f'Bearer {api_key}',
            'content-type': 'application/json'
        }

        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        end_date = datetime.now().strftime('%Y-%m-%d')

        params = {
            'start_date': start_date,
            'end_date': end_date
        }

        r = requests.get(url, headers=headers, params=params, timeout=10)

        if r.status_code == 401:
            return {'error': 'Invalid API key', 'status': 401}
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}', 'status': r.status_code}

        data = r.json()
        costs = []

        if 'daily_costs' in data:
            for day in data['daily_costs']:
                costs.append({
                    'date': day.get('date'),
                    'input_tokens': day.get('input_tokens', 0),
                    'output_tokens': day.get('output_tokens', 0),
                    'cost': day.get('total_cost', 0),
                    'model': day.get('model', 'unknown')
                })

        return {'costs': costs, 'source': 'live'}

    except Exception as e:
        return {'error': str(e), 'source': 'error'}

def fetch_deepseek_costs(api_key, days=7):
    """Fetch real cost data from DeepSeek"""
    try:
        url = 'https://api.deepseek.com/v1/user/balance'

        headers = {
            'Authorization': f'Bearer {api_key}',
            'content-type': 'application/json'
        }

        r = requests.get(url, headers=headers, timeout=10)

        if r.status_code == 401:
            return {'error': 'Invalid API key', 'status': 401}
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}', 'status': r.status_code}

        data = r.json()
        balance = data.get('balance_usd', 0)

        return {
            'costs': [{
                'date': datetime.now().strftime('%Y-%m-%d'),
                'balance': balance,
                'model': 'deepseek-v3'
            }],
            'source': 'balance_only'
        }

    except Exception as e:
        return {'error': str(e), 'source': 'error'}

def fetch_mistral_costs(api_key, days=7):
    """Fetch real cost data from Mistral"""
    try:
        url = 'https://api.mistral.ai/v1/cost-report'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('costs', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_cohere_costs(api_key, days=7):
    """Fetch real cost data from Cohere"""
    try:
        url = 'https://api.cohere.ai/v1/billing/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_kimi_costs(api_key, days=7):
    """Fetch Moonshot/Kimi costs (OpenAI-compatible)"""
    try:
        url = 'https://platform.moonshot.cn/api/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_qwen_costs(api_key, days=7):
    """Fetch Alibaba Qwen costs"""
    try:
        url = 'https://dashscope.aliyuncs.com/api/cost/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('data', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_glm_costs(api_key, days=7):
    """Fetch Zhipu GLM costs"""
    try:
        url = 'https://open.bigmodel.cn/api/billing/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_minimax_costs(api_key, days=7):
    """Fetch MiniMax costs"""
    try:
        url = 'https://api.minimaxi.com/v1/user/balance'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('balance', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_together_costs(api_key, days=7):
    """Fetch Together AI costs"""
    try:
        url = 'https://www.together.ai/api/billing/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_fireworks_costs(api_key, days=7):
    """Fetch Fireworks costs"""
    try:
        url = 'https://api.fireworks.ai/v1/billing/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_groq_costs(api_key, days=7):
    """Fetch Groq costs"""
    try:
        url = 'https://api.groq.com/v1/billing/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_baseten_costs(api_key, days=7):
    """Fetch Baseten costs"""
    try:
        url = 'https://api.baseten.co/v1/billing/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_cerebras_costs(api_key, days=7):
    """Fetch Cerebras costs"""
    try:
        url = 'https://api.cerebras.ai/v1/billing/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            return {'error': f'API error: {r.status_code}'}
        return {'costs': r.json().get('usage', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}


# ===== ROUTES =====

@app.route('/', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'TokenScope Backend API',
        'version': '1.1',
        'providers': list(PROVIDERS.keys()),
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/providers', methods=['GET'])
def get_providers():
    return jsonify({'providers': PROVIDERS, 'count': len(PROVIDERS)})

@app.route('/api/<provider>/costs', methods=['GET'])
def get_provider_costs(provider):
    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404

    days = request.args.get('days', default=7, type=int)
    api_key = request.args.get('key', default='')

    if days > 120:
        days = 120
    if days < 1:
        days = 1

    result = None
    if api_key:
        if provider == 'claude':
            result = fetch_claude_costs(api_key, days)
        elif provider == 'openai':
            result = fetch_openai_costs(api_key, days)
        elif provider == 'deepseek':
            result = fetch_deepseek_costs(api_key, days)
        elif provider == 'mistral':
            result = fetch_mistral_costs(api_key, days)
        elif provider == 'cohere':
            result = fetch_cohere_costs(api_key, days)
        elif provider == 'kimi':
            result = fetch_kimi_costs(api_key, days)
        elif provider == 'qwen':
            result = fetch_qwen_costs(api_key, days)
        elif provider == 'glm':
            result = fetch_glm_costs(api_key, days)
        elif provider == 'minimax':
            result = fetch_minimax_costs(api_key, days)
        elif provider == 'together':
            result = fetch_together_costs(api_key, days)
        elif provider == 'fireworks':
            result = fetch_fireworks_costs(api_key, days)
        elif provider == 'groq':
            result = fetch_groq_costs(api_key, days)
        elif provider == 'baseten':
            result = fetch_baseten_costs(api_key, days)
        elif provider == 'cerebras':
            result = fetch_cerebras_costs(api_key, days)

    if not result or 'error' in result:
        data = MOCK_COSTS.get(provider, [])
        return jsonify({
            'provider': provider,
            'days_requested': days,
            'days_returned': len(data[:days]),
            'costs': data[:days],
            'status': 'mock_data',
            'note': result.get('error') if result else 'No API key provided',
            'timestamp': datetime.utcnow().isoformat()
        })

    return jsonify({
        'provider': provider,
        'days_requested': days,
        'days_returned': len(result.get('costs', [])),
        'costs': result.get('costs', []),
        'status': result.get('source', 'unknown'),
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/<provider>/validate-key', methods=['POST'])
def validate_key(provider):
    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404

    data = request.get_json()
    key = data.get('key', '')

    if not key:
        return jsonify({'valid': False, 'error': 'No key provided'}), 400

    result = None
    if provider == 'claude':
        result = fetch_claude_costs(key, 1)
    elif provider == 'openai':
        result = fetch_openai_costs(key, 1)
    elif provider == 'deepseek':
        result = fetch_deepseek_costs(key, 1)

    if result and 'error' not in result:
        return jsonify({'valid': True, 'provider': provider})
    else:
        return jsonify({
            'valid': False,
            'error': result.get('error') if result else 'Unknown error'
        }), 401


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'status': 404}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'status': 500}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("TokenScope Backend API v1.1 - Real API Integration")
    print("=" * 60)
    print(f"Starting server on http://localhost:5000")
    print(f"\nAvailable providers: {', '.join(PROVIDERS.keys())}")
    print(f"\nTo fetch REAL data, pass API keys:")
    print(f"  GET /api/claude/costs?key=YOUR_ANTHROPIC_KEY")
    print(f"  GET /api/openai/costs?key=YOUR_OPENAI_KEY")
    print(f"  GET /api/deepseek/costs?key=YOUR_DEEPSEEK_KEY")
    print(f"\nDefault: Returns mock data (for testing)")
    print("=" * 60)
    app.run(debug=True, host='127.0.0.1', port=5000)
