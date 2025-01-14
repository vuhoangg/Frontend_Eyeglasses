import TodoNew from './component/todolist/TodoNew'
import {TodoData} from './component/todolist/TodoData'
import './component/todolist/todo.css'
import { TodoTitle } from './component/todolist/TodoTitle';
import reactLogo from './assets/react.svg';
import React, { useState } from 'react';
import HeaderLayout from './component/layout/header';
import FooterLayout from './component/layout/footer';


const App =() => {



  const [todoList, setTodoList] = useState([

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
  const delTodoById = (id )=>{
    setTodoList(todoList.filter((item) => item.id !== id));
  }

  return(
    <>
    <HeaderLayout />
    <div className="todo-container">
      <TodoTitle />
      <TodoNew 
      addNewTodo ={addNewTodo}
      />
      {todoList.length > 0 ? 
     <TodoData todoList= {todoList} delTodoById={delTodoById} />
      : <div className="todo-image"> <img src={reactLogo} /></div>
      }
    </div>
    <FooterLayout/>
    </>
  );
}
export default App;