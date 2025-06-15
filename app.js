import { StorageManager } from './utils/StorageManager.js';
import { ListManager } from './components/ListManager.js';
import { DumpList } from './components/DumpList.js';
import { TodoList } from './components/TodoList.js';
import { CompletedList } from './components/CompletedList.js';
import { TabManager } from './components/TabManager.js';

// グローバル変数の初期化
const dumpList = new DumpList();
const todoList = new TodoList();
const completedList = new CompletedList();
const tabManager = new TabManager();

// DOMContentLoadedイベントでツールチップをセットアップ
document.addEventListener('DOMContentLoaded', () => {
    tabManager.setupTooltips();
});
