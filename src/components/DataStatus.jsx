export default function DataStatus({ loading, error }) {
  if (loading) {
    return <p className="mt-8 text-neutral-500">Carregando dados...</p>
  }

  if (error) {
    return (
      <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
        Erro ao carregar dados do Supabase: {error.message}
      </p>
    )
  }

  return null
}
