/**
 * TokenScope IndexedDB Schema & Utilities
 * Local database for 120-day cost history
 */

const DB_NAME = 'TokenScope';
const DB_VERSION = 1;

// Store names
const STORES = {
    costs: 'costs',           // Daily costs: {provider, date, model, input_tokens, output_tokens, cost}
    health: 'health',         // Health signals: {provider, date, io_ratio, model_shift, sycophancy}
    metadata: 'metadata'      // Metadata: {key, value, timestamp}
};

class TokenScopeDB {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Costs store
                if (!db.objectStoreNames.contains(STORES.costs)) {
                    const costsStore = db.createObjectStore(STORES.costs, { keyPath: 'id', autoIncrement: true });
                    costsStore.createIndex('provider_date', ['provider', 'date'], { unique: true });
                    costsStore.createIndex('provider', 'provider', { unique: false });
                    costsStore.createIndex('date', 'date', { unique: false });
                }

                // Health signals store
                if (!db.objectStoreNames.contains(STORES.health)) {
                    const healthStore = db.createObjectStore(STORES.health, { keyPath: 'id', autoIncrement: true });
                    healthStore.createIndex('provider_date', ['provider', 'date'], { unique: true });
                    healthStore.createIndex('provider', 'provider', { unique: false });
                }

                // Metadata store
                if (!db.objectStoreNames.contains(STORES.metadata)) {
                    db.createObjectStore(STORES.metadata, { keyPath: 'key' });
                }
            };
        });
    }

    // ===== COSTS =====

    async addCost(provider, date, model, inputTokens, outputTokens, cost) {
        const tx = this.db.transaction([STORES.costs], 'readwrite');
        const store = tx.objectStore(STORES.costs);

        return new Promise((resolve, reject) => {
            const data = {
                provider,
                date,
                model,
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                cost,
                timestamp: new Date().toISOString()
            };

            // Try to update existing, insert if not found
            const index = store.index('provider_date');
            const getRequest = index.get([provider, date]);

            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    data.id = getRequest.result.id;
                    store.put(data);
                } else {
                    store.add(data);
                }
                resolve(data);
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async getCostsByProvider(provider, days = 7) {
        const tx = this.db.transaction([STORES.costs], 'readonly');
        const store = tx.objectStore(STORES.costs);
        const index = store.index('provider');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        return new Promise((resolve, reject) => {
            const results = [];
            const request = index.getAll(provider);

            request.onsuccess = () => {
                const allCosts = request.result;
                const filtered = allCosts.filter(c => c.date >= startDateStr);
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(filtered.slice(0, days));
            };

            request.onerror = () => reject(request.error);
        });
    }

    async getCostByProviderAndDate(provider, date) {
        const tx = this.db.transaction([STORES.costs], 'readonly');
        const store = tx.objectStore(STORES.costs);
        const index = store.index('provider_date');

        return new Promise((resolve, reject) => {
            const request = index.get([provider, date]);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteCostsBefore(date) {
        const tx = this.db.transaction([STORES.costs], 'readwrite');
        const store = tx.objectStore(STORES.costs);
        const index = store.index('date');

        return new Promise((resolve, reject) => {
            const range = IDBKeyRange.upperBound(date);
            const request = index.getAll(range);

            request.onsuccess = () => {
                const ids = request.result.map(r => r.id);
                let deleted = 0;

                ids.forEach(id => {
                    const deleteReq = store.delete(id);
                    deleteReq.onsuccess = () => deleted++;
                    deleteReq.onerror = () => reject(deleteReq.error);
                });

                resolve(deleted);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // ===== HEALTH SIGNALS =====

    async addHealthSignal(provider, date, ioRatio, modelShift, sycophancyScore) {
        const tx = this.db.transaction([STORES.health], 'readwrite');
        const store = tx.objectStore(STORES.health);

        return new Promise((resolve, reject) => {
            const data = {
                provider,
                date,
                io_ratio: ioRatio,
                model_shift: modelShift,
                sycophancy_score: sycophancyScore,
                timestamp: new Date().toISOString()
            };

            store.add(data);
            resolve(data);
        });
    }

    async getHealthSignals(provider, days = 7) {
        const tx = this.db.transaction([STORES.health], 'readonly');
        const store = tx.objectStore(STORES.health);
        const index = store.index('provider');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        return new Promise((resolve, reject) => {
            const request = index.getAll(provider);

            request.onsuccess = () => {
                const all = request.result;
                const filtered = all.filter(h => h.date >= startDateStr);
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(filtered.slice(0, days));
            };

            request.onerror = () => reject(request.error);
        });
    }

    // ===== METADATA =====

    async setMetadata(key, value) {
        const tx = this.db.transaction([STORES.metadata], 'readwrite');
        const store = tx.objectStore(STORES.metadata);

        return new Promise((resolve, reject) => {
            const data = {
                key,
                value,
                timestamp: new Date().toISOString()
            };

            store.put(data);
            resolve(data);
        });
    }

    async getMetadata(key) {
        const tx = this.db.transaction([STORES.metadata], 'readonly');
        const store = tx.objectStore(STORES.metadata);

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getLastBackfillDate(provider) {
        const result = await this.getMetadata(`last_backfill_${provider}`);
        return result ? result.value : null;
    }

    async setLastBackfillDate(provider, date) {
        return this.setMetadata(`last_backfill_${provider}`, date);
    }

    // ===== UTILITY =====

    async getCostsByDateRange(provider, startDate, endDate) {
        const tx = this.db.transaction([STORES.costs], 'readonly');
        const store = tx.objectStore(STORES.costs);
        const index = store.index('provider_date');

        return new Promise((resolve, reject) => {
            const range = IDBKeyRange.bound(
                [provider, startDate],
                [provider, endDate],
                false,
                false
            );

            const results = [];
            const request = index.openCursor(range);

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    async getTotalCostsByProvider(provider, days = 30) {
        const costs = await this.getCostsByProvider(provider, days);
        const total = costs.reduce((sum, c) => sum + (c.cost || 0), 0);
        const avgDaily = total / Math.max(costs.length, 1);
        return { total: total.toFixed(2), avgDaily: avgDaily.toFixed(2), days: costs.length };
    }

    async clearAll() {
        const tx = this.db.transaction(Object.values(STORES), 'readwrite');

        return new Promise((resolve, reject) => {
            Object.values(STORES).forEach(storeName => {
                tx.objectStore(storeName).clear();
            });

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
}

// Initialize global instance
let tsdb = new TokenScopeDB();
tsdb.init().catch(e => console.error('Failed to initialize IndexedDB:', e));
