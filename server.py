# TokenScope Proxy Server - AI Provider API Integration
# Purpose: Relay cost/usage queries to multiple AI providers from browser (no direct exposure of API keys)
#
# PROVIDER API DOCUMENTATION:
#
# === CLAUDE (Anthropic) ===
# Base URL: https://api.anthropic.com/v1
# Cost Report: /organizations/cost_report (group_by: description)
# Usage Report: /organizations/usage_report/messages (group_by: model)
# Auth: Header 'x-api-key' (Admin key only, format: sk-ant-admin01-...)
# Requires: Admin API key (org admin only)
# Response: {data: [{starting_at, ending_at, results: [{description/model, amount, token_type}]}]}
#
# === OPENAI (Future) ===
# Base URL: https://api.openai.com/v1
# Cost/Usage: May use /organization/billing/usage (deprecated) or dashboard API
# Auth: Header 'Authorization: Bearer' (format: sk-...)
# Models: gpt-4o, gpt-4-turbo, gpt-4o-mini, gpt-3.5-turbo
# Note: No direct cost report API; costs available via usage + rate lookup
#
# === DEEPSEEK ===
# Base URL: https://api.deepseek.com/v1 (OpenAI-compatible)
# Balance endpoint: GET /user/balance (shows remaining credit, not granular usage)
# Auth: Header 'Authorization: Bearer' (format: sk-...)
# Models: deepseek-v4-pro ($0.435/$0.87), deepseek-v4-flash ($0.14/$0.28)
# Deprecated: deepseek-chat, deepseek-reasoner (ending 2026-07-24)
# Pricing source: api-docs.deepseek.com/quick_start/pricing
# IMPORTANT: Peak/off-peak pricing effective mid-July 2026 (2x during peak hours: 9-12, 14-18 Beijing time)
# NOTE: No detailed cost report API; only balance check available. Usage must be tracked via rate card + manual logging or empirical rate calculation.
#
# === GEMINI/GOOGLE (Future) ===
# Base URL: https://generativelanguage.googleapis.com/v1beta
# Cost/Usage: Via Firebase/GCP Console (not API-exposed)
# Auth: Query param 'key' or Bearer token
# Models: gemini-2.5-pro, gemini-2.5-flash, gemini-1.5-pro, gemini-1.5-flash
# Note: No direct usage API; requires GCP billing integration
#
# === MISTRAL ===
# Base URL: https://api.mistral.ai/v1
# Cost/Usage: No API endpoint; dashboard-only at console.mistral.ai
# Auth: Header 'Authorization: Bearer' (format: sk-...)
# Models: mistral-large-latest ($2/$6), mistral-medium-latest ($0.81/$2.43), mistral-small-latest ($0.14/$0.42)
# Rate limits/tiers: docs.mistral.ai/admin/user-management-finops/tier
# Billing: docs.mistral.ai/admin/user-management-finops/billing
# NOTE: No detailed cost API. Usage tracked via rate card + empirical calculation from actual spend.
#
# === GROK/xAI (Future) ===
# Base URL: https://api.x.ai/v1
# Cost/Usage: No published cost API; estimated from usage + rate card
# Auth: Header 'Authorization: Bearer' (no prefix)
# API Keys: console.x.ai/team/default/api-keys
# Models: grok-4.3 ($1.25/$2.50), grok-build-0.1 ($1.00/$2.00)
# Endpoint: /chat/completions (OpenAI-compatible)
# Note: Rate limits scale with spend tiers
#
# === COHERE ===
# Base URL: https://api.cohere.ai/v1 (pay-as-you-go + enterprise plans)
# Cost/Usage: No API endpoint; dashboard-only at dashboard.cohere.com/billing
# Auth: Header 'Authorization: Bearer' (no prefix requirement)
# API key: dashboard.cohere.com/api-keys
# Endpoints: /generate, /embed, /classify, /summarize, /converse, /rerank, /tokenize, /detokenize
# Pricing: Per-token for generation/embedding, per-request for classification/summarization/reranking
# Models: Command ($2.50/M tokens), Command-Light ($0.80/M), Embed-English-v3.0 ($0.10/M)
# Pricing page: https://cohere.com/pricing (includes downloadable rate card PDF)
# API docs: https://docs.cohere.ai/reference
# NOTE: No direct cost report API. Usage must be tracked via dashboard or per-request counting.

import sys
import os
import json
import socketserver
import http.server
import urllib.request
import urllib.error
import urllib.parse

PORT = int(os.environ.get('PORT')) if os.environ.get('PORT') else (int(sys.argv[1]) if len(sys.argv) > 1 else 8723)
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
COST_REPORT_URL = 'https://api.anthropic.com/v1/organizations/cost_report'
USAGE_REPORT_URL = 'https://api.anthropic.com/v1/organizations/usage_report/messages'


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

    def _relay(self, status, body_bytes):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body_bytes)))
        self.end_headers()
        self.wfile.write(body_bytes)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/claude/cost-report':
            return self._proxy_report(COST_REPORT_URL, 'description')
        if self.path == '/api/claude/usage-report':
            return self._proxy_report(USAGE_REPORT_URL, 'model')
        if self.path == '/api/openai/usage':
            return self._openai_usage()
        if self.path == '/api/openai/cost':
            return self._openai_cost()
        if self.path == '/api/deepseek/balance':
            return self._deepseek_balance()
        if self.path == '/api/gemini/usage':
            return self._gemini_usage()
        if self.path == '/api/mistral/usage':
            return self._mistral_usage()
        if self.path == '/api/grok/usage':
            return self._grok_usage()
        if self.path == '/api/cohere/usage':
            return self._cohere_usage()
        return self._send_json(404, {'error': 'not found'})

    def _proxy_report(self, base_url, group_by_value):
        length = int(self.headers.get('Content-Length', 0))
        try:
            req_body = json.loads(self.rfile.read(length) or b'{}')
        except json.JSONDecodeError:
            return self._send_json(400, {'error': 'invalid json body'})

        api_key = req_body.get('apiKey')
        starting_at = req_body.get('startingAt')
        ending_at = req_body.get('endingAt')
        page = req_body.get('page')

        if not api_key or not starting_at:
            return self._send_json(400, {'error': 'apiKey and startingAt are required'})

        params = [
            ('starting_at', starting_at),
            ('group_by[]', group_by_value),
            ('bucket_width', '1d'),
        ]
        if ending_at:
            params.append(('ending_at', ending_at))
        if page:
            params.append(('page', page))
        url = base_url + '?' + urllib.parse.urlencode(params)

        upstream_req = urllib.request.Request(url, headers={
            'anthropic-version': '2023-06-01',
            'x-api-key': api_key,
        })
        try:
            with urllib.request.urlopen(upstream_req, timeout=30) as resp:
                self._relay(resp.status, resp.read())
        except urllib.error.HTTPError as e:
            self._relay(e.code, e.read())
        except Exception as e:
            self._send_json(502, {'error': 'proxy request failed: ' + str(e)})

    def _openai_usage(self):
        length = int(self.headers.get('Content-Length', 0))
        try:
            req_body = json.loads(self.rfile.read(length) or b'{}')
        except json.JSONDecodeError:
            return self._send_json(400, {'error': 'invalid json body'})

        api_key = req_body.get('apiKey')
        start_date = req_body.get('startDate')
        end_date = req_body.get('endDate')

        if not api_key or not start_date:
            return self._send_json(400, {'error': 'apiKey and startDate are required'})

        url = 'https://api.openai.com/v1/organization/billing/usage'
        params = [('start_date', start_date)]
        if end_date:
            params.append(('end_date', end_date))
        url = url + '?' + urllib.parse.urlencode(params)

        upstream_req = urllib.request.Request(url, headers={
            'Authorization': 'Bearer ' + api_key,
        })
        try:
            with urllib.request.urlopen(upstream_req, timeout=30) as resp:
                self._relay(resp.status, resp.read())
        except urllib.error.HTTPError as e:
            self._relay(e.code, e.read())
        except Exception as e:
            self._send_json(502, {'error': 'OpenAI proxy failed: ' + str(e)})

    def _openai_cost(self):
        length = int(self.headers.get('Content-Length', 0))
        try:
            req_body = json.loads(self.rfile.read(length) or b'{}')
        except json.JSONDecodeError:
            return self._send_json(400, {'error': 'invalid json body'})

        api_key = req_body.get('apiKey')
        start_date = req_body.get('startDate')
        end_date = req_body.get('endDate')

        if not api_key or not start_date:
            return self._send_json(400, {'error': 'apiKey and startDate are required'})

        url = 'https://api.openai.com/v1/organization/billing/overview'
        params = [('start_date', start_date)]
        if end_date:
            params.append(('end_date', end_date))
        url = url + '?' + urllib.parse.urlencode(params)

        upstream_req = urllib.request.Request(url, headers={
            'Authorization': 'Bearer ' + api_key,
        })
        try:
            with urllib.request.urlopen(upstream_req, timeout=30) as resp:
                self._relay(resp.status, resp.read())
        except urllib.error.HTTPError as e:
            self._relay(e.code, e.read())
        except Exception as e:
            self._send_json(502, {'error': 'OpenAI proxy failed: ' + str(e)})

    def _deepseek_balance(self):
        length = int(self.headers.get('Content-Length', 0))
        try:
            req_body = json.loads(self.rfile.read(length) or b'{}')
        except json.JSONDecodeError:
            return self._send_json(400, {'error': 'invalid json body'})

        api_key = req_body.get('apiKey')
        if not api_key:
            return self._send_json(400, {'error': 'apiKey is required'})

        url = 'https://api.deepseek.com/user/balance'
        upstream_req = urllib.request.Request(url, headers={
            'Authorization': 'Bearer ' + api_key,
        })
        try:
            with urllib.request.urlopen(upstream_req, timeout=30) as resp:
                self._relay(resp.status, resp.read())
        except urllib.error.HTTPError as e:
            self._relay(e.code, e.read())
        except Exception as e:
            self._send_json(502, {'error': 'DeepSeek proxy failed: ' + str(e)})

    def _gemini_usage(self):
        return self._send_json(501, {'error': 'Gemini usage requires GCP Cloud Billing integration (not yet implemented)'})

    def _mistral_usage(self):
        return self._send_json(501, {'error': 'Mistral usage API not available (dashboard-only at console.mistral.ai)'})

    def _grok_usage(self):
        return self._send_json(501, {'error': 'Grok usage API not yet published (rate card available)'})

    def _cohere_usage(self):
        return self._send_json(501, {'error': 'Cohere usage API not available (dashboard-only at dashboard.cohere.com)'})



class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == '__main__':
    with Server(('127.0.0.1', PORT), Handler) as httpd:
        print('TokenScope server running at http://127.0.0.1:' + str(PORT))
        httpd.serve_forever()
