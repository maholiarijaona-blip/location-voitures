import { useCallback, useEffect, useState } from 'react'


export function useFetch(apiCall, params = {}, deps = []) {
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiCall(params)

      if (Array.isArray(response.data)) {
        setData(response.data)
        setCount(response.data.length)
      } else {
        setData(response.data.results ?? [])
        setCount(response.data.count ?? 0)
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Erreur de chargement des données')
    } finally {
      setLoading(false)
    }

  }, deps)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, count, loading, error, refetch: fetchData }
}
