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

    // 全タスクの表示
    function showTodo(){
        $('.todo').remove()
        for(let i = 0; i < todos.length; i++){
            const todo_list = $('#todo-list').append(
                '<div class="todo" value="'+i+'">' +
                '   <input type="checkbox" name="todo" class="todo-done">' +
                '   <span class="text">' + todos[i].text + '</span>' +
                '   <button class="todo-delete">×</button>' +
                '</div>'
            )
            if(todos[i].isDone){
                todo_list.children('[value='+i+']').children('.todo-done[name=todo]').prop('checked', true)
                addDoneClass(todo_list.children('[value='+i+']'))
            }
        }
    }

    // doneクラスの追加(横線&灰色表示を行うクラスにつける)
    function addDoneClass(parentElement){
        $(parentElement).children('span').addClass('done')
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
        showTodo()
    })

    $('#todo-list').on('click', '.todo-done', (e) => {
        // 正直他に方法あると思う
        const index = parseInt($($($(e)[0].currentTarget).parent()[0]).context.attributes.value.value)
        todos[index].isDone = $($('.todo-done[name=todo]')[index]).prop('checked')
        showTodo()
    })

    $('#todo-list').on('click', '.todo-delete', (e) => {
        const index = parseInt($($($(e)[0].currentTarget).parent()[0]).context.attributes.value.value)
        todos.splice($(e.toElement).val(), 1)
        showTodo()
    })
})
