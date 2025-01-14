

const TodoData =(props)=>{

    const {todoList} = props ;

    return(
        <div className="todo-data">
          {todoList.map((item, index )=>{
            // item is element , index is location
            console.log("check map >> ", item )
            return (
              <>
              <div className={`todo-item`} key={item.id}>
                  <div>{index + 1 }</div>
                  <div>{item.name}</div>
                  <div><button>Delete</button></div>
              </div>
              </>
            )
          })}
      
      </div>
    );
}

export {TodoData}