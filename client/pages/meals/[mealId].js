import React,  from 'react';
import MealIngredientList from '../../components/meals/mealIngredientList';


export default function MealShow({ meal, ingredients }) {

  return (
    <div>
      <h1>{meal.title}</h1>
      <h2>Ingredients</h2>
     <MealIngredientList ingredients={ingredients} mealId={meal.id} />
    </div>
  );
}

MealShow.getInitialProps = async (context, client) => {
  const { mealId } = context.query;
  const { data: mealData } = await client.get(`/api/meals/${mealId}`);
  const { data: ingredientData } = await client.get(
    `/api/ingredients/meal/${mealId}`
  );
  // Make a route so we can get ingredients for a specific meal

  return { meal: mealData, ingredients: ingredientData };
};
