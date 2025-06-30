
# ✅ README.md FINAL — Proyecto: Conversor de Audio Analógico a Digital

### 🎧 Grabá, visualizá y entendé cómo funciona la digitalización del audio con React, Vite y Flask.

---

## 🚀 ¿Qué hace esta app?

Esta aplicación permite:

- 🎤 Grabar audio directamente desde el navegador.
- 📊 Ver cómo cambia la forma de onda al digitalizarla.
- 🎚 Modificar en tiempo real la frecuencia de muestreo y la cantidad de bits de cuantización.
- 📂 Mantener una lista de grabaciones, elegir cuál visualizar y **ver cómo cambia la señal al ajustar los sliders sin volver a grabar**.

Ideal para materias como **Comunicación de Datos**, **Sistemas Digitales**, **Procesamiento de Señales** o proyectos educativos de electrónica/ingeniería.

---

## ⚙️ Tecnologías utilizadas

### 🔵 Frontend

- **React** — Interfaz moderna
- **Vite** — Bundler rápido
- **Chart.js** — Gráficas interactivas
- **Web Audio API** — Grabación del micrófono
- **Canvas** — Render personalizado del simulador

### 🔴 Backend (Python)

- **Flask** — API simple y eficiente
- **pydub** — Conversión de archivos de audio a arrays
- **numpy** — Manipulación numérica
- **scipy** — Re-muestreo de señales
- **ffmpeg** — Requisito para que `pydub` funcione (instalación separada)

---

## 📁 Estructura del proyecto

```
audio-conversor/
├── backend/
│   └── app.py
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles/
│       └── components/
│           ├── Recorder.jsx
│           └── SampleSimulator.jsx
└── README.md
```

---

## 🧱 Requisitos

### ✅ Necesitás tener instalado:

- **Node.js** (v16+ recomendado) 👉 [https://nodejs.org](https://nodejs.org)
- **Python 3.10 u 3.11** (⚠️ Evitá 3.13: `audioop` ya no existe)
- **FFmpeg** (para que `pydub` funcione) 👉 [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

---

## 🛠 Instalación

### 1. Backend (Flask)

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv
venv\Scripts\activate      # en Windows
# source venv/bin/activate # en Linux/Mac

# Instalar dependencias
pip install flask flask-cors pydub numpy scipy
```

> ⚠️ Asegurate que `ffmpeg` esté en el PATH del sistema.

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm install chart.js
```

---

## ▶️ Ejecución del proyecto

### 🔵 Terminal 1 – Levantar el frontend

```bash
cd frontend
npm run dev
```

Accedé en: `http://localhost:5173`

### 🔴 Terminal 2 – Levantar el backend

```bash
cd backend
venv\Scripts\activate
python app.py
```

API en: `http://localhost:5000`

> Ambos deben estar ejecutándose al mismo tiempo.

---

## ✨ Funcionalidades destacadas

- 🔄 **Procesamiento en tiempo real**: cada vez que cambiás los sliders de muestreo o bits, la señal del audio seleccionado se vuelve a procesar dinámicamente.
- 🧠 **Visualización comparativa**: muestra en la misma gráfica la señal original y la procesada.
- 📚 **Simulador gráfico**: además de las grabaciones reales, hay una vista que simula visualmente cómo afecta el muestreo y la cuantización en una onda senoidal.
- 📃 **Lista de grabaciones**: podés grabar varios audios, seleccionarlos y visualizarlos en cualquier orden.

---

## 📡 API – Backend Flask

### `POST /procesar-audio`

**Recibe:**
- `audio`: archivo tipo WebM
- `sample_rate`: frecuencia de muestreo deseada (ej: 8000)
- `bit_depth`: cantidad de bits para cuantización (ej: 4)

**Devuelve:**
```json
{
  "labels": [0, 1, 2, ...],
  "originalSpectrum": [0.03, 0.07, ...],
  "processedSpectrum": [0.0, 0.07, ...]
}
```

---

## 📐 Detalles técnicos (backend)

- Se convierte el audio en mono y 44.1kHz.
- Se normaliza la señal.
- Se remuestrea con `scipy.signal.resample` a la frecuencia deseada.
- Se cuantiza la señal a `2^bit_depth` niveles con normalización lineal.
- Se devuelven arrays de valores listos para graficar.

---

## 🐢 ¿Y si va lento?

Algunas grabaciones pueden tardar más en procesarse dependiendo de la duración. Sugerencias:

- Grabá audios de pocos segundos.
- Limitá la frecuencia de muestreo alta si notás lentitud.
- El procesamiento es síncrono pero eficiente: no bloquea la interfaz.

---

## 👥 Créditos

- Interfaz React: Ariel
- Lógica de procesamiento: combinación de clases, prueba/error y ayuda externa 💪
- Documentación pensada para estudiantes ✍️

---

## ❓ Dudas o mejoras

¡Estás invitado a experimentar! Podés agregar:
- Guardado de audios
- Exportación de resultados
- Carga desde archivos existentes
