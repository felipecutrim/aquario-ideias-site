import { useCallback, useEffect, useRef, useState } from 'react'

export function useSupabaseData(fetcher) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const isMountedRef = useRef(true)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)

    return fetcher()
      .then((result) => {
        if (isMountedRef.current) setData(result)
      })
      .catch((err) => {
        if (isMountedRef.current) setError(err)
      })
      .finally(() => {
        if (isMountedRef.current) setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    load()
    return () => {
      isMountedRef.current = false
    }
  }, [load])

  return { data, error, loading, refetch: load }
}
