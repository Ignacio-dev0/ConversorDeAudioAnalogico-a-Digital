import React, { useState } from 'react'
import Recorder from './components/Recorder'
import SampleSimulator from './components/SampleSimulator'

function App() {
  const [samples, setSamples] = useState(8000)       // sample_rate
  const [quantization, setQuantization] = useState(4) // bit_depth

  return (
    <div className="container">
      <h1>Conversor de Audio Analógico a Digital</h1>

      <div className="section">
        <Recorder sampleRate={samples} bitDepth={quantization} />
      </div>

      <div className="section">
        <SampleSimulator
          samples={samples}
          setSamples={setSamples}
          quantization={quantization}
          setQuantization={setQuantization}
        />
      </div>
    </div>
  )
}

export default App
