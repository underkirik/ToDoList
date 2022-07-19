$(function(){

    const appendTask = function(data){
        var divCode = '<div class="task" data-id="' + data.id + '">';
        var deleteBtn = '<button class="btn" id="delete-task">'
         + '<i class="fa fa-check-circle"></i></button>';
        var redactBtn = '<button class="btn" id="redact-task">'
         + '<i class="fa fa-pencil"></i></button>';
        var taskCode = '<a href="#" class="task-link" data-id="' +
            data.id + '">' + data.name + '</a>';
        $('#task-list')
            .append(divCode + taskCode + deleteBtn + redactBtn +'</div>');
    };

    //Delete All Tasks
    $(document).on('click', '#delete-all-tasks', function(){
        $.ajax({
            method: 'DELETE',
            url: '/tasks/',
            success: function(){
                $('#task-list').children().remove();
            }
        });
        return false;
    });

    //Show adding book form
    $('#show-add-task-form').click(function(){
        $('#task-form').css('display', 'flex');
        $('#save-task').css('display', 'flex');
        $('#redact-this-task').css('display', 'none');
    });

    //Closing adding task form
    $('#task-form').click(function(event){
        if(event.target === this) {
            $(this).css('display', 'none');
        }
    });

    //Getting task
    $(document).on('click', '.task-link', function(){
        var link = $(this);
        var taskId = link.data('id');
        $.ajax({
            method: "GET",
            url: '/tasks/' + taskId,
            success: function(response)
            {
                var startCode = '<span id="start-task" class="date">Начало задачи: ' + response.startTask + '</span>';
                var endCode = '<span id="end-task" class="date">  Окончание задачи: ' + response.endTask + '</span>';
                link.parent().append(startCode);
                link.parent().append(endCode);
            },
            error: function(response)
            {
                if(response.status == 404) {
                    alert('Задача не найдена!');
                }
            }
        });
        return false;
    });

    //Delete task
    $(document).on('click', '#delete-task', function(){
        var taskId = $(this).parent().attr("data-id");
        $('div[data-id="' + taskId + '"]').remove();
        $.ajax({
            method: "DELETE",
            url: '/tasks/' + taskId,
            success: function(){
                $('[data-id="' + taskId + '"').remove();
            }
        });
        return false;
    });

    //Redact Task
    $(document).on('click', '#redact-task', function(){
        $('#task-form').css('display', 'flex');
        $('#redact-this-task').css('display', 'flex');
        $('#save-task').css('display', 'none');
        var taskId = $(this).parent().attr("data-id");
        $.get('/tasks/' + taskId, function(response){
            $('input[name="name"]').val(response.name);
            $('input[name="startTask"]').val(response.startTask);
            $('input[name="endTask"]').val(response.endTask);
        })
        $('#redact-this-task').click(function(){
        var data = $('#task-form form').serialize();
            $.ajax({
                method: "PUT",
                url: '/tasks/' + taskId,
                data: data,
                success: function(response){
                    $('#task-form').css('display', 'none');
                    $('[data-id="' + taskId + '"').remove();
                    appendTask(response);
                },
                error: function(response) {
                    if(response.status == 404) {
                    alert('Задача не найдена!');
                    }
                }
            });
        return false;
        })
    })



    //Adding task
    $('#save-task').click(function()
    {
        var data = $('#task-form form').serialize();
        $.ajax({
            method: "POST",
            url: '/tasks/',
            data: data,
            success: function(response)
            {
                $('#task-form').css('display', 'none');
                var task = {};
                task.id = response;
                var dataArray = $('#task-form form').serializeArray();
                for(i in dataArray) {
                    task[dataArray[i]['name']] = dataArray[i]['value'];
                }
                appendTask(task);
            }
        });
        return false;
    });

});