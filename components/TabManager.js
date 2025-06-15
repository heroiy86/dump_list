export class TabManager {
    constructor(dumpList, todoList, completedList) {
        this.dumpList = dumpList;
        this.todoList = todoList;
        this.completedList = completedList;
        this.activeTab = 'dump';
        this.eventListeners = [];
        this.setupEventListeners();
        this.initializeTabs();
        this.loadInitialContent();
    }

    setupEventListeners() {
        // Remove any existing event listeners
        this.cleanupEventListeners();
        
        // 上部タブ
        document.querySelectorAll('.tab-button').forEach(button => {
            const handler = () => this.switchTab(button.dataset.tab);
            button.addEventListener('click', handler);
            this.eventListeners.push({ element: button, type: 'click', handler });
        });

        // 下部タブ
        document.querySelectorAll('.bottom-tab-button').forEach(button => {
            const handler = () => this.switchTab(button.dataset.tab);
            button.addEventListener('click', handler);
            this.eventListeners.push({ element: button, type: 'click', handler });
        });

        // リスト追加ボタン
        document.getElementById('dumpAddButton')?.addEventListener('click', () => {
            const input = document.getElementById('dumpInput');
            if (input?.value.trim()) {
                this.dumpList.addItem(input.value.trim());
                input.value = '';
                input.style.height = 'auto';
                input.focus();
                this.renderActiveTabContent();
            }
        });

        // エンターキーで追加（Shift+Enterで改行）
        document.getElementById('dumpInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (e.target.value.trim()) {
                    this.dumpList.addItem(e.target.value.trim());
                    e.target.value = '';
                    e.target.style.height = 'auto';
                    this.renderActiveTabContent();
                }
            }
        });

        // テキストエリアの自動リサイズ
        const dumpInput = document.getElementById('dumpInput');
        if (dumpInput) {
            dumpInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 20 * 16) + 'px'; // 20行まで
            });
        }
    }

    async switchTab(tabId) {
        try {
            if (this.isSwitching || this.activeTab === tabId) return;
            this.isSwitching = true;
            
            this.showDebugInfo(`Switching to tab: ${tabId}`);
            
            // Update active tab
            const prevTab = this.activeTab;
            this.activeTab = tabId;
            
            // Update tab buttons
            this.updateTabButtons();
            
            // Get tab elements
            const prevContent = document.querySelector(`#${prevTab}Content`);
            const newContent = document.querySelector(`#${tabId}Content`);
            
            if (!newContent) {
                throw new Error(`Tab content not found for: ${tabId}`);
            }
            
            // Hide current content with slide out
            if (prevContent) {
                prevContent.classList.remove('active');
                prevContent.style.pointerEvents = 'none';
            }
            
            // Show new content with slide in
            newContent.classList.add('active');
            newContent.style.pointerEvents = 'auto';
            
            // Update URL hash without page scroll
            history.pushState(null, null, `#${tabId}`);
            
            // Force render the new content
            this.showDebugInfo(`Switched to tab: ${tabId}`);
            
            // Trigger render for the active tab's list
            this.renderActiveTabContent();
            
        } catch (error) {
            console.error('Error switching tabs:', error);
            this.showDebugInfo(`Error: ${error.message}`);
        } finally {
            this.isSwitching = false;
        }
    }

    initializeTabs() {
        // Hide all tab contents first
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Show active tab
        const activeTab = document.querySelector(`#${this.activeTab}Content`);
        if (activeTab) {
            activeTab.style.display = 'block';
        }
        
        // Update tab buttons
        this.updateTabButtons();
    }

    updateTabButtons() {
        // Update main tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            const isActive = button.dataset.tab === this.activeTab;
            button.classList.toggle('active', isActive);
            button.classList.toggle('text-blue-600', isActive);
            button.classList.toggle('bg-blue-50', isActive);
        });
    }
    
    renderActiveTabContent() {
        // Only render the active tab's content for better performance
        switch(this.activeTab) {
            case 'dump':
                this.dumpList?.render();
                break;
            case 'todo':
                this.todoList?.render();
                break;
            case 'completed':
                this.completedList?.render();
                break;
        }
    }

    loadInitialContent() {
        console.log('Loading initial content...');
        try {
            this.dumpList.render();
            this.todoList.render();
            this.completedList.render();
            console.log('Initial content loaded');
        } catch (error) {
            console.error('Error loading initial content:', error);
            this.showDebugInfo('Error loading content: ' + error.message);
        }
    }
    
    showDebugInfo(message) {
        const debugInfo = document.getElementById('debugInfo');
        if (debugInfo) {
            debugInfo.innerHTML += `<p>${new Date().toLocaleTimeString()}: ${message}</p>`;
            debugInfo.scrollTop = debugInfo.scrollHeight;
        }
        console.log(message);
    }

    setupTooltips() {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            const mouseEnterHandler = (e) => {
                const tooltiptext = tooltip.querySelector('.tooltiptext');
                if (tooltiptext) {
                    tooltiptext.style.visibility = 'visible';
                    tooltiptext.style.opacity = '1';
                }
            };
            
            const mouseLeaveHandler = (e) => {
                const tooltiptext = tooltip.querySelector('.tooltiptext');
                if (tooltiptext) {
                    tooltiptext.style.visibility = 'hidden';
                    tooltiptext.style.opacity = '0';
                }
            };
            
            tooltip.addEventListener('mouseenter', mouseEnterHandler);
            tooltip.addEventListener('mouseleave', mouseLeaveHandler);
            
            this.eventListeners.push(
                { element: tooltip, type: 'mouseenter', handler: mouseEnterHandler },
                { element: tooltip, type: 'mouseleave', handler: mouseLeaveHandler }
            );
        });
    }
    
    cleanupEventListeners() {
        // Remove all registered event listeners
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];
    }
    
    dispose() {
        this.cleanupEventListeners();
        // Clean up any other resources if needed
    }
}
