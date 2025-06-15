import { ListManager } from './ListManager.js';
import { TodoList } from './TodoList.js';
import { TabManager } from './TabManager.js';

export class DumpList extends ListManager {
    constructor(tabManager) {
        super('dump');
        this.tabManager = tabManager;
        this.initializeEventListeners();
        
        // Ensure the element is properly set
        if (!this.element) {
            this.element = document.getElementById('dumpList');
        }
        
        // Initial render
        this.render();
    }

    initializeEventListeners() {
        // Add button click handler
        const addButton = document.getElementById('dumpAddButton');
        const inputField = document.getElementById('dumpInput');
        
        if (addButton && inputField) {
            // Add button click
            addButton.addEventListener('click', () => this.addNewItem());
            
            // Enter key in input field
            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.addNewItem();
                }
            });
        }
    }

    async addNewItem() {
        console.log('addNewItem called');
        const inputField = document.getElementById('dumpInput');
        if (!inputField) {
            console.error('Input field not found');
            return;
        }
        console.log('Input field value:', inputField.value);

        const text = inputField.value.trim();
        console.log('Trimmed text:', text);
        
        if (text) {
            try {
                console.log('Attempting to add new item:', text);
                const result = await this.addItem({ 
                    text: text,
                    timestamp: new Date().toISOString()
                });
                console.log('Item added successfully:', result);
                inputField.value = '';
                // Reset textarea height
                inputField.style.height = 'auto';
                inputField.focus();
                
                // Show success message
                const message = document.createElement('div');
                message.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in';
                message.textContent = '追加しました';
                document.body.appendChild(message);
                
                // Remove message after 2 seconds
                setTimeout(() => {
                    message.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                    setTimeout(() => message.remove(), 500);
                }, 2000);
                
            } catch (error) {
                console.error('Error adding item:', error);
                alert('追加中にエラーが発生しました: ' + error.message);
            }
        }
    }

    renderItems(fragment) {
        if (!fragment) {
            console.error('No fragment provided to renderItems');
            return;
        }
        
        // Create a list container
        const listContainer = document.createElement('ul');
        listContainer.className = 'space-y-2';
        
        this.list.forEach((item, index) => {
            const itemElement = document.createElement('li');
            itemElement.className = 'bg-white p-4 shadow-sm hover:shadow transition-shadow duration-200 rounded';
            itemElement.dataset.id = item.id;
            
            // Add animation delay for staggered appearance
            itemElement.style.animationDelay = `${index * 50}ms`;
            itemElement.classList.add('animate-fade-in');
            
            // Item content container
            const contentContainer = document.createElement('div');
            contentContainer.className = 'flex justify-between items-start';
            
            // Item content
            const content = document.createElement('div');
            content.className = 'whitespace-pre-wrap break-words flex-1';
            content.textContent = item.text;
            
            // Actions container - Always visible and better for mobile
            const actions = document.createElement('div');
            actions.className = 'mt-2 flex justify-end space-x-2';
            
            // Edit button - Always visible with text
            const editButton = document.createElement('button');
            editButton.className = 'text-xs bg-blue-500 text-white px-2 py-1 rounded shadow';
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.title = '編集';
            editButton.onclick = (e) => this.startEditing(item.id, e);
            
            // Delete button - Always visible with text
            const deleteButton = document.createElement('button');
            deleteButton.className = 'text-xs bg-red-500 text-white px-2 py-1 rounded shadow';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.title = '削除';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                this.removeItem(item.id);
            };
            
            // Move to Todo button
            const moveToTodoButton = document.createElement('button');
            moveToTodoButton.className = 'text-xs bg-green-500 text-white px-2 py-1 rounded shadow';
            moveToTodoButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
            moveToTodoButton.title = 'ToDoへ移動';
            moveToTodoButton.onclick = (e) => {
                e.stopPropagation();
                this.moveToTodo(item.id);
            };
            
            // Add action buttons
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            actions.appendChild(moveToTodoButton);
            
            // Assemble the item
            contentContainer.appendChild(content);
            contentContainer.appendChild(actions);
            itemElement.appendChild(contentContainer);
            
            // Add to list container
            listContainer.appendChild(itemElement);
        });
        
        // Add the list container to the fragment
        fragment.appendChild(listContainer);
    }
    
    startEditing(id, event) {
        if (event) event.stopPropagation();
        
        const item = this.findItem(id);
        if (!item) return;
        
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (!li) return;
        
        // Create edit form
        const form = document.createElement('form');
        form.className = 'w-full';
        form.onsubmit = (e) => {
            e.preventDefault();
            this.finishEditing(id, textarea.value);
        };
        
        const container = document.createElement('div');
        container.className = 'flex items-start space-x-2';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500';
        textarea.value = item.text;
        textarea.rows = Math.max(2, item.text.split('\n').length);
        textarea.style.minHeight = '2.5rem';
        textarea.style.maxHeight = '20rem';
        textarea.style.resize = 'none';
        
        // Auto-resize textarea
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 20 * 16) + 'px';
        });
        
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 self-end';
        saveButton.textContent = '保存';
        
        container.appendChild(textarea);
        container.appendChild(saveButton);
        form.appendChild(container);
        
        // Replace content with edit form
        li.innerHTML = '';
        li.appendChild(form);
        
        // Focus and adjust height
        setTimeout(() => {
            textarea.focus();
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 20 * 16) + 'px';
        }, 0);
    }
    
    finishEditing(id, newText) {
        const trimmedText = newText.trim();
        if (trimmedText) {
            this.updateItem(id, { text: trimmedText });
        }
    }
    
    async moveToTodo(id) {
        const item = this.findItem(id);
        if (!item) return;
        
        try {
            const todoList = new TodoList(this.tabManager);
            // Move the item to the todo list
            await this.moveItem(id, todoList, (item) => ({
                text: item.text,
                priority: 'medium', // Default priority
                completed: false,
                timestamp: new Date().toISOString(),
                originalPriority: 'medium' // Store original priority for potential move back
            }));
            
            // Show success message
            const message = document.createElement('div');
            message.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in';
            message.textContent = 'ToDoに移動しました';
            document.body.appendChild(message);
            
            // Remove message after 2 seconds
            setTimeout(() => {
                message.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                setTimeout(() => message.remove(), 500);
            }, 2000);
            
            // Switch to the todo tab
            if (this.tabManager) {
                this.tabManager.switchTab('todo');
            }
            
        } catch (error) {
            console.error('Error moving item to todo:', error);
            alert('ToDoへの移動中にエラーが発生しました: ' + error.message);
        }
    }
}
