/* eslint-disable no-unused-vars */
/* eslint-disable no-undefined */

import React,{useState, useEffect} from 'react';
import { When } from '../if';
import Modal from '../modal';

import './todo.scss';

const todoAPI = 'https://api-js401.herokuapp.com/api/v1/todo';

function ToDo (props) {
  const[todoList, setTodoList] = useState([]);
  const[item, setItem] = useState({});
  const[showDetails, setShowDetails] = useState(false);
  const[details, setDetails] = useState({});


  const handleInputChange = e => {
    setItem({ ...item, [e.target.name]: e.target.value });
    console.log('test',item);
  };

  const callAPI = (url, method = 'get', body, handler, errorHandler) => {

    return fetch(url, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
      .then(response => response.json())
      .then(data => typeof handler === 'function' ? handler(data) : null )
      .catch( (e) => typeof errorHandler === 'function' ? errorHandler(e) : console.error(e)  );
  };

  const addItem = (e) => {

    e.preventDefault();
    e.target.reset();

    const _updateState = newItem =>
      setTodoList([...todoList, newItem]);

    callAPI( todoAPI, 'POST', item, _updateState );

  };

  const deleteItem = id => {

    const _updateState = (results) =>
      setTodoList(todoList.filter(item => item._id !== id));

    callAPI( `${todoAPI}/${id}`, 'DELETE', undefined, _updateState );

  };

  const saveItem = updatedItem => {

    const _updateState = (newItem) =>
      setTodoList(todoList.map(item => item._id === newItem._id ? newItem : item));

    callAPI( `${todoAPI}/${updatedItem.id}`, 'PUT', updatedItem, _updateState );

  };

  const toggleComplete = id => {
    let newitem = todoList.filter(i => i._id === id)[0] || {};
    if (newitem._id) {
      newitem.complete = !newitem.complete;
      saveItem(newitem);
    }
  };

  const toggleDetails = id => {
    setShowDetails(! showDetails);
    setDetails(todoList.filter( item => item._id === id )[0] || {});
  };

  const getTodoItems = () => {
    const _updateState = data => setTodoList(data.results);
    callAPI( todoAPI, 'GET', undefined, _updateState );
  };

  useEffect (() => {
    getTodoItems();
  },getTodoItems);
  return (
    <>
      <header>
        <h1>To Do App</h1>
      </header>

      <section className="todo">

        <div className="todo-form">
          <h2>Add Item</h2>
          <form onSubmit={addItem}>
            <label>
              <span>To Do Item</span>
              <input
                name="text"
                placeholder="Add To Do List Item"
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              <span>Difficulty Rating</span>
              <input type="range" min="1" max="5" name="difficulty" defaultValue="3" onChange={handleInputChange} required />
            </label>
            <label>
              <span>Assigned To</span>
              <input type="text" name="assignee" placeholder="Assigned To" onChange={handleInputChange} required />
            </label>
            <label>
              <span>Due</span>
              <input type="date" name="due" onChange={handleInputChange} required/>
            </label>
            <button>Add Item</button>
          </form>
        </div>

        <div className="todo-list">
          <h2>
            There are
            <span>
              {todoList.filter( item => !item.complete ).length}
            </span>
            Items To Complete
          </h2>
          <ul>
            { todoList.map(item => (
              <li
                className={`complete-${item.complete.toString()}`}
                key={item._id}
              >
                <span onClick={() => toggleComplete(item._id)}>
                  {item.text}
                </span>
                <button onClick={() => toggleDetails(item._id)}>
                    Details
                </button>
                <button onClick={() => deleteItem(item._id)}>
                    Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {console.log(details)}
      <When condition={showDetails}>
        <Modal title="To Do Item" close={toggleDetails}>
          <div className="todo-details">
            <div className="item">
              {details.text}
            </div>
            <header>
              <span>Assigned To: {details.assignee}</span>
              <span>Difficulty: {details.difficulty}</span>
              <span>Due: {details.due}</span>
            </header>
          </div>
        </Modal>
      </When>
    </>
  );
}

export default ToDo;