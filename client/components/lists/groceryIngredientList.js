import React from 'react';

export default function GroceryIngredientList({ groceryList }) {
  const list = groceryList.map((ingredient) => {
    return (
      <li
        key={ingredient.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {ingredient.title}

        <span
          className="badge bg-danger rounded-pill btn"
          onClick={() => {
            setIngredientIdToDelete(ingredient.id);
          }}
        >
          Delete
        </span>
      </li>
    );
  });

  return (
    <>
      <ul className="list-group">{list}</ul>
    </>
  );
}
