export class ListManager {
    constructor(key) {
        this.key = key;
        this.element = document.getElementById(`${key}List`);
        this.list = StorageManager.loadData(key);
    }

    addItem(text) {
        const item = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString()
        };
        
        this.list.push(item);
        StorageManager.saveData(this.key, this.list);
        this.render();
    }

    removeItem(id) {
        this.list = this.list.filter(item => item.id !== id);
        StorageManager.saveData(this.key, this.list);
        this.render();
    }

    render() {
        this.element.innerHTML = '';
        this.list.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center p-3 border-b border-gray-200 list-item';
            
            const content = document.createElement('div');
            content.className = 'flex-1';
            content.innerHTML = `
                <div class="text-gray-900">${item.text}</div>
                <div class="text-sm text-gray-500">${item.timestamp}</div>
            `;

            const actions = document.createElement('div');
            actions.className = 'flex space-x-2';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:text-red-700';
            deleteBtn.innerHTML = '削除';
            deleteBtn.onclick = () => this.removeItem(item.id);
            actions.appendChild(deleteBtn);

            li.appendChild(content);
            li.appendChild(actions);
            this.element.appendChild(li);
        });
    }
}
