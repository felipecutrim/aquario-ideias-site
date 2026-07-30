import { useEffect, useState } from 'react'

export function useSupabaseData(fetcher) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    setLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (isMounted) setData(result)
      })
      .catch((err) => {
        if (isMounted) setError(err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, error, loading }
}
