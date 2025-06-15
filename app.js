import { StorageManager } from './utils/StorageManager.js';
import { ListManager } from './components/ListManager.js';
import { DumpList } from './components/DumpList.js';
import { TabManager } from './components/TabManager.js';

// データストレージ管理
class StorageManager {
    static saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}

// リスト管理基本クラス
class ListManager {
    constructor(key) {
        this.key = key;
        this.element = document.getElementById(`${key}List`);
        this.list = StorageManager.loadData(key);
    }

    addItem(text) {
        const item = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString()
        };
        
        this.list.push(item);
        StorageManager.saveData(this.key, this.list);
        this.render();
    }

    removeItem(id) {
        this.list = this.list.filter(item => item.id !== id);
        StorageManager.saveData(this.key, this.list);
        this.render();
    }

    render() {
        this.element.innerHTML = '';
        this.list.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center p-3 border-b border-gray-200';
            
            const content = document.createElement('div');
            content.className = 'flex-1';
            content.innerHTML = `
                <div class="text-gray-900">${item.text}</div>
                <div class="text-sm text-gray-500">${item.timestamp}</div>
            `;

            const actions = document.createElement('div');
            actions.className = 'flex space-x-2';

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

// ダンプリスト管理
class DumpList extends ListManager {
    constructor() {
        super('dump');
    }

    moveToTodo(id) {
        const item = this.list.find(item => item.id === id);
        if (item) {
            this.removeItem(id);
            const todoList = new TodoList();
            todoList.addItem(item.text, 'medium');
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
                <div class="text-gray-900">${item.text}</div>
                <div class="text-sm text-gray-500">${new Date(item.timestamp).toLocaleString()}</div>
            `;

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

// ToDoリスト管理
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

// 完了リスト管理
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

// タブ管理
class TabManager {
    constructor() {
        this.activeTab = 'dump';
        this.setupEventListeners();
        this.loadInitialContent();
    }

    setupEventListeners() {
        // 上部タブ
        document.querySelectorAll('.tab-button').forEach(button => {
            button.onclick = () => this.switchTab(button.dataset.tab);
        });

        // 下部タブ
        document.querySelectorAll('.bottom-tab-button').forEach(button => {
            button.onclick = () => this.switchTab(button.dataset.tab);
        });

        // リスト追加ボタン
        document.getElementById('dumpAddButton').addEventListener('click', () => {
            const input = document.getElementById('dumpInput');
            if (input.value.trim()) {
                dumpList.addItem(input.value.trim());
                input.value = '';
            }
        });

        document.getElementById('todoAddButton').addEventListener('click', () => {
            const input = document.getElementById('todoInput');
            if (input.value.trim()) {
                todoList.addItem(input.value.trim());
                input.value = '';
            }
        });

        // キーイベントリスナー
        document.getElementById('dumpInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                dumpList.addItem(e.target.value.trim());
                e.target.value = '';
            }
        });

        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                todoList.addItem(e.target.value.trim());
                e.target.value = '';
            }
        });
    }

    async switchTab(tabId) {
        // タブボタンの更新
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        document.querySelectorAll('.bottom-tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        // コンテンツの切り替え
        const currentContent = document.querySelector(`#${this.activeTab}Content`);
        const newContent = document.querySelector(`#${tabId}Content`);

        // 現在のコンテンツをフェードアウト
        currentContent.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 300));
        currentContent.classList.add('hidden');

        // 新しいコンテンツを表示
        newContent.classList.remove('hidden');
        newContent.style.opacity = '0';
        newContent.style.display = 'block';
        
        // フェードインアニメーション
        requestAnimationFrame(() => {
            newContent.style.opacity = '1';
        });

        this.activeTab = tabId;
    }

    loadInitialContent() {
        dumpList.render();
        todoList.render();
        completedList.render();
    }

    // ツールチップの表示制御
    setupTooltips() {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.addEventListener('mouseenter', (e) => {
                const tooltiptext = tooltip.querySelector('.tooltiptext');
                if (tooltiptext) {
                    tooltiptext.style.visibility = 'visible';
                    tooltiptext.style.opacity = '1';
                }
            });

            tooltip.addEventListener('mouseleave', (e) => {
                const tooltiptext = tooltip.querySelector('.tooltiptext');
                if (tooltiptext) {
                    tooltiptext.style.visibility = 'hidden';
                    tooltiptext.style.opacity = '0';
                }
            });
        });
    }
}

// グローバル変数の初期化
const dumpList = new DumpList();
const todoList = new TodoList();
const completedList = new CompletedList();
const tabManager = new TabManager();

// DOMContentLoadedイベントでツールチップをセットアップ
document.addEventListener('DOMContentLoaded', () => {
    tabManager.setupTooltips();
});
