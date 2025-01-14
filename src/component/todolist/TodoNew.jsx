import {useState} from 'react';

const TodoNew =(props)=>{

  // useState 
  const [valueInput, setValueInput] = useState("Henry") ;
 
  const name1 = "Hoàng Lâm";
  const {addNewTodo} = props ;
  // addNewTodo(name1);
  // fire: khai hoả 
  const handleClick = () => {
    console.log("check input ", valueInput);
  }
  const handleOnChange = (name) =>{
    console.log(">> handleOnChange", name )
    setValueInput(name)
  }


    return(
        <div>
        <input type="text" onChange={(event)=>{handleOnChange(event.target.value)}}/>
        <button style={{cursor: "pointer"}} onClick={handleClick}> Add </button>
        <div> My Text input is = {valueInput} </div>
      </div>
    );
}
export default TodoNew