// In-memory storage fallback for environments where localStorage is not available
const memoryStorage = new Map();

// Check if localStorage is available
export const isLocalStorageAvailable = (() => {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.warn('localStorage is not available, falling back to in-memory storage');
        return false;
    }
})();

export class StorageManager {
    /**
     * Load data from storage
     * @param {string} key - The key to load data from
     * @returns {Array} The parsed data or empty array if not found/invalid
     */
    static loadData(key) {
        try {
            if (isLocalStorageAvailable) {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : [];
            } else {
                // Fallback to in-memory storage
                return memoryStorage.has(key) ? memoryStorage.get(key) : [];
            }
        } catch (error) {
            console.error(`Error loading data for key '${key}':`, error);
            return [];
        }
    }

    /**
     * Save data to storage
     * @param {string} key - The key to save data to
     * @param {Array} data - The data to save
     */
    static saveData(key, data) {
        try {
            const dataToSave = data || [];
            if (isLocalStorageAvailable) {
                localStorage.setItem(key, JSON.stringify(dataToSave));
            } else {
                // Fallback to in-memory storage
                memoryStorage.set(key, dataToSave);
                console.warn('Data saved to in-memory storage. Changes will be lost on page refresh.');
            }
        } catch (error) {
            console.error(`Error saving data for key '${key}':`, error);
        }
    }

    /**
     * Clear all data for a specific key
     * @param {string} key - The key to clear
     */
    static clearData(key) {
        try {
            if (isLocalStorageAvailable) {
                localStorage.removeItem(key);
            } else {
                memoryStorage.delete(key);
            }
        } catch (error) {
            console.error(`Error clearing data for key '${key}':`, error);
        }
    }

    /**
     * Clear all application data
     */
    static clearAll() {
        try {
            if (isLocalStorageAvailable) {
                // Clear all keys that start with our app's prefix
                Object.keys(localStorage).forEach(key => {
                    if (key.endsWith('Items')) { // Only clear our app's keys
                        localStorage.removeItem(key);
                    }
                });
            } else {
                memoryStorage.clear();
            }
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }

    /**
     * Export all data as a JSON string
     * @returns {string} JSON string of all stored data
     */
    static exportData() {
        try {
            if (isLocalStorageAvailable) {
                const allData = {};
                Object.keys(localStorage).forEach(key => {
                    if (key.endsWith('Items')) {
                        allData[key] = JSON.parse(localStorage.getItem(key));
                    }
                });
                return JSON.stringify(allData, null, 2);
            } else {
                return JSON.stringify(Object.fromEntries(memoryStorage), null, 2);
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            return '{}';
        }
    }

    /**
     * Import data from a JSON string
     * @param {string} jsonString - JSON string to import
     * @returns {boolean} True if import was successful
     */
    static importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(data).forEach(([key, value]) => {
                if (isLocalStorageAvailable) {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    memoryStorage.set(key, value);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}
