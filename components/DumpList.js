import { ListManager } from './ListManager.js';
import { TodoList } from './TodoList.js';
import { StorageManager } from '../utils/StorageManager.js';

export class DumpList extends ListManager {
    constructor() {
        super('dump');
        this.editingId = null;
        this.list = StorageManager.loadData('dump') || [];
    }

    addItem(text) {
        const item = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toISOString(),
            completed: false
        };
        
        this.list.push(item);
        StorageManager.saveData('dump', this.list);
        this.render();
        return item;
    }

    moveToTodo(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            this.list = this.list.filter(i => i.id !== id);
            StorageManager.saveData('dump', this.list);
            
            const todoList = new TodoList();
            todoList.addItem(item.text);
            
            this.render();
        }
    }

    createItemElement(item) {
        const li = document.createElement('li');
        li.className = 'group relative p-3 border-b border-gray-200 hover:bg-gray-50';
        li.dataset.id = item.id;

        if (this.editingId === item.id) {
            // Edit mode
            const editForm = document.createElement('form');
            editForm.className = 'flex items-start space-x-2 w-full';
            editForm.onsubmit = (e) => {
                e.preventDefault();
                const input = editForm.querySelector('textarea');
                if (input.value.trim()) {
                    this.updateItem(item.id, input.value.trim());
                    this.editingId = null;
                    this.render();
                }
            };

            const textarea = document.createElement('textarea');
            textarea.className = 'flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500';
            textarea.value = item.text || '';
            textarea.rows = Math.max(1, textarea.value.split('\n').length);
            textarea.style.minHeight = '2.5rem';
            textarea.style.maxHeight = '20rem';
            textarea.style.resize = 'none';
            
            // Auto-resize textarea
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 20 * 16) + 'px';
            });

            const saveBtn = document.createElement('button');
            saveBtn.type = 'submit';
            saveBtn.className = 'bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 self-end';
            saveBtn.textContent = '保存';

            editForm.appendChild(textarea);
            editForm.appendChild(saveBtn);
            li.appendChild(editForm);
            
            // Focus and adjust height after DOM update
            setTimeout(() => {
                textarea.focus();
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 20 * 16) + 'px';
            }, 0);
        } else {
            // View mode
            const content = document.createElement('div');
            content.className = 'whitespace-pre-wrap break-words pr-10';
            content.textContent = item.text;
            
            const actions = document.createElement('div');
            actions.className = 'absolute right-3 top-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity';
            
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'text-blue-500 hover:text-blue-700';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = '編集';
            editBtn.onclick = (e) => {
                e.stopPropagation();
                this.editingId = item.id;
                this.render();
            };

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:text-red-700';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = '削除';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm('このアイテムを削除しますか？')) {
                    this.removeItem(item.id);
                }
            };

            // Move to Todo button
            const moveToTodoBtn = document.createElement('button');
            moveToTodoBtn.className = 'text-green-500 hover:text-green-700';
            moveToTodoBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
            moveToTodoBtn.title = 'ToDoに移動';
            moveToTodoBtn.onclick = (e) => {
                e.stopPropagation();
                this.moveToTodo(item.id);
            };

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            actions.appendChild(moveToTodoBtn);
            
            li.appendChild(content);
            li.appendChild(actions);
        }
        
        return li;
    }
    
    updateItem(id, newText) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            item.text = newText;
            StorageManager.saveData('dump', this.list);
            this.render();
            return true;
        }
        return false;
    }
    
    removeItem(id) {
        this.list = this.list.filter(item => item.id !== id);
        StorageManager.saveData('dump', this.list);
        this.render();
    }
}
