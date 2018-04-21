$(()=>{
    let todos = []

    function addTodo(text){
        todos.push({'text': text, 'isDone': false})
    }

    // 全タスクの表示
    function showTodo(){
        const type = $('[name=showType]:checked').attr('value')
        $('.todo').remove()
        for(let i = 0; i < todos.length; i++){
            switch (type) {
                case 'Active':
                    if(todos[i].isDone === true){
                        continue
                    }
                    break
                case 'Completed':
                    if(todos[i].isDone === false){
                        continue
                    }
                    break
            }
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

    //残りタスクを表示
    function showResultTask(){
        const type = $('[name=showType]:checked').attr('value')
        switch (type) {
            case 'All':
                $('#left-item').text(todos.length + ' items left')
                return
            case 'Active':
                const activeTaskCount = $.grep(todos, (elem, index) => {
                    return elem.isDone === false
                }).length
                $('#left-item').text(activeTaskCount + ' items left')
                return
            case 'Completed':
                const completedTaskCount = $.grep(todos, (elem, index) => {
                    return elem.isDone === true
                }).length
                $('#left-item').text(completedTaskCount + ' items left')
                return
        }
    }

    // doneクラスの追加(横線&灰色表示を行うクラスにつける)
    function addDoneClass(parentElement){
        $(parentElement).children('span').addClass('done')
    }

    // checkboxを参考にtodosを書き換える
    function refreshTodoDone(){
        const checkedIndex = $(".todo input[name=todo]:checked").map((i, elem) => {
            return parseInt($(elem).parent('.todo').attr('value'))
        }).toArray()
        for(let i = 0; i < todos.length; i++){
            todos[i].isDone = jQuery.inArray(i, checkedIndex) !== -1
        }
    }

    // 全てのタスクが完了しているかどうか
    function isAllChecked(){
        for(let i = 0; i < todos.length; i++){
            if(!todos[i].isDone){
                return false
            }
        }
        return true
    }

    //全てのタスクがアクティブ状態かどうか
    function isAllActive(){
        for(let i = 0; i < todos.length; i++){
            if(todos[i].isDone){
                return false
            }
        }
        return true
    }

    // Complete表示かつ全てのタスクがActiveの時、チェックボックスを操作できないようにする
    function changeShowOrHideAllButton(){
        const type = $('[name=showType]:checked').attr('value')
        switch (type) {
            case 'All':
                if(todos.length === 0){
                    $('#all[name=all]').prop('disabled', true)
                    return
                }
                break
            case 'Active':
                if(isAllChecked()){
                    $('#all[name=all]').prop('disabled', true)
                    return
                }
                break
            case 'Completed':
                if(isAllActive()){
                    $('#all[name=all]').prop('disabled', true)
                    return
                }
                break
        }
        $('#all[name=all]').prop('disabled', false)
    }

    // completedタスクが１つでもある場合はClearCompletedボタンを表示する
    function changeShowOrHideClearCompletedButton(){
        const completedTaskCount = $.grep(todos, (elem, index) => {
            return elem.isDone === true
        }).length
        if(completedTaskCount > 0){
            if($('#ClearCompleted').length === 0){
                $('<form action="post" onsubmit="return false" id="ClearCompleted">' +
                '   <input type="button" value="Clear Completed">' +
                '</form>').appendTo('#footer')
            }
        }else{
            $('#ClearCompleted').remove()
        }
    }

    function showAllElement(){
        showTodo()
        changeShowOrHideAllButton()
        changeShowOrHideClearCompletedButton()
        showResultTask()
    }

    $(document).ready(() => {
        showAllElement()
    })

    $('#todo-input').change(() => {
        const text = $('#todo-post [name=todo]').val()
        addTodo(text)
        $('#todo-post [name=todo]').val('')
        showAllElement()
    })

    // チェックボックス関連
    $('#all').change(() => {
        for(let i = 0; i < todos.length; i++){
            todos[i].isDone = $('#all[name=all]').prop('checked')
        }
        showAllElement()
    })

    $('#todo-list').on('click', '.todo-done', (e) => {
        // 正直他に方法あると思う
        const index = parseInt($($($(e)[0].currentTarget).parent()[0]).context.attributes.value.value)
        todos[index].isDone = $('.todo[value='+index+']').children('.todo-done').prop('checked')
        $('#todo-post').children('[name=all]').prop('checked', isAllChecked())
        showAllElement()
    })

    $('#todo-list').on('click', '.todo-delete', (e) => {
        const index = parseInt($($($(e)[0].currentTarget).parent()[0]).context.attributes.value.value)
        todos.splice(index, 1)
        showAllElement()
    })

    $('#todo-type').on('click', '[name=showType]', () => {
        showAllElement()
    })
})
