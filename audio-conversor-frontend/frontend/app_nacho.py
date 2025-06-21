from flask import Flask, request, jsonify 
from pydub import AudioSegment 
import numpy as np 
from scipy.signal import resample  
app = Flask(__name__)
@app.route('/procesar-audio', methods=['POST']) 
def procesar_audio():    
	file = request.files['audio']     
	target_sr = int(request.form['sample_rate'])     
	bits = int(request.form['bit_depth'])      
	# Cargar audio con pydub     
	audio = AudioSegment.from_file(file)     
	audio = audio.set_channels(1).set_frame_rate(44100)      
	samples = np.array(audio.get_array_of_samples())     
	original_sr = audio.frame_rate      
	# Normalizar a -1.0 a 1.0 (float)     
	signal = samples / (2 ** (audio.sample_width * 8 - 1))      
	# Re-muestreo     
	num_samples = int(len(signal) * target_sr / original_sr)     
	signal_resampled = resample(signal, num_samples)      
	# Cuantización     
	def cuantizar(signal, bits):         
		levels = 2 ** bits         
		min_val = signal.min()         
		max_val = signal.max()         
		norm = (signal - min_val) / (max_val - min_val)         
		cuant = np.round(norm * (levels - 1)) / (levels - 1)         
		return cuant * (max_val - min_val) + min_val      
	signal_cuantizado = cuantizar(signal_resampled, bits)      
	return jsonify({'samples': signal_cuantizado.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
