export class TabManager {
    constructor() {
        this.tabs = [
            { id: 'dump', label: 'Dump List' },
            { id: 'todo', label: 'ToDo' },
            { id: 'completed', label: '完了済み' }
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
            button.className = `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                this.activeTab === tab.id 
                    ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`;
            button.textContent = tab.label;
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
