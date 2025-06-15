export class TabManager {
    constructor() {
        this.activeTab = 'dump';
        this.setupEventListeners();
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
        // タブボタンの更新
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        document.querySelectorAll('.bottom-tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        // コンテンツの切り替え
        const currentContent = document.querySelector(`#${this.activeTab}Content`);
        const newContent = document.querySelector(`#${tabId}Content`);

        // 現在のコンテンツをフェードアウト
        currentContent.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 300));
        currentContent.classList.add('hidden');

        // 新しいコンテンツを表示
        newContent.classList.remove('hidden');
        newContent.style.opacity = '0';
        newContent.style.display = 'block';
        
        // フェードインアニメーション
        requestAnimationFrame(() => {
            newContent.style.opacity = '1';
        });

        this.activeTab = tabId;
    }

    loadInitialContent() {
        dumpList.render();
        todoList.render();
        completedList.render();
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
