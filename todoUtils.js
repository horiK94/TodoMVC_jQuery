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
    const activeTaskCount = $.grep(todos, (elem, index) => {
        return elem.isDone === false
    }).length
    if(activeTaskCount === 1){
        $('#left-item').text('1 item left')
        return
    }
    $('#left-item').text(activeTaskCount + ' items left')
}
// doneクラスの追加(横線&灰色表示を行うクラスにつける)
function addDoneClass(parentElement){
    $(parentElement).children('span').addClass('done')
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
function changeShowOrHideFooter(){
    if(todos.length === 0){
        $('#footer').hide()
        return
    }
    $('#footer').show()
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
        if($('#footer button').length === 0){
            $('<button>Clear Completed</button>').appendTo('#footer')
        }
    }else{
        $('#footer button').remove()
    }
}
// 引数の配列データをローカルストレージに保存する
function saveLocalStorage(key, arr){
    localStorage.setItem(key, JSON.stringify(arr))
}
function getLocalStorage(key){
    return JSON.parse(localStorage.getItem(key))
}
function showAllElement(){
    showTodo()
    changeShowOrHideAllButton()
    changeShowOrHideClearCompletedButton()
    changeShowOrHideFooter()
    showResultTask()
    saveLocalStorage('todos', todos)
    saveLocalStorage('type', $('[name=showType]:checked').attr('value'))
}
$(document).ready(() => {
    todos = getLocalStorage('todos')
    if(todos === null){
        todos = []
    }
    let type = getLocalStorage('type')
    if(type === null){
        type = 'All'
    }
    $('[name=showType]').val([type])
    showAllElement()
})
$('#todo-input').change(() => {
    const text = $('#todo-post [name=todo]').val()
    addTodo(text)
    $('#todo-post [name=todo]').val('')
    showAllElement()
    $('#all[name=all]').prop('checked', false)
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
    //全ての要素がcompletedになっているかどうかのcheck
    if(isAllChecked()){
        $('#all[name=all]').prop('checked', true)
    }
})
$('#todo-type').on('click', '[name=showType]', () => {
    showAllElement()
})
$('#footer').on('click', 'button', () => {
    let activeTodosArray = []
    for(let i = 0; i < todos.length; i++){
        if(!todos[i].isDone){
            activeTodosArray.push(todos[i])
        }
    }
    todos = activeTodosArray
    $('#all[name=all]').prop('checked', false)
    showAllElement()
})