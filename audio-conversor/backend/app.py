from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment
import numpy as np
from scipy.signal import resample
import io
from flask import send_file
from pydub.utils import which

AudioSegment.converter = which("ffmpeg")

app = Flask(__name__)
CORS(app)

def cuantizar(array, bit_depth):
    niveles = 2 ** bit_depth
    array_normalizado = (array - np.min(array)) / (np.max(array) - np.min(array))
    array_cuantizado = np.round(array_normalizado * (niveles - 1)) / (niveles - 1)
    return array_cuantizado * 2 - 1

@app.route('/procesar-audio', methods=['POST'])
def procesar_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    file = request.files['audio']
    sample_rate = int(request.form.get('sample_rate', 8000))
    bit_depth = int(request.form.get('bit_depth', 4))

    try:
        audio = AudioSegment.from_file(file).set_channels(1).set_frame_rate(44100)
        samples = np.array(audio.get_array_of_samples()).astype(np.float32)

        if len(samples) == 0:
            return jsonify({'error': 'El archivo de audio está vacío'}), 400

        samples /= np.max(np.abs(samples))  # Normalizar

        muestras_resampleadas = resample(samples, int(len(samples) * sample_rate / 44100))
        muestras_cuantizadas = cuantizar(muestras_resampleadas, bit_depth)

        return jsonify({
            "labels": list(range(len(muestras_cuantizadas))),
            "originalSpectrum": muestras_resampleadas.tolist(),
            "processedSpectrum": muestras_cuantizadas.tolist()
        })
    except Exception as e:
        return jsonify({'error': f'Error al procesar el audio: {str(e)}'}), 500


@app.route('/exportar-audio', methods=['POST'])
def exportar_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    formato = request.form.get('formato', 'wav')  # 'wav' o 'mp3'
    file = request.files['audio']

    audio = AudioSegment.from_file(file)
    export_buffer = io.BytesIO()

    if formato == 'wav':
        audio.export(export_buffer, format='wav')
        export_buffer.seek(0)
        return send_file(export_buffer, download_name='grabacion.wav', as_attachment=True)
    elif formato == 'mp3':
        audio.export(export_buffer, format='mp3')
        export_buffer.seek(0)
        return send_file(export_buffer, download_name='grabacion.mp3', as_attachment=True)
    else:
        return jsonify({'error': 'Formato no soportado'}), 400

if __name__ == '__main__':
    app.run(debug=True)
