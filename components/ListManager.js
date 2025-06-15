import { StorageManager } from '../utils/StorageManager.js';

export class ListManager {
    constructor(key) {
        this.key = `${key}Items`; // Store as dumpItems, todoItems, completedItems
        this.element = document.getElementById(`${key}List`);
        this.list = StorageManager.loadData(this.key) || [];
    }

    // Common method to save the current list to storage
    save() {
        StorageManager.saveData(this.key, this.list);
        return this;
    }

    // Sort items by timestamp (newest first)
    sortItems() {
        this.list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return this;
    }

    // Add an item to the list
    async addItem(itemData) {
        try {
            const item = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                ...itemData
            };
            
            this.list.unshift(item); // Add to the beginning of the array
            await this.save();
            this.render();
            return item;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }

    // Update an existing item
    updateItem(id, updates) {
        const itemIndex = this.list.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            this.list[itemIndex] = { ...this.list[itemIndex], ...updates };
            this.save();
            this.render();
            return true;
        }
        return false;
    }

    // Remove an item by ID
    removeItem(id) {
        this.list = this.list.filter(item => item.id !== id);
        this.save();
        this.render();
        return this;
    }

    // Move an item to another list
    async moveItem(id, targetList, transformFn = item => item) {
        try {
            const itemIndex = this.list.findIndex(item => item.id === id);
            if (itemIndex === -1) return null;
            
            const [item] = this.list.splice(itemIndex, 1);
            const transformedItem = transformFn(item);
            
            // Add to target list
            const result = await targetList.addItem(transformedItem);
            
            // Save both lists
            this.save();
            targetList.save();
            
            // Re-render both lists
            this.render();
            targetList.render();
            
            return result;
        } catch (error) {
            console.error('Error moving item:', error);
            throw error;
        }
    }

    // Find an item by ID
    findItem(id) {
        return this.list.find(item => item.id === id);
    }

    // Render the list (to be implemented by child classes)
    render() {
        if (!this.element) return;
        
        // Clear the container
        this.element.innerHTML = '';
        
        if (this.list.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        // Create a container for the list items
        const listContainer = document.createElement('div');
        listContainer.className = 'space-y-2';
        
        // Render items into the container
        this.renderItems(listContainer);
        
        // Add the container to the element
        this.element.appendChild(listContainer);
    }
    
    // Render empty state
    renderEmptyState() {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'text-center py-8 text-gray-400 animate-fade-in';
        emptyMessage.innerHTML = `
            <i class="far fa-inbox text-3xl mb-2 opacity-50"></i>
            <p class="text-sm">アイテムがありません</p>
        `;
        this.element.appendChild(emptyMessage);
    }
    
    // To be implemented by child classes
    renderItems(fragment) {
        throw new Error('renderItems() must be implemented by child classes');
    }
}
