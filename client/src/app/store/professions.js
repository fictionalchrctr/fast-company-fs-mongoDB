import { createSlice } from '@reduxjs/toolkit'
import professionService from '../service/professiomService'
import isOutDated from '../utils/isOutdated'

const professionsSlice = createSlice({
  name: 'professions',
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    lastFetch: null
  },
  reducers: {
    // обработка запроса на сервер
    professionsRequested: (state) => {
      state.isLoading = true
    },
    // обработка успешного результата
    professionsRecieved: (state, action) => {
      state.entities = action.payload // это и есть наши professions
      state.lastFetch = Date.now() // то время, в которое мы получили наши professions
      state.isLoading = false
    },
    // обработка не успешного результата
    professionsRequestFailed: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

const { reducer: professionsReducer, actions } = professionsSlice
const { professionsRequested, professionsRecieved, professionsRequestFailed } =
  actions

export function loadProfessionsList() {
  return async function (dispatch, getState) {
    const { lastFetch } = getState().professions
    if (isOutDated(lastFetch)) {
      dispatch(professionsRequested())
      try {
        const { content } = await professionService.get()
        dispatch(professionsRecieved(content))
      } catch (error) {
        dispatch(professionsRequestFailed(error.message))
      }
    }
  }
}

// селекторы
export const getProfessions = () => (state) => state.professions.entities
export const getProfessionsLoadingStatus = () => (state) =>
  state.professions.isLoading
export const getProfessionById = (id) => (state) => {
  if (state.professions.entities) {
    return state.professions.entities.find((p) => p._id === id)
  }
}

export default professionsReducer
