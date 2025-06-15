import { TabManager } from './components/TabManager.js';
import { DumpList } from './components/DumpList.js';
import { TodoList } from './components/TodoList.js';
import { CompletedList } from './components/CompletedList.js';

// Global variables
let dumpList, todoList, completedList, tabManager;

// Initialize the application
function initApp() {
    try {
        console.log('Initializing application...');
        
        // Initialize tab manager
        tabManager = new TabManager(['dump', 'todo', 'completed']);
        
        // Initialize lists
        dumpList = new DumpList(tabManager);
        todoList = new TodoList(tabManager);
        completedList = new CompletedList(tabManager);
        
        // Handle hash changes
        window.addEventListener('hashchange', handleHashChange);
        
        // Initial render
        handleHashChange();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Handle hash changes
function handleHashChange() {
    const hash = window.location.hash.substring(1) || 'dump';
    tabManager.switchTab(hash);
    
    // Focus the input field of the active tab
    const activeInput = document.getElementById(`${hash}Input`);
    if (activeInput) {
        setTimeout(() => {
            activeInput.focus();
        }, 100);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Debug
    window.dumpList = dumpList;
    window.todoList = todoList;
    window.completedList = completedList;
    window.tabManager = tabManager;
});
