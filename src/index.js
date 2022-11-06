import { compareAsc, format } from 'date-fns'
import { th } from 'date-fns/locale';

//=> '2014-02-11'

(function(){

    // ================ Model ======================

    const toDoListModel = {

        submitTasksToStorage: function(taskType) {
            
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


            if(taskType == "standard"){
                let taskObject = {
                    'task-type': 'standard',
                    'task-id':lastIndex+1,
                    'task-name':toDoListView.cacheDom().task_name,
                    'task-description':toDoListView.cacheDom().task_description,
                    'task-deadline':toDoListView.cacheDom().task_deadline,
                    'task-status':'pending',
                    'task-priority':toDoListView.cacheDom().task_priority,
                    'task-timestamp':format(new Date(), 'dd-MM-yyyy HH:mm:ss')

                }
                
                localStorage.setItem(lastIndex+1,JSON.stringify(taskObject));   
                
            } else if(taskType == "project"){
                let taskObject = {
                    'task-type': 'project',
                    'task-status': 'pending',
                    'task-id':lastIndex+1,
                    'task-name':toDoListView.cacheDom().project_name,
                }

                localStorage.setItem(lastIndex+1,JSON.stringify(taskObject));   
            }   
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
            toDoListModel.submitTasksToStorage("standard");
            toDoListView.displayLastAddedTask();
        },

        saveProjectAndDisplayIt: function(){
            toDoListModel.submitTasksToStorage("project");
            toDoListView.displayLastProjectAdded();
        }

    };

    // ================ View ======================
    const toDoListView = {

        init: function(){
            this.cacheDom();
            this.bindEvents();
            this.render();
            this.renderProjects();
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
            let project_name = document.querySelector('.project-name').value;
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
                new_project_fields,
                project_name
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
            toDoListView.cacheDom().save_project.addEventListener('click',toDoList.saveProjectAndDisplayIt);
        },

        bindEventsCreatedTasks: function(){

        },

        render: function(tasksToLoad){

            var listStorageArr = [];
                
            if (tasksToLoad== "renderAllTasks"){

                listStorageArr = toDoList.getCurrentTasks();
            
            } else if(tasksToLoad == "renderOneTask"){

                listStorageArr = toDoList.getLastAddedTask();

            } else if (tasksToLoad == "tasksInProjects"){

                listStorageArr = toDoList.getCurrentTasks();
            }

            listStorageArr.forEach(element => {
                
                if(element['task-type']=="standard"){

                    if(element['task-status']=="pending") {


                        if(tasksToLoad == "tasksInProjects"){

                        }

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

        renderProjects: function(){

            var listStorageArr = [];

            listStorageArr = toDoList.getCurrentTasks();
     
            listStorageArr.forEach(element => {

                if (element['task-type']=="project"){
                    
                    let current_project = element['task-name'];

                    let create_new_added_project = document.createElement('div');
                    create_new_added_project.classList.add('new-added-project');
                    toDoListView.cacheDom().projects.appendChild(create_new_added_project); 

                    let current_project_header = document.createElement('div');
                    current_project_header.classList.add('new-project-header');
                    create_new_added_project.appendChild(current_project_header);

                    let create_project_name = document.createElement('div');
                    create_project_name.classList.add('new-project-name');
                    create_project_name.textContent = element['task-name'].toUpperCase();
                    current_project_header.appendChild(create_project_name);

                    let create_project_utility_buttons = document.createElement('div');
                    create_project_utility_buttons.classList.add('new-project-utility-buttons');
                    current_project_header.appendChild(create_project_utility_buttons);

                    let delete_project = document.createElement('button');
                    delete_project.classList.add('delete-project','material-symbols-outlined');
                    delete_project.textContent = 'delete';
                    delete_project.addEventListener('click',toDoListView.deleteProject);
                    create_project_utility_buttons.appendChild(delete_project);

                    let add_task_to_project = document.createElement('button');
                    add_task_to_project.classList.add('add-task-to-project','material-symbols-outlined');
                    add_task_to_project.textContent = 'add';
                    add_task_to_project.addEventListener('click',toDoListView.addTaskToProject);
                    create_project_utility_buttons.appendChild(add_task_to_project);

                
                    listStorageArr.forEach(element => {
                        
                        if(element['task-name']==current_project){
                            
                            

                        }

                    });
                
                }

            });

        },

        renderTasksInProject: function(){

            toDoListView.render("tasksInProjects");

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
            
            let current_project_add_collapsible = this.parentNode.parentNode;
            current_project_add_collapsible.classList.add('new-task-fields');
            console.log(current_project_add_collapsible);
            current_project_add_collapsible.classList.remove('active-new-task-fields');
            //current_project_add_collapsible.remove();
        
        },

        addTaskToProject: function(){

            console.log(this.parentNode.parentNode.parentNode);
            let project_to_append_to = this.parentNode.parentNode.parentNode;
            
            let dynamic_new_task_fields = document.createElement('div');
            dynamic_new_task_fields.classList.add('active-new-task-fields');
            project_to_append_to.appendChild(dynamic_new_task_fields);

            let dynamic_task_name = document.createElement('input');
            dynamic_task_name.type="text";
            dynamic_task_name.classList.add('task-name');
            dynamic_task_name.placeholder='Your task description...';
            dynamic_new_task_fields.appendChild(dynamic_task_name);

            let dynamic_task_description = document.createElement('input');
            dynamic_task_description.type="text";
            dynamic_task_description.classList.add('task-description');
            dynamic_task_description.placeholder='Your task description here...';
            dynamic_new_task_fields.appendChild(dynamic_task_description);

            let dynamic_task_status = document.createElement('input');
            dynamic_task_status.type="hidden";
            dynamic_task_status.classList.add('task-status');
            dynamic_task_status.textContent = "pending";
            dynamic_new_task_fields.appendChild(dynamic_task_status);

            let dynamic_task_priority = document.createElement('input');
            dynamic_task_priority.type="hidden";
            dynamic_task_priority.classList.add('task-priority');
            dynamic_task_priority.textContent = "pending";
            dynamic_new_task_fields.appendChild(dynamic_task_priority);
          
            let dynamic_task_buttons = document.createElement('div');
            dynamic_task_buttons.classList.add('task-buttons');
            dynamic_new_task_fields.appendChild(dynamic_task_buttons);

            let dynamic_time_inputs = document.createElement('div');
            dynamic_time_inputs.classList.add('time-inputs');
            dynamic_task_buttons.appendChild(dynamic_time_inputs);

            let dynamic_task_deadline = document.createElement('input');
            dynamic_task_deadline.classList.add('task-deadline');
            dynamic_task_deadline.type = "date";
            dynamic_time_inputs.appendChild(dynamic_task_deadline);

            let dynamic_task_list_priority_options = ['Oh, Sh#t!','Sometimes soon','Meh'];
            
            let dynamic_task_list_priority = document.createElement('input');
            dynamic_task_list_priority.type = 'list';
            dynamic_task_list_priority.id = 'task-priority';
            dynamic_task_list_priority.setAttribute('list','priority');
            dynamic_time_inputs.appendChild(dynamic_task_list_priority);

            /*
            let dynamic_task_list_priority_dtlst = document.createElement('datalist');
            dynamic_task_list_priority_dtlst.id = 'task-priority'
            
            dynamic_task_list_priority_options.forEach(function(item){
                var option = document.createElement('option');
                option.value = item;
                dynamic_task_list_priority.appendChild(option);
            });

            let dynamic_task_list_datalist = document.createElement('datalist');
            dynamic_task_list_datalist.
            dynamic_time_inputs.appendChild(dynamic_task_list_priority);
            */
            
            let dynamic_utility_buttons = document.createElement('div');
            dynamic_utility_buttons.classList.add('utility-buttons');
            dynamic_task_buttons.appendChild(dynamic_utility_buttons);

            let dynamic_save_task = document.createElement('button');
            dynamic_save_task.classList.add('save-task','material-symbols-outlined');
            dynamic_save_task.textContent = 'add_task';
            dynamic_save_task.addEventListener('click',toDoListView.addTaskToProject);
            dynamic_task_buttons.appendChild(dynamic_save_task);

            let dynamic_cancel_task = document.createElement('button');
            dynamic_cancel_task.classList.add('cancel-task','material-symbols-outlined');
            dynamic_cancel_task.textContent = 'cancel';
            dynamic_cancel_task.addEventListener('click',toDoListView.hideAddProjectCollapsible);
            dynamic_task_buttons.appendChild(dynamic_cancel_task);

        },

        deleteProject: function(){

        },

        displayStoredTasks: function(){

            toDoListView.render("renderAllTasks");            
        
        },

        displayLastAddedTask: function(){
            
            toDoListView.render("renderOneTask");

        },

        displayLastProjectAdded: function(){
            toDoListView.renderProjects();
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

        },

        createNewTask: function(){
             
        }
    }

toDoList.init();

})();
