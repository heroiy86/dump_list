const fs = require('fs-extra');
const path = require('path');

// Define source and destination directories
const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// List of files and directories to copy
const filesToCopy = [
    'index.html',
    'styles',
    'components',
    'utils'
];

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Function to copy files and directories
async function copyFiles() {
    try {
        // Copy each file/directory
        for (const file of filesToCopy) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(distDir, file);
            
            console.log(`Copying ${srcPath} to ${destPath}`);
            await fs.copy(srcPath, destPath, { overwrite: true });
        }

        // Copy app.js to the root of dist directory
        const appJsPath = path.join(distDir, 'app.js');
        
        // Read the original app.js content
        let appJsContent = `
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
    const activeInput = document.getElementById('${hash}Input');
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
        `;
        
        // Write the app.js file
        await fs.writeFile(appJsPath, appJsContent.trim(), 'utf8');
        
        console.log('Build completed successfully!');
    } catch (err) {
        console.error('Error during build:', err);
        process.exit(1);
    }
}

// Run the build
copyFiles();
