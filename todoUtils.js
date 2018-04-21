$(()=>{
    let todos = []

    $('#todo-input').change(() => {
        const text = $('#todo-post [name=todo]').val()
        addTodo(text)
        showTodo()
        $('#todo-post [name=todo]').val('')
    })

    function addTodo(text){
        todos.push({'text': text, 'isDone': false})
    }

    function showTodo(){
        $('.todo').remove()
        for(let i = 0; i < todos.length; i++){
            $('#todo-list').append(
                '<div class="todo">' +
                '   <input type="checkbox" name="todo" class="todo-done" value="'+i+'">' +
                '   <span class="text">' + todos[i].text + '</span>' +
                '   <button class="todo-delete" value="' + i + '">×</button>' +
                '</div>'
            )
        }
    }

    function refreshTodoDone(){
        const checkedIndex = $(".todo input[name=todo]:checked").map((i, elem) => {
            return parseInt($(elem).val())
        }).toArray()
        for(let i = 0; i < todos.length; i++){
            todos[i].isDone = jQuery.inArray(i, checkedIndex) !== -1
        }
    }

    // チェックボックス関連

    $('#all').change(() => {
        $('.todo-done[name=todo]').prop('checked', $('#all').prop('checked'))
        refreshTodoDone()
    })

    $(document).on('click', '.todo-done', (e) => {
        const index = parseInt($(e)[0].currentTarget.value)
        todos[index].isDone = jQuery($('.todo-done[name=todo]')[index]).prop('checked')
        refreshTodoDone()
    })

    $('.todo-delete').on('click', (e) => {
        console.log(e[0])
        $(e).parent().removeClass()
        // todos.splice($(e.toElement).val(), 1)
    })
})
