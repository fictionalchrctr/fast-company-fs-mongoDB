import { createSlice } from '@reduxjs/toolkit'
import qualitiesService from '../service/qualitiesService'
import isOutDated from '../utils/isOutdated'

const qualitiesSlice = createSlice({
  name: 'qualities',
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    lastFetch: null
  },
  reducers: {
    // обработка запроса на сервер
    qualitiesRequested: (state) => {
      state.isLoading = true
    },
    // обработка успешного результата
    qualitiesRecieved: (state, action) => {
      state.entities = action.payload // это и есть наши qualities
      state.lastFetch = Date.now() // то время, в которое мы получили наши qualities
      state.isLoading = false
    },
    // обработка не успешного результата
    qualitiesRequestFailed: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

const { reducer: qualitiesReducer, actions } = qualitiesSlice
const { qualitiesRequested, qualitiesRecieved, qualitiesRequestFailed } =
  actions

export function loadQualitiesList() {
  return async function (dispatch, getState) {
    const { lastFetch } = getState().qualities
    if (isOutDated(lastFetch)) {
      dispatch(qualitiesRequested())
      try {
        const { content } = await qualitiesService.fetchAll()
        dispatch(qualitiesRecieved(content))
      } catch (error) {
        dispatch(qualitiesRequestFailed(error.message))
      }
    }
  }
}

// селекторы
export const getQualities = () => (state) => state.qualities.entities
export const getQualitiesLoadingStatus = () => (state) => {
  return state.qualities.isLoading
}
export const getQualitiesByIds = (qualitiesIds) => (state) => {
  if (state.qualities.entities) {
    const qualitiesArray = []
    for (const qualId of qualitiesIds) {
      for (const quality of state.qualities.entities) {
        if (quality._id === qualId) {
          qualitiesArray.push(quality)
          break
        }
      }
    }
    return qualitiesArray
  }
  return []
}

export default qualitiesReducer
