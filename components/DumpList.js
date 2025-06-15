import { ListManager } from './ListManager.js';

export class DumpList extends ListManager {
    constructor() {
        super('dump');
    }

    moveToTodo(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            this.removeItem(id);
            const todoList = new TodoList();
            todoList.addItem(item.title, item.details, 'medium');
        }
    }

    render() {
        this.element.innerHTML = '';
        this.list.sort((a, b) => b.id - a.id).forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center p-3 border-b border-gray-200 list-item';
            
            const content = document.createElement('div');
            content.className = 'flex-1';
            const titleDiv = document.createElement('div');
            titleDiv.className = 'text-gray-900 font-medium';
            titleDiv.textContent = item.title;
            
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'text-gray-600 text-sm mt-1';
            detailsDiv.textContent = item.details || '';
            
            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'text-xs text-gray-400 mt-1';
            timestampDiv.textContent = new Date(item.timestamp).toLocaleString();
            
            content.appendChild(titleDiv);
            if (item.details) content.appendChild(detailsDiv);
            content.appendChild(timestampDiv);

            const actions = document.createElement('div');
            actions.className = 'flex space-x-2';

            const moveToTodoBtn = document.createElement('button');
            moveToTodoBtn.className = 'text-blue-500 hover:text-blue-700';
            moveToTodoBtn.innerHTML = 'ToDoへ移動';
            moveToTodoBtn.onclick = () => this.moveToTodo(item.id);
            actions.appendChild(moveToTodoBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:text-red-700';
            deleteBtn.innerHTML = '削除';
            deleteBtn.onclick = () => this.removeItem(item.id);
            actions.appendChild(deleteBtn);

            li.appendChild(content);
            li.appendChild(actions);
            this.element.appendChild(li);
        });
    }
}
