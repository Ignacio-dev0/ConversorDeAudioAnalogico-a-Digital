import React, { useState, useRef, useEffect } from 'react'
import Chart from 'chart.js/auto'

function Recorder({ sampleRate, bitDepth }) {
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
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      const name = `Grabación ${audioCounter.current++}`

      setAudioList(prev => [...prev, { name, url, blob }])
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

  const procesarAudio = async (blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', blob)
      formData.append('sample_rate', sampleRate)
      formData.append('bit_depth', bitDepth)

      const res = await fetch('http://localhost:5000/procesar-audio', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (data.error) {
        console.error('Error desde el backend:', data.error)
        return null
      }

      return {
        originalSpectrum: data.originalSpectrum,
        processedSpectrum: data.processedSpectrum,
        labels: data.labels
      }
    } catch (error) {
      console.error('Error al procesar audio:', error)
      return null
    }
  }

  const dibujarGrafico = ({ labels, processedSpectrum }) => {
    const ctx = canvasRef.current.getContext('2d')

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Original',
            //data: originalSpectrum,
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'Procesado',
            data: processedSpectrum,
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
            title: { display: true, text: 'Frecuencia (Hz)' }
          },
          y: {
            title: { display: true, text: 'Amplitud' }
          }
        }
      }
    })
  }

  const actualizarGrafico = async () => {
    const audio = audioList[selectedIndex]
    if (!audio || !audio.blob) return

    const resultado = await procesarAudio(audio.blob)
    if (resultado) {
      dibujarGrafico(resultado)
    }
  }

  const handleSelect = (index) => {
    setSelectedIndex(index)
  }

  useEffect(() => {
    if (selectedIndex !== null) {
      actualizarGrafico()
    }
  }, [selectedIndex, sampleRate, bitDepth]) // actualiza cuando cambian los sliders o la selección

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
