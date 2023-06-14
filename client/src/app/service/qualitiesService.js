import httpService from './httpService'

const qualityEndpoint = 'quality/'

const qualitiesService = {
  fetchAll: async () => {
    const { data } = await httpService.get(qualityEndpoint)
    return data
  }
}

export default qualitiesService
