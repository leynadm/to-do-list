(function(){

    let listStorage = [];
    
    // ================ Model ======================

    const toDoListModel = {

        submitTasksToStorage: function() {

                console.log('saved');

            var taskObject = {
                'task-name':toDoListView.cacheDom().task_name,
                'task-description':toDoListView.cacheDom().task_description,
                'task-deadline':toDoListView.cacheDom().task_deadline,
                'task-status':toDoListView.cacheDom().task_status,
                'task-priority':toDoListView.cacheDom().task_priority
            }

            localStorage.setItem('taskObject',JSON.stringify(taskObject));
        
        }
    }

    // ================ Controller ==================
    const toDoList = {

        init: function(){

            toDoListView.init();
        },

        getCurrentTasks: function(){
            Object.keys(localStorage).forEach(function(key){
                console.log(localStorage.getItem(key));
            });
        },

        getDOMItems: function(){

        },

        



    };


    // ================ View ======================
    const toDoListView = {

        init: function(){
            this.cacheDom();
            this.bindEvents();
            this.render();
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
            let task_priority = document.querySelector('.task-priority').value;

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

        bindEvents: function() {

            toDoListView.cacheDom().add_task_button.addEventListener('click',toDoListView.showAddTaskCollapsible);
            toDoListView.cacheDom().cancel_task.addEventListener('click',toDoListView.hideAddTaskCollapsible);
            toDoListView.cacheDom().save_task.addEventListener('click',toDoListModel.submitTasksToStorage);
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

        }
        
    }

toDoList.init();

})();
