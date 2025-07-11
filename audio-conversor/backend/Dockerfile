FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Expone el puerto que usará gunicorn
EXPOSE 5000

# Cambiá "app:app" por el módulo y la instancia de tu app Flask
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
