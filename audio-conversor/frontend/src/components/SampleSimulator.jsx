import React, { useEffect, useRef } from 'react'

function SampleSimulator({ samples, setSamples, quantization, setQuantization }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    draw()
  }, [samples, quantization])

  const draw = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const amplitude = height / 2 - 20

    ctx.clearRect(0, 0, width, height)

    // Onda original
    ctx.beginPath()
    ctx.strokeStyle = '#aaa'
    for (let x = 0; x < width; x++) {
      const t = x / width * 2 * Math.PI
      const y = Math.sin(t * 2) * amplitude
      x === 0 ? ctx.moveTo(x, height / 2 - y) : ctx.lineTo(x, height / 2 - y)
    }
    ctx.stroke()

    // Muestreo y cuantización
    const step = width / samples
    const quantStep = (2 * amplitude) / quantization

    const points = []
    for (let i = 0; i <= samples; i++) {
      const x = i * step
      const t = x / width * 2 * Math.PI
      let y = Math.sin(t * 2) * amplitude
      y = Math.round(y / quantStep) * quantStep
      points.push({ x, y })
    }

    ctx.beginPath()
    ctx.strokeStyle = 'blue'
    points.forEach((pt, i) => {
      const y = height / 2 - pt.y
      i === 0 ? ctx.moveTo(pt.x, y) : ctx.lineTo(pt.x, y)
    })
    ctx.stroke()

    points.forEach(pt => {
      ctx.beginPath()
      ctx.fillStyle = 'red'
      ctx.arc(pt.x, height / 2 - pt.y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  return (
    <div>
      <h2>Simulador de Muestreo y Cuantización</h2>
      <label>
        Muestreo ({samples})
        <input
          type="range"
          min="50"
          max="96100"
          step="8000"
          value={samples}
          onChange={e => setSamples(Number(e.target.value))}
        />
      </label>
      <label>
        Cuantización ({quantization})
        <input
          type="range"
          min="8"
          max="24"
          step="8"
          value={quantization}
          onChange={e => setQuantization(Number(e.target.value))}
        />
      </label>
      <canvas ref={canvasRef} width="800" height="300" style={{ marginTop: 20 }} />
      <p>Muestreo: cantidad de puntos tomados por segundo.</p>
      <p>Cuantización: resolución en niveles para representar la amplitud.</p>
    </div>
  )
}

export default SampleSimulator
