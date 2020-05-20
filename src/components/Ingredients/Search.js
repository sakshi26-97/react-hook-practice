import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef();

  useEffect(() => {
    // effect
    const timer = setTimeout(() => {
      // enteredFilter value will be previous value before timer and inputRef.current.value will be current value
      if (enteredFilter === inputRef.current.value) {
        async function fetchData () {
          // cleanup

          let query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`

          const response = await fetch('https://react-burger-d334d.firebaseio.com/hook-ingredients.json' + query);
          const responseData = await response.json();

          const loadedIngredients = [];
          for (const key in responseData) {
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount
            });
          }
          // setUserIngredients([...loadedIngredients]);
          onLoadIngredients(loadedIngredients)
        }
        fetchData();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    }

  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text"
            ref={inputRef}
            onChange={(event) => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
