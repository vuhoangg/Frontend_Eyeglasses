

const TodoNew =(props)=>{
  console.log('check props ',props);
  const name1 = "Hoàng Lâm";
  const {addNewTodo} = props ;
  addNewTodo(name1);
    return(
        <div>
        <input type="text"/>
        <button> Add </button>
      </div>
    );
}

export default TodoNew