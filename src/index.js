import { compareAsc, format } from 'date-fns'

//=> '2014-02-11'

(function(){

    // ================ Model ======================

    const toDoListModel = {

        submitTasksToStorage: function() {

            let lastIndex = localStorage.length+1;
         
            let taskObject = {
                'task-name':toDoListView.cacheDom().task_name,
                'task-description':toDoListView.cacheDom().task_description,
                'task-deadline':toDoListView.cacheDom().task_deadline,
                'task-status':'pending',
                'task-priority':toDoListView.cacheDom().task_priority,
                'task-timestamp':format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            }

            localStorage.setItem(lastIndex,JSON.stringify(taskObject));   
            
        }
    }

    // ================ Controller ==================
    const toDoList = {

        init: function(){
            toDoListView.init();
        },

        getCurrentTasks: function(){

            let listStorageArr = [];
            let mappedListStorageArr = new Map();
            let localStorageKey;
            let index = 1;

            for(let i = 1;i <= localStorage.length;i++){
                let localStorageObj = localStorage.getItem(i);
                let parsedLocalStorageObj = JSON.parse(localStorageObj);
                listStorageArr.push(parsedLocalStorageObj);
            }

            return listStorageArr
        },

        getLastAddedTask: function(){

            let listStorageArr = this.getCurrentTasks();

            let lastItemAdded = listStorageArr[listStorageArr.length-1];
            return lastItemAdded
        },

        saveTaskAndDisplayIt:function(){
            toDoListModel.submitTasksToStorage();
            toDoListView.displayLastAddedTask();
        }

    };

    // ================ View ======================
    const toDoListView = {

        init: function(){
            this.cacheDom();
            this.bindEvents();
            this.render();
            this.displayStoredTasks();
        },

        cacheDom: function (){

            let new_task = document.querySelector('.new-task');
            let new_task_fields = document.querySelector('.new-task-fields');
            let task_container = document.querySelector('.task-container');
            let project_container = document.querySelector('.project-container');
            let tasks = document.querySelector('.tasks');
            let projects = document.querySelector('.projects');
            let add_task_button = document.querySelector('.add-task-button');
            let add_project_button = document.querySelector('.add-project-button');
            let save_task = document.querySelector('.save-task');
            let cancel_task = document.querySelector('.cancel-task');

            let task_name = document.querySelector('.task-name').value;
            let task_description = document.querySelector('.task-description').value;
            let task_deadline = document.querySelector('.task-deadline').value;
            let task_status = document.querySelector('.task-status').value;
            let task_priority = document.querySelector('#task-priority').value;

            return{
                new_task,
                new_task_fields,
                task_container,
                project_container,
                tasks,
                projects,
                add_task_button,
                add_project_button,
                save_task,
                cancel_task,
                task_name,
                task_description,
                task_deadline,
                task_status,
                task_priority
            }
        },

        createdDom: function(){
            
        },

        bindEvents: function() {

            toDoListView.cacheDom().add_task_button.addEventListener('click',toDoListView.showAddTaskCollapsible);
            toDoListView.cacheDom().cancel_task.addEventListener('click',toDoListView.hideAddTaskCollapsible);
            toDoListView.cacheDom().save_task.addEventListener('click',toDoList.saveTaskAndDisplayIt);
        },

        render: function(){

        },

        showAddTaskCollapsible: function(){
            toDoListView.cacheDom().new_task_fields.classList.add('active-new-task-fields');
        },

        hideAddTaskCollapsible: function() {
            toDoListView.cacheDom().new_task_fields.classList.remove('active-new-task-fields');
        },

        displayStoredTasks: function(){


            let listStorageArr = toDoList.getCurrentTasks();

            listStorageArr.forEach(element => {

                let create_new_added_fields = document.createElement('div');
                create_new_added_fields.classList.add('new-added-fields');
                toDoListView.cacheDom().tasks.appendChild(create_new_added_fields);
                
                let create_task_high_view = document.createElement('div');
                create_task_high_view.classList.add('task-high-view');
                create_new_added_fields.appendChild(create_task_high_view);

                let create_task_name = document.createElement('div')
                create_task_name.classList.add('task-name');
                create_task_name.textContent = element['task-name'];
                create_task_high_view.appendChild(create_task_name);
                
                let create_task_description = document.createElement('div');
                create_task_description.classList.add('task-description');
                create_task_description.textContent = element['task-description'];
                create_new_added_fields.appendChild(create_task_description);
                
                let create_task_interaction = document.createElement('div');
                create_task_interaction.classList.add('task-interaction');
                create_new_added_fields.appendChild(create_task_interaction);

                let create_button_delete = document.createElement('button');
                create_button_delete.classList.add('button-delete','material-symbols-outlined');
                create_button_delete.textContent = 'delete';
                create_task_interaction.appendChild(create_button_delete);

                let create_button_complete = document.createElement('button');
                create_button_complete.classList.add('button-complete','material-symbols-outlined');
                create_button_complete.textContent = 'task';
                create_task_interaction.appendChild(create_button_complete);

                let create_task_details = document.createElement('div');
                create_task_details.classList.add('task-details');
                create_new_added_fields.appendChild(create_task_details);

                let create_task_deadline = document.createElement('div');
                create_task_deadline.classList.add('task-deadline');
                create_task_deadline.textContent = element['task-deadline'];
                create_task_details.appendChild(create_task_deadline);

                let create_task_status = document.createElement('div');
                create_task_status.classList.add('task-status');
                create_task_status.textContent = element['task-status'];
                create_task_details.appendChild(create_task_status);

                let create_task_priority = document.createElement('div');
                create_task_priority.classList.add('task-priority');
                create_task_priority.textContent = element['task-priority'];
                create_task_details.appendChild(create_task_priority);
                
            });
        },

        displayLastAddedTask: function(){
            
            let lastAddedTask = toDoList.getLastAddedTask();

            let create_new_added_fields = document.createElement('div');
            create_new_added_fields.classList.add('new-added-fields');
            toDoListView.cacheDom().tasks.appendChild(create_new_added_fields);
            
            let create_task_high_view = document.createElement('div');
            create_task_high_view.classList.add('task-high-view');
            create_new_added_fields.appendChild(create_task_high_view);

            let create_task_name = document.createElement('div')
            create_task_name.classList.add('task-name');
            create_task_name.textContent = lastAddedTask['task-name'];
            create_task_high_view.appendChild(create_task_name);
            
            let create_task_description = document.createElement('div');
            create_task_description.classList.add('task-description');
            create_task_description.textContent = lastAddedTask['task-description'];
            create_new_added_fields.appendChild(create_task_description);
            
            let create_task_interaction = document.createElement('div');
            create_task_interaction.classList.add('task-interaction');
            create_new_added_fields.appendChild(create_task_interaction);

            let create_button_delete = document.createElement('button');
            create_button_delete.classList.add('button-delete','material-symbols-outlined');
            create_button_delete.textContent = 'delete';
            create_task_interaction.appendChild(create_button_delete);

            let create_button_complete = document.createElement('button');
            create_button_complete.classList.add('button-complete','material-symbols-outlined');
            create_button_complete.textContent = 'task';
            create_task_interaction.appendChild(create_button_complete);

            let create_task_details = document.createElement('div');
            create_task_details.classList.add('task-details');
            create_new_added_fields.appendChild(create_task_details);

            let create_task_deadline = document.createElement('div');
            create_task_deadline.classList.add('task-deadline');
            create_task_deadline.textContent = lastAddedTask['task-deadline'];
            create_task_details.appendChild(create_task_deadline);

            let create_task_status = document.createElement('div');
            create_task_status.classList.add('task-status');
            create_task_status.textContent = lastAddedTask['task-status'];
            create_task_details.appendChild(create_task_status);

            let create_task_priority = document.createElement('div');
            create_task_priority.classList.add('task-priority');
            create_task_priority.textContent = lastAddedTask['task-priority'];
            create_task_details.appendChild(create_task_priority);
           
        },

        cleanInputsWithTaskAfterSubmit: function() {

        }
    }

toDoList.init();

})();
