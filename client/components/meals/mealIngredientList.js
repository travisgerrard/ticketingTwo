import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';

export default function MealIngredientList({ ingredients, mealId }) {
  const [title, setTitle] = useState('');
  const [addText, setAddText] = useState('add');

  const [ingredientIdToDelete, setIngredientIdToDelete] = useState('');
  const [ingredientIdToIncrease, setIngredientIdToIncrease] = useState('');
  const [ingredientIdToDecrease, setIngredientIdToDecrease] = useState('');
  const [ingredientIdToAddToGroceryList, setIngredientIdToAddToGroceryList] =
    useState('');

  const { doRequest: addIngredient, errors } = useRequest({
    url: '/api/ingredients',
    method: 'post',
    body: {
      title,
      mealId,
    },
    onSuccess: (event) => {
      ingredients.push(event);
      setTitle('');
    },
  });

  const { doRequest: deleteIngredient, errors: deleteIngredientError } =
    useRequest({
      url: `/api/ingredients/${ingredientIdToDelete}`,
      method: 'delete',
      body: {},
      onSuccess: (event) => {
        var removeIndex = ingredients
          .map((ingredient) => ingredient.id)
          .indexOf(ingredientIdToDelete);
        ~removeIndex && ingredients.splice(removeIndex, 1);

        setIngredientIdToDelete('');
      },
    });

  const { doRequest: decreaseIngredient, errors: decreaseIngredientError } =
    useRequest({
      url: `/api/ingredients/decrease/${ingredientIdToDecrease}`,
      method: 'put',
      body: {},

      onSuccess: (event) => {
        var itemIndex = ingredients
          .map((ingredient) => ingredient.id)
          .indexOf(ingredientIdToDecrease);

        var element = ingredients[itemIndex];
        ingredients.splice(itemIndex, 1);
        ingredients.splice(itemIndex - 1, 0, element);

        setIngredientIdToDecrease('');
      },
    });

  const { doRequest: increaseIngredient, errors: increaseIngredientError } =
    useRequest({
      url: `/api/ingredients/increase/${ingredientIdToIncrease}`,
      method: 'put',
      body: {},
      onSuccess: (event) => {
        var itemIndex = ingredients
          .map((ingredient) => ingredient.id)
          .indexOf(ingredientIdToIncrease);

        var element = ingredients[itemIndex];
        ingredients.splice(itemIndex, 1);
        ingredients.splice(itemIndex + 1, 0, element);

        setIngredientIdToIncrease('');
      },
    });

  const {
    doRequest: addIngredientToGroceryList,
    errors: addIngredientToGroceryListError,
  } = useRequest({
    url: `/api/ingredients/addIngredientToList/${ingredientIdToAddToGroceryList}`,
    method: 'post',
    body: {},
    onSuccess: (event) => {
      setAddText('✓');
      setIngredientIdToAddToGroceryList('');
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();

    addIngredient();
  };

  useEffect(() => {
    if (ingredientIdToDecrease !== '') {
      decreaseIngredient();
    }
  }, [ingredientIdToDecrease]);

  useEffect(() => {
    if (ingredientIdToIncrease !== '') {
      increaseIngredient();
    }
  }, [ingredientIdToIncrease]);

  useEffect(() => {
    if (ingredientIdToDelete !== '') {
      deleteIngredient();
    }
  }, [ingredientIdToDelete]);

  useEffect(() => {
    if (ingredientIdToAddToGroceryList !== '') {
      addIngredientToGroceryList();
    }
  }, [ingredientIdToAddToGroceryList]);

  const ingredientList = ingredients.map((ingredient) => {
    return (
      <li
        key={ingredient.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {ingredient.title}
        <span>
          <span
            className="badge bg-primary rounded-pill btn"
            onClick={() => {
              setIngredientIdToDecrease(ingredient.id);
            }}
          >
            ↑
          </span>{' '}
          <span
            className="badge bg-primary rounded-pill btn"
            onClick={() => {
              setIngredientIdToIncrease(ingredient.id);
            }}
          >
            ↓
          </span>
          {'  '}
          <span
            className="badge bg-success rounded-pill btn"
            onClick={() => {
              setIngredientIdToAddToGroceryList(ingredient.id);
            }}
          >
            {addText}
          </span>
          {'  '}
          <span
            className="badge bg-danger rounded-pill btn"
            onClick={() => {
              setIngredientIdToDelete(ingredient.id);
            }}
          >
            Delete
          </span>
        </span>
      </li>
    );
  });

  return (
    <>
      <ul className="list-group">{ingredientList}</ul>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Add Ingredient</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  );
}
