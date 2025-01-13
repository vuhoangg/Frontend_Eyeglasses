

const TodoData =({name, data})=>{
    return(
        <div className="todo-data">
        <div> Learning React </div>
        <div> Watching Youtube </div>
        <div>{name}</div>
        <div>{data.email}</div>
      </div>
    );
}

export {TodoData}