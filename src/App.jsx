import TodoNew from './component/todolist/TodoNew'
import {TodoData} from './component/todolist/TodoData'
import './component/todolist/todo.css'
import { TodoTitle } from './component/todolist/TodoTitle';
import reactLogo from './assets/react.svg';
import React, { useState } from 'react';

const App =() => {



  const [todoList, setTodoList ] = useState([

  ]);

  const randomInteger =(min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const addNewTodo = (name) =>{
    const newTodo ={
      id : randomInteger(1,100),
      name :name 
    }
    setTodoList([...todoList, newTodo])
  }

  return(
    <>
    <div className="todo-container">
      <TodoTitle />
      <TodoNew 
      addNewTodo ={addNewTodo}
      />
      {todoList.length > 0 ? 
     <TodoData todoList= {todoList} />
      : <div className="todo-image"> <img src={reactLogo} /></div>
      }
  
    </div>
    </>
  );
}
export default App;