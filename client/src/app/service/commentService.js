import httpService from './httpService'

const commentEndpoint = 'comment/'

const commentService = {
  createComment: async (payload) => {
    const { data } = await httpService.post(commentEndpoint, payload)
    return data
  },
  getComments: async (pageId) => {
    const { data } = await httpService.get(commentEndpoint, {
      params: {
        orderBy: 'pageId', // тот элемент, по которому необходимио выполнить сортиоровку
        equalTo: `${pageId}`
      }
    })
    return data
  },
  removeComment: async (commentId) => {
    const { data } = await httpService.delete(commentEndpoint + commentId)
    return data
  }
}

export default commentService
