import { useState } from 'react'

const EJEMPLOS = [
  { nombre: 'Arroz', pos: 8 },
  { nombre: 'Tomates', pos: 76 },
  { nombre: 'Pollo', pos: 94 },
]

function App() {
  const [productos, setProductos] = useState('')
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setResultado(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_URL}/api/sugerencias/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`)
      }

      setResultado(data)
    } catch (err) {
      setError(err.message || 'El modelo no respondio. Vuelve a intentarlo en unos minutos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <div className="h-1.5 w-full bg-gradient-to-r from-fresh via-wheat to-tomato" />

      <div className="max-w-5xl mx-auto px-6 py-14">

        <div className="mb-16 flex items-center justify-between">
          <span className="font-display text-2xl text-pantry-dark">Antes de Botar</span>
          <span className="text-sm font-medium text-pantry-dark bg-pantry-dark/10 px-3 py-1 rounded-full">
            Futuro de los alimentos
          </span>
        </div>

        <div className="mb-20 max-w-2xl animate-[fadeIn_0.6s_ease-out]">
          <h1 className="font-display text-5xl md:text-6xl leading-[1.08] text-pantry-dark mb-6">
            Lo que está por vencer no tiene por qué botarse.
          </h1>
          <p className="text-lg text-ink mb-12 max-w-md">
            Escribe lo que tienes en tu despensa y una IA te dice qué comer primero,
            qué cocinar con lo que se va a vencer, y qué no puedes dejar pasar.
          </p>

          <div className="relative pt-2 pb-8">
            <div className="h-3 rounded-full bg-gradient-to-r from-fresh via-wheat to-tomato shadow-sm" />
            {EJEMPLOS.map((ej) => (
              <div
                key={ej.nombre}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${ej.pos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-4 h-4 rounded-full bg-pantry-dark border-2 border-paper shadow" />
                <span className="mt-2 text-sm font-medium text-ink whitespace-nowrap">{ej.nombre}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-fresh">Fresco</span>
            <span className="text-wheat">Pronto</span>
            <span className="text-tomato">Urgente</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-16 max-w-2xl">
          <label className="block font-display text-xl text-pantry-dark mb-3">
            Tu despensa
          </label>
          <textarea
            className="w-full bg-white border border-pantry-dark/25 rounded-md p-4 h-36 font-body text-ink placeholder:text-ink/45 focus:outline-none focus:border-pantry-dark focus:ring-2 focus:ring-pantry-dark/20 transition shadow-sm"
            placeholder="2kg de tomates (vencen en 2 dias), 1kg de arroz (vence en 6 meses), 500g de pollo (vence mañana)..."
            value={productos}
            onChange={(e) => setProductos(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={cargando}
            className="mt-4 bg-pantry-dark hover:bg-ink disabled:bg-ink/40 text-paper font-body font-semibold text-base px-7 py-3 rounded-md transition shadow-sm"
          >
            {cargando ? 'Generando plan...' : 'Generar plan'}
          </button>
        </form>

        {error && (
          <div className="max-w-2xl mb-16 border-l-4 border-tomato bg-tomato/5 pl-4 py-3 rounded-r-md">
            <p className="text-ink font-medium">{error}</p>
          </div>
        )}

        {resultado && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
              <p className="text-sm text-ink/60">
                Generado en tiempo real por IA (Groq · gpt-oss-120b) a partir de lo que escribiste arriba
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
            <div className="border-t-4 border-wheat pt-5 bg-white/50 -mx-4 px-4 pb-4 rounded-b-md">
              <h2 className="font-display text-xl text-pantry-dark mb-4">Orden de consumo</h2>
              <ol className="space-y-3">
                {(resultado.prioridad || []).map((item, i) => (
                  <li key={i} className="flex gap-3 text-ink">
                    <span className="font-display font-semibold text-wheat">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t-4 border-fresh pt-5 bg-white/50 -mx-4 px-4 pb-4 rounded-b-md">
              <h2 className="font-display text-xl text-pantry-dark mb-4">Recetas para rescatar</h2>
              <div className="space-y-4">
                {(resultado.recetas || []).map((r, i) => (
                  <div key={i}>
                    <p className="font-semibold text-ink">{r.item}</p>
                    <p className="text-ink/80 text-sm">{r.receta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-4 border-tomato pt-5 bg-white/50 -mx-4 px-4 pb-4 rounded-b-md">
              <h2 className="font-display text-xl text-pantry-dark mb-4">Alertas urgentes</h2>
              <ul className="space-y-3">
                {(resultado.alertas || []).map((a, i) => (
                  <li key={i} className="text-ink font-medium">{a}</li>
                ))}
              </ul>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
