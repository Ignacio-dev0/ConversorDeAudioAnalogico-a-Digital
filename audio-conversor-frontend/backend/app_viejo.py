from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment
import numpy as np
from scipy.signal import resample
import io

app = Flask(__name__)
CORS(app)

def cuantizar(array, bit_depth):
    niveles = 2 ** bit_depth
    array_normalizado = (array - np.min(array)) / (np.max(array) - np.min(array))
    array_cuantizado = np.round(array_normalizado * (niveles - 1)) / (niveles - 1)
    return array_cuantizado * 2 - 1  # volver a rango [-1, 1]

@app.route('/procesar-audio', methods=['POST'])
def procesar_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    file = request.files['audio']
    sample_rate = int(request.form.get('sample_rate', 8000))
    bit_depth = int(request.form.get('bit_depth', 4))

    audio = AudioSegment.from_file(file, format="wav").set_channels(1).set_frame_rate(44100)
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)

    samples /= np.max(np.abs(samples))  # Normalizar a rango [-1, 1]

    muestras_resampleadas = resample(samples, int(len(samples) * sample_rate / 44100))
    muestras_cuantizadas = cuantizar(muestras_resampleadas, bit_depth)

    return jsonify({
        "labels": list(range(len(muestras_cuantizadas))),
        "originalSpectrum": muestras_resampleadas.tolist(),
        "processedSpectrum": muestras_cuantizadas.tolist()
    })

if __name__ == '__main__':
    app.run(debug=True)
