export class TabManager {
    constructor() {
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

    initializeTabs() {
        const tabContainer = document.getElementById('tabContainer');
        if (!tabContainer) return;

        // Create tab buttons
        this.tabs.forEach(tab => {
            const button = document.createElement('button');
            button.className = `flex-1 py-3 px-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                this.activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-blue-500'
            }`;
            button.innerHTML = `<i class="fas fa-${tab.icon} mr-1"></i>${tab.label}`;
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
            button.classList.toggle('bg-white', isActive);
            button.classList.toggle('text-blue-600', isActive);
            button.classList.toggle('border-t', isActive);
            button.classList.toggle('border-l', isActive);
            button.classList.toggle('border-r', isActive);
            button.classList.toggle('border-gray-200', isActive);
            button.classList.toggle('text-gray-500', !isActive);
            button.classList.toggle('hover:text-gray-700', !isActive);
            button.classList.toggle('hover:bg-gray-100', !isActive);
        });

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            const shouldShow = content.id === `${tabId}Content`;
            content.style.display = shouldShow ? 'block' : 'none';
        });

        // Focus the input field of the active tab
        const activeInput = document.getElementById(`${tabId}Input`);
        if (activeInput) {
            setTimeout(() => {
                activeInput.focus();
                // Ensure the tab is scrolled into view on mobile
                activeInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 0);
        }
    }
}
