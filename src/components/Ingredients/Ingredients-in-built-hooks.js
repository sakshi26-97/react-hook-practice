import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

// currentIngredients is nothing but state
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentIngredients, action.ingredient];
    case 'DELETE': return currentIngredients.filter(ingredient => ingredient.id !== action.ingredientId);
    default:
      throw new Error('should not get there');
  }
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND': return { loading: true, error: null };
    case 'RESPONSE': return { ...curHttpState, loading: false };
    case 'ERROR': return { loading: false, error: action.errorMessage };
    case 'CLEAR': return { error: null, loading: false }
    default:
      throw new Error('should not get there');
  }
}

function Ingredients () {

  // const [state, dispatch] = useReducer(reducer, initialState, init)
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);



  const addIngredientsHandler = useCallback(async (ingredient) => {
    try {
      dispatchHttp({ type: 'SEND' });
      const response = await fetch('https://react-burger-d334d.firebaseio.com/hook-ingredients.json', {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      });
      dispatchHttp({ type: 'RESPONSE' });
      const ingredientResponse = await response.json();
      dispatch({ type: 'ADD', ingredient: { id: ingredientResponse.name, ...ingredient } });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    }
  }, [])


  const onRemoveIngredient = useCallback(async (ingredientId) => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-burger-d334d.firebaseio.com/hook-ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      dispatch({ type: 'DELETE', ingredientId: ingredientId });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    });
  }, [])


  const closeErrorHandler = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, [])

  const ingredientsList = useMemo(() => (<IngredientList
    onRemoveItem={onRemoveIngredient}
    ingredients={userIngredients} />), [onRemoveIngredient, userIngredients])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={closeErrorHandler}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} isLoading={httpState.loading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
