export class TabManager {
    constructor(dumpList, todoList, completedList) {
        this.dumpList = dumpList;
        this.todoList = todoList;
        this.completedList = completedList;
        this.activeTab = 'dump';
        this.setupEventListeners();
        this.initializeTabs();
        this.loadInitialContent();
    }

    setupEventListeners() {
        // 上部タブ
        document.querySelectorAll('.tab-button').forEach(button => {
            button.onclick = () => this.switchTab(button.dataset.tab);
        });

        // 下部タブ
        document.querySelectorAll('.bottom-tab-button').forEach(button => {
            button.onclick = () => this.switchTab(button.dataset.tab);
        });

        // リスト追加ボタン
        document.getElementById('dumpAddButton').addEventListener('click', () => {
            const titleInput = document.getElementById('dumpTitleInput');
            const detailsInput = document.getElementById('dumpDetailsInput');
            
            if (titleInput.value.trim()) {
                dumpList.addItem(titleInput.value.trim(), detailsInput.value.trim());
                titleInput.value = '';
                detailsInput.value = '';
                titleInput.focus();
            }
        });

        // エンターキーで追加（タイトル入力中）
        document.getElementById('dumpTitleInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                const detailsInput = document.getElementById('dumpDetailsInput');
                dumpList.addItem(e.target.value.trim(), detailsInput.value.trim());
                e.target.value = '';
                detailsInput.value = '';
            }
        });

        // エンターキーで追加（詳細入力中）
        document.getElementById('dumpDetailsInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                const titleInput = document.getElementById('dumpTitleInput');
                if (titleInput.value.trim()) {
                    dumpList.addItem(titleInput.value.trim(), e.target.value.trim());
                    titleInput.value = '';
                    e.target.value = '';
                    titleInput.focus();
                }
            }
        });
    }

    async switchTab(tabId) {
        try {
            this.showDebugInfo(`Switching to tab: ${tabId}`);
            
            // Update active tab
            this.activeTab = tabId;
            
            // Update tab buttons
            this.updateTabButtons();
            
            // Get tab elements
            const currentContent = document.querySelector(`#${this.activeTab}Content`);
            const newContent = document.querySelector(`#${tabId}Content`);
            
            if (!newContent) {
                throw new Error(`Tab content not found for: ${tabId}`);
            }
            
            // Hide current content with fade out
            if (currentContent) {
                currentContent.style.opacity = '0';
                await new Promise(resolve => setTimeout(resolve, 150));
                currentContent.style.display = 'none';
            }
            
            // Show new content with fade in
            newContent.style.display = 'block';
            newContent.style.opacity = '0';
            
            // Force reflow
            newContent.offsetHeight;
            
            // Fade in
            newContent.style.opacity = '1';
            newContent.style.transition = 'opacity 150ms ease-in-out';
            
            this.showDebugInfo(`Switched to tab: ${tabId}`);
            
            // Update URL hash
            window.location.hash = tabId;
            
        } catch (error) {
            console.error('Error switching tabs:', error);
            this.showDebugInfo(`Error: ${error.message}`);
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
        document.querySelectorAll('.tab-button, .bottom-tab-button').forEach(button => {
            const isActive = button.dataset.tab === this.activeTab;
            button.classList.toggle('bg-blue-100', isActive);
            button.classList.toggle('text-blue-700', isActive);
            button.classList.toggle('border-blue-500', isActive);
        });
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
            tooltip.addEventListener('mouseenter', (e) => {
                const tooltiptext = tooltip.querySelector('.tooltiptext');
                if (tooltiptext) {
                    tooltiptext.style.visibility = 'visible';
                    tooltiptext.style.opacity = '1';
                }
            });

            tooltip.addEventListener('mouseleave', (e) => {
                const tooltiptext = tooltip.querySelector('.tooltiptext');
                if (tooltiptext) {
                    tooltiptext.style.visibility = 'hidden';
                    tooltiptext.style.opacity = '0';
                }
            });
        });
    }
}
