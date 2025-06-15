export class TabManager {
    constructor() {
        this.lists = {}; // Will store list instances
        this.tabs = [
            { 
                id: 'dump', 
                label: 'Dump',
                icon: 'inbox'
            },
            { 
                id: 'todo', 
                label: 'ToDo',
                icon: 'tasks'
            },
            { 
                id: 'completed', 
                label: '完了',
                icon: 'check-circle'
            }
        ];
        // Get active tab from URL hash or default to 'dump'
        const hash = window.location.hash.substring(1);
        this.activeTab = this.tabs.some(tab => tab.id === hash) ? hash : 'dump';
        this.initializeTabs();
        // Ensure the active tab is shown
        this.switchTab(this.activeTab);
    }
    
    // Initialize with list instances
    initialize(dumpList, todoList, completedList) {
        this.lists = {
            dump: dumpList,
            todo: todoList,
            completed: completedList
        };
        return this;
    }

    initializeTabs() {
        const tabContainer = document.getElementById('tabContainer');
        if (!tabContainer) return;

        // Create tab buttons
        this.tabs.forEach(tab => {
            const button = document.createElement('button');
            // Create a container for the button content
            const buttonContent = document.createElement('div');
            buttonContent.className = 'relative inline-block pb-2';
            
            // Add icon and label
            buttonContent.innerHTML = `
                <i class="fas fa-${tab.icon} mr-1"></i>${tab.label}
                <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transition-transform duration-300 transform scale-x-0 ${
                    this.activeTab === tab.id ? 'scale-x-100' : ''
                }"></span>
            `;
            
            // Set button styles
            button.className = `flex-1 py-3 px-2 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors duration-200`;
            if (this.activeTab === tab.id) {
                button.classList.add('text-blue-600');
            }
            
            // Append the button content
            button.innerHTML = '';
            button.appendChild(buttonContent);
            button.dataset.tab = tab.id;
            button.onclick = () => this.switchTab(tab.id);
            tabContainer.appendChild(button);
        });

        // Set initial active tab
        this.switchTab(this.activeTab);
    }

    switchTab(tabId) {
        // Update URL hash
        window.location.hash = tabId;
        
        // Update active tab state
        this.activeTab = tabId;
        
        // Update tab buttons
        document.querySelectorAll('#tabContainer button').forEach(button => {
            const isActive = button.dataset.tab === tabId;
            const underline = button.querySelector('span');
            
            // Update text color
            button.classList.toggle('text-blue-600', isActive);
            button.classList.toggle('text-gray-500', !isActive);
            button.classList.toggle('hover:text-blue-500', !isActive);
            
            // Update underline animation
            if (underline) {
                if (isActive) {
                    underline.classList.remove('scale-x-0');
                    underline.classList.add('scale-x-100');
                } else {
                    underline.classList.remove('scale-x-100');
                    underline.classList.add('scale-x-0');
                }
            }
        });
        
        // Show/hide tab contents with smooth transitions
        document.querySelectorAll('.tab-content').forEach(content => {
            const isActive = content.id === `${tabId}Content`;
            console.log(`Tab ${content.id}: isActive=${isActive}`);
            
            if (isActive) {
                // Show the active tab content
                console.log(`Showing tab ${content.id}`);
                content.style.display = 'block';
                // Force a reflow to ensure the transition works
                void content.offsetWidth;
                // Add the active class for the transition
                content.classList.add('active');
                console.log(`Classes after showing:`, content.className);
            } else {
                // Hide inactive tab contents
                console.log(`Hiding tab ${content.id}`);
                content.classList.remove('active');
                console.log(`Classes before hiding:`, content.className);
                // Wait for the transition to complete before hiding the element
                setTimeout(() => {
                    if (content.id !== `${tabId}Content` && !content.classList.contains('active')) {
                        console.log(`Setting display:none for ${content.id}`);
                        content.style.display = 'none';
                    }
                }, 300); // Match this with the CSS transition duration
            }
        });
        
        // Focus the input field if it exists
        const inputField = document.getElementById(`${tabId}Input`);
        if (inputField) {
            inputField.focus();
            // Ensure the tab is scrolled into view on mobile
            inputField.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}
