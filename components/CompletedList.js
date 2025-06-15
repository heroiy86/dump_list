import { ListManager } from './ListManager.js';
import { StorageManager } from '../utils/StorageManager.js';

class CompletedList extends ListManager {
    constructor() {
        super('completed');
    }

    addItem(text, originalPriority) {
        const item = {
            id: Date.now(),
            text: text,
            originalPriority: originalPriority,
            completedAt: new Date().toLocaleString()
        };
        
        this.list.push(item);
        StorageManager.saveData('completed', this.list);
        this.render();
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
            content.innerHTML = `
                <div class="text-gray-900 line-through">${item.text}</div>
                <div class="text-sm text-gray-500">
                    完了日: ${item.completedAt}<br>
                    優先度: ${item.originalPriority}
                </div>
            `;

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
