import TodoNew from './component/todolist/TodoNew'
import {TodoData} from './component/todolist/TodoData'
import './component/todolist/todo.css'
import { TodoTitle } from './component/todolist/TodoTitle';
import reactLogo from './assets/react.svg';
const App =()=>{
  return(
    <>
    <div className="todo-container">
      <TodoTitle />
      <TodoNew />
     <TodoData />
     
    </div>
    <div className="todo-image"> 
      <img src={reactLogo} />
    </div>
    </>
  );
}

export default App;