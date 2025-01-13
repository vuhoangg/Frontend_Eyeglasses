import TodoNew from './component/todolist/TodoNew'
import {TodoData} from './component/todolist/TodoData'
import './component/todolist/todo.css'
import { TodoTitle } from './component/todolist/TodoTitle';
import reactLogo from './assets/react.svg';
const App =()=>{
  const a = "Hi guy!"
  const data ={
    address :"Hà Nôi",
    email : "user@gmail.com"
  }
  return(
    <>
    <div className="todo-container">
      <TodoTitle />
      <TodoNew />
     <TodoData
     name={a}
     data={data}
      />
    </div>
    <div className="todo-image"> 
      <img src={reactLogo} />
    </div></>
  );
}
export default App;