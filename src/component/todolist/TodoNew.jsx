

const TodoNew =(props)=>{
  console.log('check props ',props);
  const name1 = "Hoàng Lâm";
  const {addNewTodo} = props ;
  // addNewTodo(name1);
  // fire: khai hoả 
  const handleClick = () => {
    alert("Click me ")
  }
  const handleOnChange = (name) =>{
    console.log(">> handleOnChange", name )
  }


    return(
        <div>
        <input type="text" onChange={(event)=>{handleOnChange(event.target.value)}}/>
        <button style={{cursor: "pointer"}} onClick={handleClick}> Add </button>
      </div>
    );
}
export default TodoNew