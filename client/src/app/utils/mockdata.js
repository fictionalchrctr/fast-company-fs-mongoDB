import professions from '../mockData/professions.json'
import qualities from '../mockData//qualities.json'
import users from '../mockData/users.json'
import { useEffect, useState } from 'react'
import httpService from '../service/httpService'
// import { sum } from 'lodash'

const useMockData = () => {
  const statusConst = {
    idle: 'Not Started',
    pending: 'In Process',
    successed: 'Ready',
    error: 'Erorr occured'
  }
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(statusConst.idle)
  const [progress, setProgress] = useState(0) // пргресс выполнения в процентах
  const [count, setCount] = useState(0) // какое кол-во запросов от всех необходимых у нас произошло

  const summaryCount = professions.length + qualities.length + users.length // суммарное кол-во запросов

  const incrementCount = () => {
    setCount((prevState) => prevState + 1)
  }

  const updateProgress = () => {
    if (count !== 0 && status === statusConst.idle) {
      setStatus(statusConst.pending)
    }
    const newProgress = Math.floor((count / summaryCount) * 100) // floor а не round, т.к. нужно округление к меньшему
    if (progress < newProgress) {
      setProgress(() => newProgress) // тут колбэк функция т.к. выполняется асинхронно и должно быть всё последовательно
    }
    if (newProgress === 100) {
      setStatus(statusConst.successed)
    }
  }
  useEffect(() => {
    updateProgress()
  }, [count])

  async function initialize() {
    // выгрузка наших профессий в firebase
    try {
      for (const prof of professions) {
        await httpService.put('profession/' + prof._id, prof)
        incrementCount()
      }
      for (const qual of qualities) {
        await httpService.put('quality/' + qual._id, qual)
        incrementCount()
      }
      for (const user of users) {
        await httpService.put('user/' + user._id, user)
        incrementCount()
      }
    } catch (error) {
      setError(error)
      setStatus(statusConst.error)
    }
  }

  return { error, initialize, progress, status }
}

export default useMockData
