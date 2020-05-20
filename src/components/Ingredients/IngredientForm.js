import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {

  //shortcut useState(select es7) 
  // array destructuring
  // const [inputState, setInputState] = useState({
  //   title: '',
  //   amount: ''
  // })

  // setInputState is a function

  //OR
  // const dummyState = useState({
  //   title: '',
  //   amount: ''
  // })

  // access dummyState[0].title and dummyState[1]({title: event.target.value})

  const [enteredTitle, setEnteredTitle] = useState('')
  const [enteredAmount, setEnteredAmount] = useState('')
  console.log('RENDERING INGREDIENT FORM');


  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className="ingredient-form">
      {/* <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={inputState.title} onChange={event => {
              const newTitle = event.target.value
              setInputState(prevInputState => (
                {
                  title: newTitle,
                  amount: prevInputState.amount
                }))
            }} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputState.amount} onChange={event => {
              const newAmount = event.target.value
              setInputState(prevInputState => (
                {
                  title: prevInputState.title,
                  amount: newAmount
                }))
            }} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card> */}

      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle} onChange={event => setEnteredTitle(event.target.value)} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount} onChange={event => setEnteredAmount(event.target.value)} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {/* {props.isLoading ? <LoadingIndicator /> : ''} */}
            {/* another way to write */}
            {props.isLoading && <LoadingIndicator />}
          </div>
        </form>
      </Card>

    </section>
  );
});

export default IngredientForm;
