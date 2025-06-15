export class StorageManager {
    /**
     * Load data from localStorage
     * @param {string} key - The key to load data from
     * @returns {Array} The parsed data or empty array if not found/invalid
     */
    static loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error loading data for key '${key}':`, error);
            return [];
        }
    }

    /**
     * Save data to localStorage
     * @param {string} key - The key to save data to
     * @param {Array} data - The data to save
     */
    static saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data || []));
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
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error clearing data for key '${key}':`, error);
        }
    }

    /**
     * Clear all application data
     */
    static clearAll() {
        try {
            // Clear all keys that start with our app's prefix
            Object.keys(localStorage).forEach(key => {
                if (key.endsWith('Items')) { // Only clear our app's keys
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }
}
