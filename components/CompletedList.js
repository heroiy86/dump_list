import { ListManager } from './ListManager.js';

export class CompletedList extends ListManager {
    constructor() {
        super('completed');
    }

    addItem(text) {
        const item = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toISOString(),
            completed: true
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
        content.className = 'whitespace-pre-wrap break-words pr-10 text-gray-500 line-through';
        content.textContent = item.text;
        
        const actions = document.createElement('div');
        actions.className = 'absolute right-3 top-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity';
        
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

        actions.appendChild(deleteBtn);
        
        li.appendChild(content);
        li.appendChild(actions);
        
        return li;
    }

    moveToTodo(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            this.removeItem(id);
            const todoList = new TodoList();
            todoList.addItem(item.text);
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
