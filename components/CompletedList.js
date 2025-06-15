import { ListManager } from './ListManager.js';
import { StorageManager } from '../utils/StorageManager.js';

export class CompletedList extends ListManager {
    constructor() {
        super('completed');
    }

    addItem(title, details = '', originalPriority = 'medium') {
        const item = {
            id: Date.now(),
            title: title,
            details: details,
            originalPriority: originalPriority,
            completedAt: new Date().toLocaleString()
        };
        
        this.list.push(item);
        StorageManager.saveData('completed', this.list);
        this.render();
        return item;
    }

    moveToTodo(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            this.removeItem(id);
            const todoList = new TodoList();
            todoList.addItem(item.text, item.originalPriority);
        }
    }

    render() {
        this.element.innerHTML = '';
        this.list.sort((a, b) => b.id - a.id).forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center p-3 border-b border-gray-200';
            
            const content = document.createElement('div');
            content.className = 'flex-1';
            const titleDiv = document.createElement('div');
            titleDiv.className = 'text-gray-900 font-medium line-through';
            titleDiv.textContent = item.title;
            
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'text-gray-600 text-sm mt-1 line-through';
            detailsDiv.textContent = item.details || '';
            
            const metaDiv = document.createElement('div');
            metaDiv.className = 'text-sm text-gray-500 mt-2';
            metaDiv.innerHTML = `
                完了日: ${item.completedAt}<br>
                優先度: ${item.originalPriority}
            `;
            
            content.appendChild(titleDiv);
            if (item.details) content.appendChild(detailsDiv);
            content.appendChild(metaDiv);

            const actions = document.createElement('div');
            actions.className = 'flex space-x-2';

            const moveToTodoBtn = document.createElement('button');
            moveToTodoBtn.className = 'text-blue-500 hover:text-blue-700';
            moveToTodoBtn.innerHTML = 'ToDoに戻す';
            moveToTodoBtn.onclick = () => this.moveToTodo(item.id);
            actions.appendChild(moveToTodoBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:text-red-700';
            deleteBtn.innerHTML = '完全に削除';
            deleteBtn.onclick = () => this.removeItem(item.id);
            actions.appendChild(deleteBtn);

            li.appendChild(content);
            li.appendChild(actions);
            this.element.appendChild(li);
        });
    }
}

export { CompletedList };
