import { orderBy } from 'lodash'
import React, { useEffect } from 'react'
import CommentsList, { AddCommentForm } from '../common/comments'
import { useDispatch, useSelector } from 'react-redux'
import {
  createComment,
  getComments,
  getCommentsLoadingStatus,
  loadCommentsList,
  removeComment
} from '../../store/comments'
import { useParams } from 'react-router-dom'

const Comments = () => {
  const dispatch = useDispatch()
  const { userId } = useParams()

  useEffect(() => {
    dispatch(loadCommentsList(userId))
  }, [userId]) // чтоб коменты подгружались при пережоде на другого пользователя
  const isCommentLoading = useSelector(getCommentsLoadingStatus())
  const comments = useSelector(getComments())

  const handleSubmit = (data) => {
    dispatch(createComment({ ...data, pageId: userId }))
  }
  const handleRemoveComment = (id) => {
    dispatch(removeComment(id))
  }
  const sortedComments = orderBy(comments, ['created_at'], ['desc']) // комментарии необходимо отстортировать с помощью метода из лодаша
  return (
    <>
      <div className='card mb-2'>
        <div className='card-body '>
          <AddCommentForm onSubmit={handleSubmit} />
        </div>
      </div>
      {sortedComments.length > 0 && (
        <div className='card mb-3'>
          <div className='card-body '>
            <h2>Comments</h2>
            <hr />
            {!isCommentLoading ? (
              <CommentsList
                comments={sortedComments}
                onRemove={handleRemoveComment} // если хранить состояние комментария здесь, а не в comment.jsx, то мы поймаем его удаление, обновим наши данные и тем самым отображение тоже обновится
              />
            ) : (
              'Loading...'
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Comments
