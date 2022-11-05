import { compareAsc, format } from 'date-fns'
import { th } from 'date-fns/locale';

//=> '2014-02-11'

(function(){

    // ================ Model ======================

    const toDoListModel = {

        submitTasksToStorage: function() {

            let arrayOfIndex = [];

            let lastIndex;

            if(localStorage.length==0){
                lastIndex = 0;
            }
            
            // get a complete array of indexes
            Object.keys(localStorage).forEach(function(key){
                let localStorageKey = localStorage.getItem(key);
                let parsedLocalStorageObj = JSON.parse(localStorageKey);
                arrayOfIndex.push(parsedLocalStorageObj['task-id']);
             });
            
             /* find the highest id inside the array of indexes to then
             calculate the index of the next item to submit to the local
             storage
             */ 
             if(localStorage.length!= 0){
                lastIndex = Math.max(...arrayOfIndex);
            }

             let taskObject = {
                'task-id':lastIndex+1,
                'task-name':toDoListView.cacheDom().task_name,
                'task-description':toDoListView.cacheDom().task_description,
                'task-deadline':toDoListView.cacheDom().task_deadline,
                'task-status':'pending',
                'task-priority':toDoListView.cacheDom().task_priority,
                'task-timestamp':format(new Date(), 'dd-MM-yyyy HH:mm:ss')
            }
                
            localStorage.setItem(lastIndex+1,JSON.stringify(taskObject));   
            
        },

        submitProjectToStorage: function() {
            
        }
    }

    // ================ Controller ==================
    const toDoList = {

        init: function(){
            toDoListView.init();
        },

        getCurrentTasks: function(){

            let listStorageArr = [];
            let index = 1;
            
            for(var i in localStorage){
                if(localStorage.hasOwnProperty(i)){
                    let localStorageObj = localStorage[i];
                    let parsedLocalStorageObj = JSON.parse(localStorageObj);
                    if(parsedLocalStorageObj['task-status']=='pending'){
                        listStorageArr.push(parsedLocalStorageObj);
                    }
                }
            }

            listStorageArr.sort((a, b) => {
                return a['task-id'] - b['task-id'];
            });

            return listStorageArr
        },

        getLastAddedTask: function(){

            let listStorageArr = this.getCurrentTasks();

            let lastItemAdded = listStorageArr[listStorageArr.length-1];
            
            let lastItemAddedArr = [];

            lastItemAddedArr.push(lastItemAdded)
            
            return lastItemAddedArr
        },

        saveTaskAndDisplayIt:function(){
            toDoListModel.submitTasksToStorage();
            toDoListView.displayLastAddedTask();
        },

        saveProjectAndDisplayIt: function(){

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
            let save_project = document.querySelector('.save-project');
            let cancel_project = document.querySelector('.cancel-project');
            let new_project_fields = document.querySelector('.new-project-fields');

            let task_name = document.querySelector('.task-name').value;
            let task_description = document.querySelector('.task-description').value;
            let task_deadline = document.querySelector('.task-deadline').value;
            let task_status = document.querySelector('.task-status').value;
            let task_priority = document.querySelector('#task-priority').value;

            let button_delete = document.querySelectorAll('.button-delete');
           
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
                task_priority,
                save_project,
                cancel_project,
                new_project_fields
            }
        },

        createdDom: function(){
            
        },

        bindEvents: function() {

            toDoListView.cacheDom().add_task_button.addEventListener('click',toDoListView.showAddTaskCollapsible);
            toDoListView.cacheDom().cancel_task.addEventListener('click',toDoListView.hideAddTaskCollapsible);
            toDoListView.cacheDom().save_task.addEventListener('click',toDoList.saveTaskAndDisplayIt);
            toDoListView.cacheDom().add_project_button.addEventListener('click',toDoListView.showAddProjectCollapsible);
            toDoListView.cacheDom().cancel_project.addEventListener('click',toDoListView.hideAddProjectCollapsible);
        },

        bindEventsCreatedTasks: function(){

        },

        render: function(tasksToLoad){

            var listStorageArr = [];
                
            if (tasksToLoad== "renderAllTasks"){

                listStorageArr = toDoList.getCurrentTasks();
            
            } else if(tasksToLoad == "renderOneTask"){

                listStorageArr = toDoList.getLastAddedTask();
            }

            listStorageArr.forEach(element => {
                
                if(element!= null){

                    if(element['task-status']=="pending") {

                        let create_new_added_fields = document.createElement('div');
                        create_new_added_fields.classList.add('new-added-fields');
                        toDoListView.cacheDom().tasks.appendChild(create_new_added_fields);
                        create_new_added_fields.addEventListener('click',this.hideOrShowDescription);

                        let create_task_high_view = document.createElement('div');
                        create_task_high_view.classList.add('task-high-view');
                        create_new_added_fields.appendChild(create_task_high_view);
                        
                        let create_task_name = document.createElement('div')
                        create_task_name.classList.add('task-name');
                        create_task_name.textContent = element['task-name'];
                        create_task_high_view.appendChild(create_task_name);
                        
                        let create_task_description = document.createElement('div');
                        create_task_description.classList.add('task-description-hidden');
                        create_task_description.textContent = element['task-description'];
                        create_new_added_fields.appendChild(create_task_description);
                        
                        let create_task_interaction = document.createElement('div');
                        create_task_interaction.classList.add('task-interaction');
                        create_new_added_fields.appendChild(create_task_interaction);
            
                        let create_button_delete = document.createElement('button');
                        create_button_delete.classList.add('button-delete','material-symbols-outlined');
                        create_button_delete.textContent = 'delete';
                        create_task_interaction.appendChild(create_button_delete);
                        create_button_delete.addEventListener('click',toDoListView.addEventToDeleteButton);
        
                        let create_button_complete = document.createElement('button');
                        create_button_complete.classList.add('button-complete','material-symbols-outlined');
                        create_button_complete.textContent = 'task';
                        create_task_interaction.appendChild(create_button_complete);
                        create_button_complete.addEventListener('click',toDoListView.addEventToCompleteButton);
        
                        let create_task_details = document.createElement('div');
                        create_task_details.classList.add('task-details');
                        create_new_added_fields.appendChild(create_task_details);
            
                        let create_task_deadline = document.createElement('div');
                        create_task_deadline.classList.add('task-deadline');
                        console.log(element['task-deadline']);
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
        
                        let create_task_id = document.createElement('div');
                        create_task_id.classList.add('task-id');
                        create_task_id.textContent = element['task-id'];
                        create_task_details.appendChild(create_task_id);
                    }
                }
            });
        },

        showAddTaskCollapsible: function(){
            toDoListView.cacheDom().new_task_fields.classList.add('active-new-task-fields');
        },

        hideAddTaskCollapsible: function() {
            toDoListView.cacheDom().new_task_fields.classList.remove('active-new-task-fields');
        },

        addEventToDeleteButton: function(){
            let task_parsed_info = this.parentNode.parentNode;
            let task_parsed_details = task_parsed_info.querySelector('.task-details');
            let task_parsed_id = task_parsed_details.querySelector('.task-id').textContent;
            localStorage.removeItem(task_parsed_id);
            task_parsed_info.remove();
        },

        addEventToCompleteButton: function(){

            let task_parsed_info = this.parentNode.parentNode;
            let task_parsed_details = task_parsed_info.querySelector('.task-details');
            let task_parsed_status = task_parsed_details.querySelector('.task-status');
            let task_parsed_id = task_parsed_details.querySelector('.task-id').textContent;
            
            let localStorageObjToModify = localStorage.getItem(task_parsed_id);
            let localStorageObjModified = JSON.parse(localStorageObjToModify);
            localStorageObjModified['task-status']="complete";
            localStorage.setItem(task_parsed_id,JSON.stringify(localStorageObjModified));   
            
        },

        showAddProjectCollapsible: function(){
            toDoListView.cacheDom().new_project_fields.classList.add('active-new-project-fields');
        },

        hideAddProjectCollapsible: function() {
            toDoListView.cacheDom().new_project_fields.classList.remove('active-new-project-fields');
        },

        saveProject: function(){

        },

        cancelProject: function(){

        },

        displayStoredTasks: function(){

            toDoListView.render("renderAllTasks");            
        
        },

        displayLastAddedTask: function(){
            
            toDoListView.render("renderOneTask");

        },

        hideOrShowDescription: function() {
            let task_info = this;
            let task_description_field = task_info.querySelector('.task-description-hidden');
            if (task_description_field.classList.contains('task-description-shown')){
                task_description_field.classList.remove('task-description-shown')
            } else{
                task_description_field.classList.add('task-description-shown'); 
            }
        },

        cleanInputsWithTaskAfterSubmit: function() {

        }
    }

toDoList.init();

})();
