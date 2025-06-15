import { StorageManager } from './utils/StorageManager.js';
import { DumpList } from './components/DumpList.js';
import { TodoList } from './components/TodoList.js';
import { CompletedList } from './components/CompletedList.js';
import { TabManager } from './components/TabManager.js';

// グローバル変数
let dumpList, todoList, completedList, tabManager;

// アプリケーションの初期化
function initApp() {
    try {
        console.log('Initializing application...');
        
        // タブマネージャーの初期化
        tabManager = new TabManager(['dump', 'todo', 'completed']);
        
        // 各リストの初期化
        dumpList = new DumpList('dump', tabManager);
        todoList = new TodoList('todo', tabManager);
        completedList = new CompletedList('completed', tabManager);
        
        // ハッシュの変更を監視
        window.addEventListener('hashchange', handleHashChange);
        
        // 初期表示
        handleHashChange();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// ハッシュ変更時の処理
function handleHashChange() {
    const hash = window.location.hash.substring(1) || 'dump';
    tabManager.switchTab(hash);
    
    // アクティブなタブに応じて入力フィールドにフォーカス
    const activeInput = document.getElementById(`${hash}Input`);
    if (activeInput) {
        setTimeout(() => {
            activeInput.focus();
        }, 100);
    }
}

// DOMの読み込みが完了したら初期化
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // デバッグ用
    window.dumpList = dumpList;
    window.todoList = todoList;
    window.completedList = completedList;
    window.tabManager = tabManager;
});
