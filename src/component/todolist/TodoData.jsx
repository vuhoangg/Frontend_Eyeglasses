

const TodoData =(props)=>{
    console.log("check props TodoData ", props);
    const {todoList} = props ;
    console.log("check todoList ",todoList);
    return(
        <div className="todo-data">
        <div> Learning React </div>
        <div> Watching Youtube </div>
        <div> {JSON.stringify(todoList)} </div>
      </div>
    );
}

export {TodoData}