import { ListManager } from './ListManager.js';
import { CompletedList } from './CompletedList.js';
import { TabManager } from './TabManager.js';

export class TodoList extends ListManager {
    constructor() {
        super('todo');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const addButton = document.getElementById('todoAddButton');
        const inputField = document.getElementById('todoInput');
        
        if (addButton && inputField) {
            addButton.addEventListener('click', () => this.addNewItem());
            
            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addNewItem();
                }
            });
        }
    }

    async addNewItem() {
        const inputField = document.getElementById('todoInput');
        if (!inputField) return;

        const text = inputField.value.trim();
        if (text) {
            try {
                await this.addItem({
                    text,
                    priority: 'medium',
                    completed: false,
                    timestamp: new Date().toISOString(),
                    originalPriority: 'medium'
                });
                inputField.value = '';
                inputField.focus();
                this.showMessage('ToDoを追加しました', 'blue');
            } catch (error) {
                console.error('Error adding todo:', error);
                alert('ToDoの追加中にエラーが発生しました: ' + error.message);
            }
        }
    }

    renderItems(fragment) {
        const sortedItems = [...this.list].sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        sortedItems.forEach((item, index) => {
            const li = this.createTodoItemElement(item, index);
            fragment.appendChild(li);
        });
    }

    createTodoItemElement(item, index) {
        const li = document.createElement('li');
        li.className = 'group relative p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200';
        li.dataset.id = item.id;
        li.style.animationDelay = `${index * 50}ms`;
        li.classList.add('animate-fade-in');
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3';
        checkbox.checked = item.completed;
        checkbox.onchange = () => this.toggleComplete(item.id);
        
        // Priority badge
        const priorityBadge = document.createElement('span');
        const priorityClasses = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        };
        const priorityLabels = { high: '高', medium: '中', low: '低' };
        
        priorityBadge.className = `text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${priorityClasses[item.priority] || 'bg-gray-100 text-gray-800'}`;
        priorityBadge.textContent = priorityLabels[item.priority] || item.priority;
        
        // Item text
        const textSpan = document.createElement('span');
        textSpan.className = item.completed ? 'line-through text-gray-400' : 'text-gray-800';
        textSpan.textContent = item.text;
        
        // Text container
        const textContainer = document.createElement('div');
        textContainer.className = 'flex-1 flex items-center';
        textContainer.appendChild(priorityBadge);
        textContainer.appendChild(textSpan);
        
        // Actions container - Always visible for mobile
        const actions = document.createElement('div');
        actions.className = 'flex items-center space-x-1';
        
        // Priority change button - Always visible with text
        const priorityButton = document.createElement('button');
        priorityButton.className = 'text-xs bg-purple-500 text-white px-2 py-1 rounded shadow';
        priorityButton.innerHTML = '<i class="fas fa-flag mr-1"></i>';
        priorityButton.onclick = (e) => this.changePriority(item.id, e);
        
        // Edit button - Always visible with text
        const editButton = document.createElement('button');
        editButton.className = 'text-xs bg-blue-500 text-white px-2 py-1 rounded shadow';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.onclick = (e) => this.startEditing(item.id, e);
        
        // Delete button - Always visible with text
        const deleteButton = document.createElement('button');
        deleteButton.className = 'text-xs bg-red-500 text-white px-2 py-1 rounded shadow';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            this.removeItem(item.id);
        };
        
        // Add action buttons
        actions.appendChild(priorityButton);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        
        // Assemble the item
        const container = document.createElement('div');
        container.className = 'flex items-center justify-between';
        
        const leftSection = document.createElement('div');
        leftSection.className = 'flex items-center flex-1';
        leftSection.appendChild(checkbox);
        leftSection.appendChild(textContainer);
        
        container.appendChild(leftSection);
        container.appendChild(actions);
        
        li.appendChild(container);
        return li;
    }

    async toggleComplete(id) {
        const item = this.findItem(id);
        if (!item) return;
        
        try {
            if (item.completed) {
                await this.updateItem(id, { completed: false });
            } else {
                const completedList = new CompletedList();
                await this.moveItem(id, completedList, (item) => ({
                    text: item.text,
                    completedAt: new Date().toISOString(),
                    originalPriority: item.priority || 'medium',
                    timestamp: item.timestamp || new Date().toISOString()
                }));
                this.showMessage('完了しました！', 'green');
                
                // Switch to completed tab
                const tabManager = new TabManager();
                tabManager.switchTab('completed');
            }
        } catch (error) {
            console.error('Error toggling complete status:', error);
            alert('ステータスの更新中にエラーが発生しました: ' + error.message);
        }
    }

    async changePriority(id, event) {
        if (event) event.stopPropagation();
        
        const item = this.findItem(id);
        if (!item) return;
        
        try {
            const priorities = ['high', 'medium', 'low'];
            const currentIndex = priorities.indexOf(item.priority);
            const nextIndex = (currentIndex + 1) % priorities.length;
            const newPriority = priorities[nextIndex];
            
            await this.updateItem(id, { 
                priority: newPriority,
                originalPriority: newPriority
            });
            
            const priorityLabels = { high: '高', medium: '中', low: '低' };
            this.showMessage(`優先度を「${priorityLabels[newPriority]}」に変更しました`, 'blue');
        } catch (error) {
            console.error('Error changing priority:', error);
            alert('優先度の変更中にエラーが発生しました: ' + error.message);
        }
    }

    showMessage(text, color = 'blue') {
        const message = document.createElement('div');
        message.className = `fixed bottom-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in`;
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => message.remove(), 500);
        }, 2000);
    }

    async startEditing(id, event) {
        if (event) event.stopPropagation();
        
        const item = this.findItem(id);
        if (!item) return;
        
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (!li) return;
        
        // Save current content
        const currentContent = li.innerHTML;
        
        // Create edit form
        const form = document.createElement('form');
        form.className = 'w-full';
        form.onsubmit = async (e) => {
            e.preventDefault();
            const newText = textarea.value.trim();
            if (newText) {
                await this.updateItem(id, { text: newText });
            }
            li.innerHTML = currentContent;
            this.initializeEventListeners();
        };
        
        const container = document.createElement('div');
        container.className = 'flex items-start space-x-2';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500';
        textarea.value = item.text;
        textarea.rows = Math.max(2, item.text.split('\n').length);
        textarea.style.minHeight = '2.5rem';
        
        // Auto-resize textarea
        const resizeTextarea = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        
        textarea.addEventListener('input', resizeTextarea);
        setTimeout(resizeTextarea, 0);
        
        // Save button
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded';
        saveButton.textContent = '保存';
        
        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded';
        cancelButton.textContent = 'キャンセル';
        cancelButton.onclick = () => {
            li.innerHTML = currentContent;
            this.initializeEventListeners();
        };
        
        // Assemble the form
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex space-x-2 mt-2';
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        
        container.appendChild(textarea);
        form.appendChild(container);
        form.appendChild(buttonContainer);
        
        // Replace content with form
        li.innerHTML = '';
        li.appendChild(form);
        textarea.focus();
    }
}
