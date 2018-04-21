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
                '<div class="todo" value="'+i+'">' +
                '   <input type="checkbox" name="todo" class="todo-done">' +
                '   <span class="text">' + todos[i].text + '</span>' +
                '   <button class="todo-delete">×</button>' +
                '</div>'
            )
            if(todos[i].isDone){
                addDoneClass($('todo-list'), index)
            }
        }
    }

    function addDoneClass(parentElement, index){
        $(parentElement+' .todo [.todo').addClass('done')
    }

    // checkboxを参考にtodosを書き換える
    function refreshTodoDone(){
        const checkedIndex = $(".todo input[name=todo]:checked").map((i, elem) => {
            return parseInt($(elem).parent()[0].attributes.value.value)
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

    $('#todo-list').on('click', '.todo-done', (e) => {
        // 正直他に方法あると思う
        const index = parseInt($($($(e)[0].currentTarget).parent()[0]).context.attributes.value.value)
        todos[index].isDone = $($('.todo-done[name=todo]')[index]).prop('checked')
    })

    $('#todo-list').on('click', '.todo-delete', (e) => {
        const index = parseInt($($($(e)[0].currentTarget).parent()[0]).context.attributes.value.value)
        todos.splice($(e.toElement).val(), 1)
        showTodo()
    })
})
