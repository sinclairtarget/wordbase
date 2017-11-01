from flask import Flask, jsonify

app = Flask(__name__)

import db

app.config.update({
    'DATABASE': 'wordbase_backend.db'
})

@app.route('/ping')
def pong():
    return 'PONG'
