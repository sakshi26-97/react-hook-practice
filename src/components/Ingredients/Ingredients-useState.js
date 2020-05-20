import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

function Ingredients () {

  const [userIngredients, setUserIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // useEffect(() => {
  //   // effect
  //   async function fetchData () {
  //     // cleanup
  //     const response = await fetch('https://react-burger-d334d.firebaseio.com/hook-ingredients.json')
  //     const responseData = await response.json();

  //     const loadedIngredients = [];
  //     for (const key in responseData) {
  //       loadedIngredients.push({
  //         id: key,
  //         title: responseData[key].title,
  //         amount: responseData[key].amount
  //       });
  //     }
  //     setUserIngredients([...loadedIngredients]);
  //   }

  //   fetchData();
  // }, [/*input*/])


  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientsHandler = async (ingredient) => {
    try {
      setLoading(true);
      const response = await fetch('https://react-burger-d334d.firebaseio.com/hook-ingredients.json', {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      })
      setLoading(false);
      const ingredientResponse = await response.json();

      setUserIngredients(prevIngredientsState => [...prevIngredientsState,
      { id: ingredientResponse.name, ...ingredient }
      ]);
    } catch (error) {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  const onRemoveIngredient = async (ingredientId) => {
    setLoading(true);
    fetch(`https://react-burger-d334d.firebaseio.com/hook-ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setLoading(false);
      setUserIngredients(prevIngredientsState => prevIngredientsState.filter(ingredient => ingredient.id !== ingredientId));
    }).catch(error => {
      setError('Something went wrong');
      setLoading(false);
    });
  }

  const closeErrorHandler = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeErrorHandler}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} isLoading={loading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList onRemoveItem={onRemoveIngredient} ingredients={userIngredients} />
      </section>
    </div>
  );
}

export default Ingredients;
