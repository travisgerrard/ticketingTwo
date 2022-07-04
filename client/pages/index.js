import React from 'react';
import Link from 'next/link';

const LandingPage = ({ currentUser, meals }) => {
  const mealList = meals.map((meal) => {
    return (
      <tr key={meal.id}>
        <td>{meal.title}</td>
        <td>
          <Link href="/meals/[mealdId]" as={`/meals/${meal.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>Meals</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{mealList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/meals');

  return { meals: data };
};

export default LandingPage;
