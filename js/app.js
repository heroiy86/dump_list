import { DumpList } from '../components/DumpList.js';
import { TodoList } from '../components/TodoList.js';
import { CompletedList } from '../components/CompletedList.js';
import { TabManager } from '../components/TabManager.js';

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize tab manager
        const tabManager = new TabManager();
        
        // Initialize list managers
        const dumpList = new DumpList();
        const todoList = new TodoList();
        const completedList = new CompletedList();
        
        // Initial render of all lists
        dumpList.render();
        todoList.render();
        completedList.render();
        
        // Auto-resize textareas
        document.querySelectorAll('textarea').forEach(textarea => {
            const resizeTextarea = () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            };
            
            textarea.addEventListener('input', resizeTextarea);
            // Initial resize
            resizeTextarea();
        });
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        alert('アプリケーションの初期化中にエラーが発生しました。ページを再読み込みしてください。');
    }
});

// Add global error handler
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
    alert(`エラーが発生しました: ${event.message}`);
    return false;
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});
