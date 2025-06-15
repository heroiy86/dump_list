import { ListManager } from './ListManager.js';
import { StorageManager } from '../utils/StorageManager.js';

class TodoList extends ListManager {
    constructor() {
        super('todo');
    }

    addItem(text, priority = 'medium') {
        const item = {
            id: Date.now(),
            text: text,
            priority: priority,
            timestamp: new Date().toLocaleString()
        };
        
        this.list.push(item);
        StorageManager.saveData('todo', this.list);
        this.render();
    }

    toggleComplete(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            this.removeItem(id);
            const completedList = new CompletedList();
            completedList.addItem(item.text, item.priority);
        }
    }

    changePriority(id) {
        const priorities = ['high', 'medium', 'low'];
        const item = this.list.find(item => item.id === id);
        if (item) {
            const currentIndex = priorities.indexOf(item.priority);
            const nextPriority = priorities[(currentIndex + 1) % priorities.length];
            item.priority = nextPriority;
            StorageManager.saveData('todo', this.list);
            this.render();
        }
    }

    editItem(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            const li = document.querySelector(`[data-item-id="${id}"]`);
            const contentDiv = li.querySelector('.todo-content');
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = item.text;
            editInput.className = 'w-full p-2 border rounded';
            
            const saveBtn = document.createElement('button');
            saveBtn.className = 'ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600';
            saveBtn.textContent = '保存';
            
            saveBtn.onclick = () => {
                item.text = editInput.value;
                StorageManager.saveData('todo', this.list);
                this.render();
            };

            contentDiv.innerHTML = '';
            contentDiv.appendChild(editInput);
            contentDiv.appendChild(saveBtn);
            editInput.focus();
        }
    }

    render() {
        this.element.innerHTML = '';
        this.list
            .sort((a, b) => {
                if (a.priority !== b.priority) {
                    return priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
                }
                return b.id - a.id;
            })
            .forEach(item => {
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center p-3 border-b border-gray-200';
                li.dataset.itemId = item.id;
                
                const content = document.createElement('div');
                content.className = 'flex-1 flex items-center';
                
                // チェックボックス
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'mr-3';
                checkbox.onclick = () => this.toggleComplete(item.id);
                content.appendChild(checkbox);
                
                // コンテンツ
                const contentDiv = document.createElement('div');
                contentDiv.className = 'todo-content flex-1';
                contentDiv.innerHTML = `
                    <div class="text-gray-900">${item.text}</div>
                `;
                content.appendChild(contentDiv);
                
                // 優先度
                const priorityDiv = document.createElement('div');
                priorityDiv.className = `px-2 rounded ${this.getPriorityClass(item.priority)}`;
                priorityDiv.textContent = item.priority;
                content.appendChild(priorityDiv);

                const actions = document.createElement('div');
                actions.className = 'flex space-x-2';

                // 編集ボタン
                const editBtn = document.createElement('button');
                editBtn.className = 'text-yellow-500 hover:text-yellow-700';
                editBtn.innerHTML = '編集';
                editBtn.onclick = () => this.editItem(item.id);
                actions.appendChild(editBtn);

                // 優先度変更ボタン
                const priorityBtn = document.createElement('button');
                priorityBtn.className = 'text-gray-500 hover:text-gray-700';
                priorityBtn.innerHTML = '優先度変更';
                priorityBtn.onclick = () => this.changePriority(item.id);
                actions.appendChild(priorityBtn);

                // 削除ボタン
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

    getPriorityClass(priority) {
        const classes = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        };
        return classes[priority] || 'bg-gray-100 text-gray-800';
    }
}

export { TodoList };
