import React from 'react'
import Recorder from './components/Recorder'
import SampleSimulator from './components/SampleSimulator'

function App() {
  return (
    <div className="container">
      <h1>Conversor de Audio Analógico a Digital</h1>

      {/* Contenedor separado para grabación y lista de audios */}
      <div className="section">
        <Recorder />
      </div>

      {/* Contenedor separado para simulador y gráfica */}
      <div className="section">
        <SampleSimulator />
      </div>
    </div>
  )
}

export default App