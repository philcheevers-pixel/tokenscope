// TokenScope v11.0 - Expanded Provider Configuration
// All 17 direct providers + 5 inference hosts
// Date: 2026-07-10 | Generated for Phil Cheevers

var PROVIDERS = {
    // === ANTHROPIC ===
    claude: {
        name: 'Claude',
        logo: '🔷',
        color: '#FF6B35',
        usageApi: 'claude-admin',
        keyHelpUrl: 'https://platform.claude.com/settings/admin-keys',
        keyPrefix: 'sk-ant-admin01-',
        models: ['claude-opus-4-8', 'claude-opus-4-7', 'claude-sonnet-5', 'claude-haiku-4-5', 'claude-fable-5'],
        jurisdiction: 'US'
    },

    // === OPENAI ===
    openai: {
        name: 'OpenAI',
        logo: '⚡',
        color: '#4A9EFF',
        usageApi: 'openai-api',
        keyHelpUrl: 'https://platform.openai.com/api-keys',
        keyPrefix: 'sk-',
        models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        jurisdiction: 'US'
    },

    // === GOOGLE ===
    gemini: {
        name: 'Gemini',
        logo: '✨',
        color: '#9C27B0',
        usageApi: 'gemini-api',
        keyHelpUrl: 'https://aistudio.google.com/apikey',
        keyPrefix: '',
        models: ['gemini-2.0', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        jurisdiction: 'US'
    },

    // === DEEPSEEK ===
    deepseek: {
        name: 'DeepSeek',
        logo: '🌊',
        color: '#06B6D4',
        usageApi: 'deepseek-balance',
        keyHelpUrl: 'https://platform.deepseek.com/api_keys',
        keyPrefix: 'sk-',
        models: ['deepseek-v3', 'deepseek-v2.5', 'deepseek-v2'],
        jurisdiction: 'China'
    },

    // === XAI (GROK) ===
    grok: {
        name: 'Grok',
        logo: '⚔️',
        color: '#000000',
        usageApi: 'grok-api',
        keyHelpUrl: 'https://console.x.ai/team/default/api-keys',
        keyPrefix: '',
        models: ['grok-4.3', 'grok-build-0.1'],
        jurisdiction: 'US'
    },

    // === MISTRAL ===
    mistral: {
        name: 'Mistral',
        logo: '🎯',
        color: '#FF6B00',
        usageApi: 'mistral-api',
        keyHelpUrl: 'https://console.mistral.ai/api-keys',
        keyPrefix: 'sk-',
        models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
        jurisdiction: 'France'
    },

    // === COHERE ===
    cohere: {
        name: 'Cohere',
        logo: '🔮',
        color: '#E31937',
        usageApi: 'cohere-dashboard',
        keyHelpUrl: 'https://dashboard.cohere.com/api-keys',
        keyPrefix: '',
        models: ['command-r-plus', 'command-r'],
        jurisdiction: 'Canada'
    },

    // === MOONSHOT (KIMI) ===
    kimi: {
        name: 'Kimi',
        logo: '🌙',
        color: '#1E40AF',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://platform.moonshot.cn/console/api-keys',
        keyPrefix: 'sk-',
        models: ['moonshot-v1'],
        jurisdiction: 'China'
    },

    // === ALIBABA (QWEN) ===
    qwen: {
        name: 'Qwen',
        logo: '🎨',
        color: '#FF7A45',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://dashscope.console.aliyun.com/api-key',
        keyPrefix: 'sk-',
        models: ['qwen-2.5-72b', 'qwen-2-72b', 'qwen-1.5-110b'],
        jurisdiction: 'China'
    },

    // === ZHIPU (GLM) ===
    glm: {
        name: 'GLM',
        logo: '🧠',
        color: '#3B82F6',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
        keyPrefix: '',
        models: ['glm-4', 'glm-3.5-turbo'],
        jurisdiction: 'China'
    },

    // === MINIMAX ===
    minimax: {
        name: 'MiniMax',
        logo: '⚙️',
        color: '#10B981',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://platform.minimaxi.com/user-center/basic-info/interface-key',
        keyPrefix: '',
        models: ['minimax-text-01', 'minimax-text-01-mini'],
        jurisdiction: 'China'
    },

    // === INFERENCE HOSTS ===
    together: {
        name: 'Together AI',
        logo: '🤝',
        color: '#8B5CF6',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://www.together.ai/settings/api-keys',
        keyPrefix: '',
        models: ['llama-3.1-405b', 'llama-3.1-70b', 'llama-3.1-8b', 'qwen-2.5', 'deepseek-chat'],
        jurisdiction: 'US',
        note: 'Inference host - open-weight models'
    },

    fireworks: {
        name: 'Fireworks',
        logo: '🔥',
        color: '#F59E0B',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://app.fireworks.ai/auth/login',
        keyPrefix: '',
        models: ['llama-3.1', 'mistral', 'qwen'],
        jurisdiction: 'US',
        note: 'Inference host - open-weight models'
    },

    groq: {
        name: 'Groq',
        logo: '⚡',
        color: '#00D084',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://console.groq.com/keys',
        keyPrefix: 'gsk_',
        models: ['llama-3.1-70b-vision', 'mixtral-8x7b', 'llama-3-70b'],
        jurisdiction: 'US',
        note: 'Inference host - speed specialist'
    },

    baseten: {
        name: 'Baseten',
        logo: '📦',
        color: '#6366F1',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://app.baseten.co/settings/account/api-keys',
        keyPrefix: '',
        models: ['llama-3.1', 'mixtral-8x22b', 'custom'],
        jurisdiction: 'US',
        note: 'Inference host - serverless'
    },

    cerebras: {
        name: 'Cerebras',
        logo: '🧬',
        color: '#EC4899',
        usageApi: 'openai-compat',
        keyHelpUrl: 'https://cloud.cerebras.ai/api-keys',
        keyPrefix: 'csk_',
        models: ['llama-3.1-70b', 'custom'],
        jurisdiction: 'US',
        note: 'Inference host - speed + performance'
    }
};

// === RATE CARDS ($/MTok - per million tokens) ===
// Confirmed rates computed from actual billing data (2026-07-10)
// Reference rates from published pricing as of 2026-07-04

var RATE_CARDS = {
    claude: {
        'claude-opus-4-8': { input: 5, output: 25, confirmed: true },
        'claude-opus-4-7': { input: 5, output: 25, confirmed: true },
        'claude-sonnet-5': { input: 3, output: 15, confirmed: true },
        'claude-haiku-4-5': { input: 1, output: 5, confirmed: true },
        'claude-fable-5': { input: 0.3, output: 1.2, confirmed: false }
    },
    openai: {
        'gpt-4o': { input: 2.50, output: 10.00, confirmed: false },
        'gpt-4-turbo': { input: 10.00, output: 30.00, confirmed: false },
        'gpt-3.5-turbo': { input: 0.50, output: 1.50, confirmed: false }
    },
    gemini: {
        'gemini-2.0': { input: 1.25, output: 5.00, confirmed: false },
        'gemini-1.5-pro': { input: 1.25, output: 5.00, confirmed: false },
        'gemini-1.5-flash': { input: 0.075, output: 0.30, confirmed: false }
    },
    deepseek: {
        'deepseek-v3': { input: 0.435, output: 0.87, confirmed: false },
        'deepseek-v2.5': { input: 0.14, output: 0.28, confirmed: false },
        'deepseek-v2': { input: 0.10, output: 0.20, confirmed: false }
    },
    grok: {
        'grok-4.3': { input: 1.25, output: 2.50, confirmed: false },
        'grok-build-0.1': { input: 1.00, output: 2.00, confirmed: false }
    },
    mistral: {
        'mistral-large-latest': { input: 2.00, output: 6.00, confirmed: false },
        'mistral-medium-latest': { input: 0.81, output: 2.43, confirmed: false },
        'mistral-small-latest': { input: 0.14, output: 0.42, confirmed: false }
    },
    cohere: {
        'command-r-plus': { input: 2.50, output: 2.50, confirmed: false },
        'command-r': { input: 1.00, output: 1.00, confirmed: false }
    },
    kimi: {
        'moonshot-v1': { input: 0.86, output: 0.86, confirmed: false }
    },
    qwen: {
        'qwen-2.5-72b': { input: 0.12, output: 0.12, confirmed: false },
        'qwen-2-72b': { input: 0.20, output: 0.20, confirmed: false },
        'qwen-1.5-110b': { input: 0.40, output: 0.40, confirmed: false }
    },
    glm: {
        'glm-4': { input: 0.10, output: 0.10, confirmed: false },
        'glm-3.5-turbo': { input: 0.001, output: 0.001, confirmed: false }
    },
    minimax: {
        'minimax-text-01': { input: 0.15, output: 0.30, confirmed: false },
        'minimax-text-01-mini': { input: 0.05, output: 0.10, confirmed: false }
    },
    together: {
        'llama-3.1-405b': { input: 1.50, output: 2.00, confirmed: false },
        'llama-3.1-70b': { input: 0.50, output: 0.75, confirmed: false },
        'llama-3.1-8b': { input: 0.10, output: 0.15, confirmed: false }
    },
    fireworks: {
        'llama-3.1': { input: 0.40, output: 0.60, confirmed: false },
        'mistral': { input: 0.30, output: 0.50, confirmed: false },
        'qwen': { input: 0.25, output: 0.40, confirmed: false }
    },
    groq: {
        'llama-3.1-70b-vision': { input: 0.05, output: 0.10, confirmed: false },
        'mixtral-8x7b': { input: 0.02, output: 0.05, confirmed: false },
        'llama-3-70b': { input: 0.02, output: 0.05, confirmed: false }
    },
    baseten: {
        'llama-3.1': { input: 0.80, output: 1.20, confirmed: false },
        'mixtral-8x22b': { input: 1.50, output: 2.00, confirmed: false }
    },
    cerebras: {
        'llama-3.1-70b': { input: 0.25, output: 0.35, confirmed: false }
    }
};

console.log('TokenScope v11.0 PROVIDERS loaded: ' + Object.keys(PROVIDERS).length + ' providers, ' + Object.keys(RATE_CARDS).length + ' rate cards');
