#!/usr/bin/env python3
"""
TokenScope Backend API - Real Cost Data Fetcher
All 16 providers with verified API key URLs
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json
import requests

app = Flask(__name__)
CORS(app)

# ===== PROVIDER CONFIGURATIONS - ALL 16 WITH VERIFIED KEY URLS =====
PROVIDERS = {
    'claude': {'name': 'Claude', 'key_url': 'https://console.anthropic.com/settings/admin-keys'},
    'openai': {'name': 'OpenAI', 'key_url': 'https://platform.openai.com/account/api-keys'},
    'gemini': {'name': 'Gemini', 'key_url': 'https://console.cloud.google.com/apis/credentials'},
    'deepseek': {'name': 'DeepSeek', 'key_url': 'https://platform.deepseek.com/api_keys'},
    'grok': {'name': 'Grok', 'key_url': 'https://console.x.ai/'},
    'mistral': {'name': 'Mistral', 'key_url': 'https://console.mistral.ai/api-keys'},
    'cohere': {'name': 'Cohere', 'key_url': 'https://dashboard.cohere.com/api-keys'},
    'kimi': {'name': 'Kimi', 'key_url': 'https://platform.moonshot.cn/console/api-keys'},
    'qwen': {'name': 'Qwen', 'key_url': 'https://dashscope.console.aliyun.com/api-keys'},
    'glm': {'name': 'GLM', 'key_url': 'https://open.bigmodel.cn/usercenter/apikeys'},
    'minimax': {'name': 'MiniMax', 'key_url': 'https://platform.minimaxi.com/user-center/basic-info/interface-key'},
    'together': {'name': 'Together AI', 'key_url': 'https://www.together.ai/settings/api-keys'},
    'fireworks': {'name': 'Fireworks', 'key_url': 'https://app.fireworks.ai/settings/account'},
    'groq': {'name': 'Groq', 'key_url': 'https://console.groq.com/keys'},
    'baseten': {'name': 'Baseten', 'key_url': 'https://app.baseten.co/settings/account/api-keys'},
    'cerebras': {'name': 'Cerebras', 'key_url': 'https://cloud.cerebras.ai/api-keys'}
}

# ===== RATE CARDS =====
RATE_CARDS = {
    'claude': {'claude-opus-4-8': {'input': 5, 'output': 25}, 'claude-sonnet-5': {'input': 3, 'output': 15}},
    'openai': {'gpt-4o': {'input': 2.5, 'output': 10}, 'gpt-4-turbo': {'input': 10, 'output': 30}},
    'gemini': {'gemini-2.0': {'input': 1.25, 'output': 5}, 'gemini-1.5-pro': {'input': 1.25, 'output': 5}},
    'deepseek': {'deepseek-v3': {'input': 0.435, 'output': 0.87}, 'deepseek-v2.5': {'input': 0.14, 'output': 0.28}},
    'grok': {'grok-4.3': {'input': 1.25, 'output': 2.5}},
    'mistral': {'mistral-large': {'input': 2, 'output': 6}},
    'cohere': {'command-r-plus': {'input': 2.5, 'output': 2.5}},
    'kimi': {'moonshot-v1': {'input': 0.86, 'output': 0.86}},
    'qwen': {'qwen-2.5': {'input': 0.12, 'output': 0.12}},
    'glm': {'glm-4': {'input': 0.1, 'output': 0.1}},
    'minimax': {'minimax-text-01': {'input': 0.15, 'output': 0.3}},
    'together': {'llama-3.1': {'input': 0.5, 'output': 0.75}},
    'fireworks': {'llama-3.1': {'input': 0.4, 'output': 0.6}},
    'groq': {'llama-3.1-70b': {'input': 0.05, 'output': 0.1}},
    'baseten': {'llama-3.1': {'input': 0.8, 'output': 1.2}},
    'cerebras': {'llama-3.1': {'input': 0.25, 'output': 0.35}}
}

# ===== MOCK DATA (fallback when API unavailable) =====
MOCK_COSTS = {
    'claude': [{'date': '2026-07-09', 'input_tokens': 1500000, 'output_tokens': 500000, 'cost': 12.50, 'model': 'claude-opus-4-8'}],
    'openai': [{'date': '2026-07-09', 'input_tokens': 2000000, 'output_tokens': 1000000, 'cost': 25.00, 'model': 'gpt-4o'}],
    'deepseek': [{'date': '2026-07-09', 'input_tokens': 10000000, 'output_tokens': 5000000, 'cost': 6.95, 'model': 'deepseek-v3'}],
}

# ===== REAL API INTEGRATIONS =====

def fetch_claude_costs(api_key, days=7):
    try:
        url = 'https://api.anthropic.com/v1/admin/cost-report'
        headers = {'x-api-key': api_key}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code == 401:
            return {'error': 'Invalid Claude API key'}
        if r.status_code != 200:
            return {'error': f'Claude API error: {r.status_code}'}
        data = r.json()
        return {'costs': data.get('data', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_openai_costs(api_key, days=7):
    try:
        url = 'https://api.openai.com/v1/dashboard/usage'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code == 401:
            return {'error': 'Invalid OpenAI API key'}
        if r.status_code != 200:
            return {'error': f'OpenAI API error: {r.status_code}'}
        return {'costs': r.json().get('daily_costs', []), 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

def fetch_deepseek_costs(api_key, days=7):
    try:
        url = 'https://api.deepseek.com/v1/user/balance'
        headers = {'Authorization': f'Bearer {api_key}'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code == 401:
            return {'error': 'Invalid DeepSeek API key'}
        if r.status_code != 200:
            return {'error': f'DeepSeek API error: {r.status_code}'}
        return {'costs': [r.json()], 'source': 'live'}
    except Exception as e:
        return {'error': str(e)}

# ===== ROUTES =====

@app.route('/', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'TokenScope Backend',
        'providers': list(PROVIDERS.keys()),
        'provider_count': len(PROVIDERS)
    })

@app.route('/api/providers', methods=['GET'])
def get_providers():
    return jsonify({'providers': PROVIDERS, 'count': len(PROVIDERS)})

@app.route('/api/<provider>/costs', methods=['GET'])
def get_costs(provider):
    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404

    api_key = request.args.get('key', '')
    days = request.args.get('days', 7, type=int)

    result = None
    if api_key:
        if provider == 'claude':
            result = fetch_claude_costs(api_key, days)
        elif provider == 'openai':
            result = fetch_openai_costs(api_key, days)
        elif provider == 'deepseek':
            result = fetch_deepseek_costs(api_key, days)

    if not result or 'error' in result:
        data = MOCK_COSTS.get(provider, [])
        return jsonify({
            'provider': provider,
            'costs': data,
            'status': 'fallback',
            'note': result.get('error') if result else 'No API key provided'
        })

    return jsonify({
        'provider': provider,
        'costs': result.get('costs', []),
        'status': 'live'
    })

@app.route('/api/<provider>/key-url', methods=['GET'])
def get_key_url(provider):
    if provider not in PROVIDERS:
        return jsonify({'error': f'Provider {provider} not found'}), 404
    return jsonify({
        'provider': provider,
        'name': PROVIDERS[provider]['name'],
        'key_url': PROVIDERS[provider]['key_url']
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    print("TokenScope Backend API")
    print(f"Providers: {len(PROVIDERS)}")
    for p in sorted(PROVIDERS.keys()):
        print(f"  - {PROVIDERS[p]['name']}: {PROVIDERS[p]['key_url']}")
    app.run(debug=True, host='127.0.0.1', port=5000)
