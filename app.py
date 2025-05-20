from flask import Flask, request, jsonify, render_template
import librosa



app = Flask(__name__)


@app.route('/')
def interfaz():
    return render_template('interfaz.html')


if __name__ == '__main__':
    app.run(debug=True)
