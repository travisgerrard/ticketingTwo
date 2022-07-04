import React from 'react';
import MealCommentList from '../../components/meals/mealCommentList';
import MealIngredientList from '../../components/meals/mealIngredientList';

export default function MealShow({ meal, ingredients, comments }) {
  return (
    <div>
      <h1>{meal.title}</h1>
      <h2>Ingredients</h2>
      <MealIngredientList ingredients={ingredients} mealId={meal.id} />
      <h2>Comments</h2>
      <MealCommentList comments={comments} mealId={meal.id} />
    </div>
  );
}

MealShow.getInitialProps = async (context, client) => {
  const { mealId } = context.query;
  const { data: mealData } = await client.get(`/api/meals/${mealId}`);
  const { data: ingredientData } = await client.get(
    `/api/ingredients/meal/${mealId}`
  );
  const { data: commentData } = await client.get(
    `/api/comments/meal/${mealId}`
  );
  // Make a route so we can get ingredients for a specific meal

  return { meal: mealData, ingredients: ingredientData, comments: commentData };
};
