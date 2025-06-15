import { StorageManager } from '../utils/StorageManager.js';

export class ListManager {
    constructor(key) {
        this.key = key;
        this.element = document.getElementById(`${key}List`);
        this.list = StorageManager.loadData(key);
    }

    addItem(title, details = '') {
        const item = {
            id: Date.now(),
            title: title,
            details: details,
            timestamp: new Date().toLocaleString(),
            completed: false
        };
        
        this.list.push(item);
        StorageManager.saveData(this.key, this.list);
        this.render();
        return item;
    }

    removeItem(id) {
        this.list = this.list.filter(item => item.id !== id);
        StorageManager.saveData(this.key, this.list);
        this.render();
    }

    render() {
        console.log(`Rendering ${this.key} list with ${this.list.length} items`);
        try {
            if (!this.element) {
                console.error('Render failed: element is not defined');
                return;
            }
            
            // Create a document fragment for better performance
            const fragment = document.createDocumentFragment();
            
            if (this.list.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'text-center py-8 text-gray-400 animate-fade-in';
                emptyMessage.innerHTML = `
                    <i class="far fa-inbox text-3xl mb-2 opacity-50"></i>
                    <p class="text-sm">アイテムがありません</p>
                `;
                fragment.appendChild(emptyMessage);
            } else {
                this.list.forEach((item, index) => {
                    try {
                        const li = document.createElement('li');
                        li.className = 'flex justify-between items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-fade-in';
                        li.dataset.itemId = item.id;
                        li.style.animationDelay = `${index * 50}ms`;
                        
                        const content = document.createElement('div');
                        content.className = 'flex-1';
                        
                        const titleDiv = document.createElement('div');
                        titleDiv.className = 'text-gray-900 font-medium flex items-center';
                        
                        // Add priority indicator if exists
                        if (item.priority) {
                            const priorityClass = {
                                high: 'bg-red-100 text-red-800',
                                medium: 'bg-yellow-100 text-yellow-800',
                                low: 'bg-green-100 text-green-800'
                            }[item.priority] || 'bg-gray-100 text-gray-800';
                            
                            const priorityBadge = document.createElement('span');
                            priorityBadge.className = `text-xs px-2 py-0.5 rounded-full mr-2 ${priorityClass}`;
                            priorityBadge.textContent = item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低';
                            titleDiv.appendChild(priorityBadge);
                        }
                        
                        const titleText = document.createElement('span');
                        titleText.className = item.completed ? 'line-through text-gray-400' : '';
                        titleText.textContent = item.title || 'タイトルなし';
                        titleDiv.appendChild(titleText);
                        
                        content.appendChild(titleDiv);
                        
                        if (item.details) {
                            const detailsDiv = document.createElement('div');
                            detailsDiv.className = 'text-gray-600 text-sm mt-2 pl-2 border-l-2 border-gray-200';
                            detailsDiv.textContent = item.details;
                            content.appendChild(detailsDiv);
                        }
                        
                        const timestampDiv = document.createElement('div');
                        timestampDiv.className = 'text-xs text-gray-400 mt-2 flex items-center';
                        timestampDiv.innerHTML = `
                            <i class="far fa-clock mr-1"></i>
                            <span>${item.timestamp || new Date().toLocaleString()}</span>
                        `;
                        content.appendChild(timestampDiv);

                        const actions = document.createElement('div');
                        actions.className = 'flex space-x-2';

                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'action-button text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors';
                        deleteBtn.innerHTML = '<i class="far fa-trash-alt"></i>';
                        deleteBtn.title = '削除';
                        deleteBtn.onclick = (e) => {
                            e.stopPropagation();
                            this.removeItem(item.id);
                        };
                        actions.appendChild(deleteBtn);

                        li.appendChild(content);
                        li.appendChild(actions);
                        fragment.appendChild(li);
                        
                    } catch (error) {
                        console.error(`Error rendering item ${index}:`, error);
                    }
                });
            }
            
            // Clear and append new content with animation
            this.element.innerHTML = '';
            this.element.appendChild(fragment);
            
            console.log(`Rendered ${this.list.length} items in ${this.key}`);
            
        } catch (error) {
            console.error('Error in render:', error);
            if (this.element) {
                this.element.innerHTML = `
                    <div class="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                        <div class="flex items-center">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            <span>エラーが発生しました: ${error.message}</span>
                        </div>
                    </div>
                `;
            }
        }
    }
}
