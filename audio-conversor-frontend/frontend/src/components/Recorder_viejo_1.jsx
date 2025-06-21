import React, { useState, useRef } from 'react'
import Chart from 'chart.js/auto'

function Recorder() {
  const [recording, setRecording] = useState(false)
  const [audioList, setAudioList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const audioChunks = useRef([])
  const canvasRef = useRef(null)
  const audioCounter = useRef(1)
  const chartInstance = useRef(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    audioChunks.current = []

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) audioChunks.current.push(e.data)
    }

    mediaRecorder.onstop = async () => {
      streamRef.current.getTracks().forEach(track => track.stop())
      const blob = new Blob(audioChunks.current, { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      const name = `Grabación ${audioCounter.current++}`

      try {
        const formData = new FormData()
        formData.append('audio', blob)

        const res = await fetch('http://localhost:5000/procesar-audio', {
          method: 'POST',
          body: formData
        })

        const { originalSpectrum, processedSpectrum, labels } = await res.json()

        setAudioList(prev => [...prev, { name, url, originalSpectrum, processedSpectrum, labels }])
      } catch (error) {
        console.error('Error al enviar audio al backend:', error)
        // Aun sin backend, guardamos el audio para poder escucharlo
        setAudioList(prev => [...prev, { name, url, originalSpectrum: [], processedSpectrum: [], labels: [] }])
      }
    }

    mediaRecorder.start()
    setRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const handleSelect = (index) => {
    setSelectedIndex(index)
    const audio = audioList[index]
    const ctx = canvasRef.current.getContext('2d')

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    if (audio.labels.length > 0) {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: audio.labels,
          datasets: [
            {
              label: 'Original',
              data: audio.originalSpectrum,
              borderColor: 'blue',
              fill: false
            },
            {
              label: 'Procesado',
              data: audio.processedSpectrum,
              borderColor: 'red',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Frecuencia (Hz)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Amplitud'
              }
            }
          }
        }
      })
    } else {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  return (
    <div>
      <div className="button-group">
        <button className="btn" onClick={startRecording} disabled={recording}>🎤 Grabar Audio</button>
        <button className="btn" onClick={stopRecording} disabled={!recording}>⏹️ Detener</button>
      </div>

      <div className="audio-list">
        {audioList.map((audio, i) => (
          <div key={i} className="audio-item">
            <div className="audio-controls">
              <input
                type="radio"
                name="audioSelect"
                checked={selectedIndex === i}
                onChange={() => handleSelect(i)}
              />
              <label className="audio-label">{audio.name}</label>
            </div>
            <audio controls src={audio.url} className="audio-player" />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <h3 className="selected-title">Audio seleccionado: {audioList[selectedIndex].name}</h3>
      )}

      <div className="chart-wrapper">
        <div className="chart-container-fixed">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  )
}

export default Recorder
