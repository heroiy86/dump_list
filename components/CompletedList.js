import { ListManager } from './ListManager.js';
import { TodoList } from './TodoList.js';

export class CompletedList extends ListManager {
    constructor() {
        super('completed');
    }

    renderItems(fragment) {
        // Sort by completion date (newest first)
        const sortedItems = [...this.list].sort((a, b) => 
            new Date(b.completedAt) - new Date(a.completedAt)
        );

        sortedItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'group relative p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200';
            li.dataset.id = item.id;
            li.style.animationDelay = `${index * 50}ms`;
            li.classList.add('animate-fade-in');
            
            // Item content
            const content = document.createElement('div');
            content.className = 'mb-2';
            
            // Completed text with strikethrough
            const textDiv = document.createElement('div');
            textDiv.className = 'text-gray-500 line-through';
            textDiv.textContent = item.text;
            
            // Priority badge
            const priorityBadge = document.createElement('span');
            const priorityClasses = {
                high: 'bg-red-100 text-red-800',
                medium: 'bg-yellow-100 text-yellow-800',
                low: 'bg-green-100 text-green-800'
            };
            const priorityLabels = {
                high: '高',
                medium: '中',
                low: '低'
            };
            
            priorityBadge.className = `text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-2 ${
                priorityClasses[item.originalPriority] || 'bg-gray-100 text-gray-800'
            }`;
            priorityBadge.textContent = priorityLabels[item.originalPriority] || item.originalPriority;
            
            // Completion date
            const dateDiv = document.createElement('div');
            dateDiv.className = 'text-xs text-gray-400 mt-1 flex items-center';
            
            const completionDate = item.completedAt ? new Date(item.completedAt) : new Date();
            const formattedDate = completionDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            dateDiv.innerHTML = `
                <i class="far fa-check-circle mr-1"></i>
                <span>完了: ${formattedDate}</span>
            `;
            
            // Actions container - Always visible and better for mobile
            const actions = document.createElement('div');
            actions.className = 'flex justify-end space-x-2 mt-2';
            
            // Move back to Todo button - Always visible with icon
            const moveBackButton = document.createElement('button');
            moveBackButton.className = 'bg-blue-500 text-white text-xs px-2 py-1 rounded shadow';
            moveBackButton.innerHTML = '<i class="fas fa-arrow-left mr-1"></i>戻す';
            moveBackButton.onclick = (e) => {
                e.stopPropagation();
                this.moveBackToTodo(item.id);
            };
            
            // Delete button - Always visible with icon
            const deleteButton = document.createElement('button');
            deleteButton.className = 'bg-red-500 text-white text-xs px-2 py-1 rounded shadow';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                this.removeItem(item.id);
            };
            
            // Add action buttons
            actions.appendChild(moveBackButton);
            actions.appendChild(deleteButton);
            
            // Assemble the item
            content.appendChild(textDiv);
            content.appendChild(priorityBadge);
            content.appendChild(dateDiv);
            
            li.appendChild(content);
            li.appendChild(actions);
            fragment.appendChild(li);
        });
    }
    
    moveBackToTodo(id) {
        const item = this.findItem(id);
        if (!item) return;
        
        const todoList = new TodoList();
        this.moveItem(id, todoList, (item) => ({
            text: item.text,
            priority: item.originalPriority || 'medium',
            completed: false
        }));
    }
}
