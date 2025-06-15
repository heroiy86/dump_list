import { ListManager } from './ListManager.js';
import { CompletedList } from './CompletedList.js';

export class TodoList extends ListManager {
    constructor() {
        super('todo');
    }

    addItem(text) {
        const item = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toISOString(),
            completed: false
        };
        
        this.list.push(item);
        this.save();
        this.render();
        return item;
    }

    createItemElement(item) {
        const li = document.createElement('li');
        li.className = 'group relative p-3 border-b border-gray-200 hover:bg-gray-50';
        li.dataset.id = item.id;

        const content = document.createElement('div');
        content.className = 'whitespace-pre-wrap break-words pr-10';
        content.textContent = item.text;
        
        const actions = document.createElement('div');
        actions.className = 'absolute right-3 top-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity';
        
        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'text-green-500 hover:text-green-700';
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        completeBtn.title = '完了';
        completeBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleComplete(item.id);
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

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        
        li.appendChild(content);
        li.appendChild(actions);
        
        return li;
    }

    toggleComplete(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            this.removeItem(id);
            const completedList = new CompletedList();
            completedList.addItem(item.text);
        }
    }
}
