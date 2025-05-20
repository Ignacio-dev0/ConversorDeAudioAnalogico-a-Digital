# Una aplicación que permita cargar o grabar audio en formato analógico (o simulado) y convertirlo a distintas resoluciones digitales, mostrando cómo varían la calidad y el tamaño del archivo según la configuración de muestreo y cuantización.
# Funcionalidades:
- Grabación de audio en tiempo real con un micrófono.
- Conversión del audio a diferentes tasas de muestreo (ej: 8 kHz, 16 kHz, 44.1 kHz,
96 kHz).
- Cuantización con distintas profundidades de bits (8, 16, 24 bits).
- Comparación de espectros de frecuencia antes y después de la conversión.
- Exportación del audio digitalizado en formatos como WAV o MP3.
# Tecnologías sugeridas:
- Python con pydub y librosa (para procesamiento de audio).
- Aplicación web con WebRTC + Web Audio API (para grabación y conversión en el
navegador).
