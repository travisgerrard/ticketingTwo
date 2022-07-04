import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';

export default function MealCommentList({ comments, mealId }) {
  const [comment, setComment] = useState('');

  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  const { doRequest: addComment, errors } = useRequest({
    url: '/api/comments',
    method: 'post',
    body: {
      comment,
      mealId,
      dateMade: new Date(),
    },
    onSuccess: (event) => {
      comments.push(event);
      setComment('');
    },
  });

  const { doRequest: deleteComment, errors: deleteCommentError } = useRequest({
    url: `/api/comments/${commentIdToDelete}`,
    method: 'delete',
    body: {},
    onSuccess: (event) => {
      var removeIndex = comments
        .map((commentItem) => commentItem.id)
        .indexOf(commentIdToDelete);
      ~removeIndex && comments.splice(removeIndex, 1);

      setCommentIdToDelete('');
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();

    addComment();
  };

  useEffect(() => {
    if (commentIdToDelete !== '') {
      deleteComment();
    }
  }, [commentIdToDelete]);

  const commentList = comments.map((commentItem) => {
    return (
      <li
        key={commentItem.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {commentItem.comment}

        <span
          className="badge bg-danger rounded-pill btn"
          onClick={() => {
            setCommentIdToDelete(commentItem.id);
          }}
        >
          Delete
        </span>
      </li>
    );
  });

  return (
    <>
      <ul className="list-group">{commentList}</ul>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Add Comment</label>
          <input
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  );
}
