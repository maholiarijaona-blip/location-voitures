import api from './axios'

const crud = (path) => ({
  list: (params) => api.get(`/${path}/`, { params }),
  create: (data) => api.post(`/${path}/`, data),
  update: (id, data) => api.patch(`/${path}/${id}/`, data),
  remove: (id) => api.delete(`/${path}/${id}/`),
})

export const voituresApi = crud('voitures')
export const clientsApi = crud('clients')
export const paiementsApi = crud('paiements')
export const locationsApi = {
  ...crud('locations'),
  terminer: (id) => api.post(`/locations/${id}/terminer/`),
}
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats/'),
}

export const authApi = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  register: (data) => api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
}
