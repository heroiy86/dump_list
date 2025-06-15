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
        
        // インスタンスの初期化
        const dumpList = new DumpList();
        const todoList = new TodoList();
        const completedList = new CompletedList();
        const tabManager = new TabManager(dumpList, todoList, completedList);
        
        // デバッグ用にグローバルに公開
        window.app = {
            dumpList,
            todoList,
            completedList,
            tabManager
        };
        
        console.log('Application initialized successfully');
        
        // 初期レンダリングを実行
        setTimeout(() => {
            dumpList.render();
            todoList.render();
            completedList.render();
        }, 100);
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        const debugInfo = document.getElementById('debugInfo');
        if (debugInfo) {
            debugInfo.innerHTML += `<p class="text-red-500">初期化エラー: ${error.message}</p>`;
        }
    }
}

// DOMの読み込みが完了したら初期化
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // ハッシュに基づいてタブを切り替え
    if (window.location.hash) {
        const tabId = window.location.hash.substring(1);
        if (tabManager && tabManager.switchTab) {
            tabManager.switchTab(tabId);
        }
    }
});
