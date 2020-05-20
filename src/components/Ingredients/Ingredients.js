import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../custom-hooks/http'

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

function Ingredients () {

  // const [state, dispatch] = useReducer(reducer, initialState, init)
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { sendRequest,
    isLoading,
    error,
    responseData,
    reqExtra,
    reqIndentifier,
    closeError } = useHttp();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  useEffect(() => {
    if (!isLoading && !error) {
      if (reqIndentifier === 'REMOVE_ITEM') {
        dispatch({ type: 'DELETE', ingredientId: reqExtra });
      } else if (reqIndentifier === 'ADD_ITEM') {
        dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...reqExtra } });
      }
    }
  }, [isLoading, error, reqIndentifier, responseData, reqExtra]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);



  const addIngredientsHandler = useCallback((ingredient) => {
    sendRequest('https://react-burger-d334d.firebaseio.com/hook-ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_ITEM');
  }, [sendRequest])


  const onRemoveIngredient = useCallback(async (ingredientId) => {
    sendRequest(`https://react-burger-d334d.firebaseio.com/hook-ingredients/${ingredientId}.json`, 'DELETE', JSON.stringify(ingredientId), ingredientId, 'REMOVE_ITEM');
  }, [sendRequest])


  const ingredientsList = useMemo(() => (<IngredientList
    onRemoveItem={onRemoveIngredient}
    ingredients={userIngredients} />), [onRemoveIngredient, userIngredients])

  return (
    <div className="App">
      {error && <ErrorModal onClose={closeError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientsHandler} isLoading={isLoading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
