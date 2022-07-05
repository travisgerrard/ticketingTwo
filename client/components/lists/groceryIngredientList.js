import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';

export default function GroceryIngredientList({ groceryList }) {
  const [listIdToToggle, setListIdToToggle] = useState('');
  const [listIdToDelete, setListIdToDelete] = useState('');

  const { doRequest: deleteList, errors: deleteListError } = useRequest({
    url: `/api/lists/${listIdToDelete}`,
    method: 'delete',
    body: {},
    onSuccess: (event) => {
      var removeIndex = groceryList
        .map((ingredient) => ingredient.id)
        .indexOf(listIdToDelete);
      ~removeIndex && groceryList.splice(removeIndex, 1);

      setListIdToDelete('');
    },
  });

  const { doRequest: toggleList, errors: toggleListError } = useRequest({
    url: `/api/lists/${listIdToToggle}`,
    method: 'put',
    body: {},
    onSuccess: (event) => {
      groceryList
        .map((ingredient) => {
          if (ingredient.id == listIdToToggle) {
            ingredient.isCompleted = !ingredient.isCompleted;
          }
        })
        .indexOf(listIdToToggle);

      setListIdToToggle('');
    },
  });

  useEffect(() => {
    if (listIdToToggle !== '') {
      toggleList();
    }
  }, [listIdToToggle]);

  useEffect(() => {
    if (listIdToDelete !== '') {
      deleteList();
    }
  }, [listIdToDelete]);

  const list = groceryList.map((ingredient) => {
    return (
      <li
        key={ingredient.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>
          <input
            className="form-check-input me-1"
            type="checkbox"
            checked={ingredient.isCompleted}
            onClick={() => {
              setListIdToToggle(ingredient.id);
            }}
          />
          {ingredient.title}
        </span>

        <span
          className="badge bg-danger rounded-pill btn"
          onClick={() => {
            setListIdToDelete(ingredient.id);
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
