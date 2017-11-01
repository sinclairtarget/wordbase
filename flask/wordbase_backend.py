from flask import Flask, jsonify

app = Flask(__name__)

import db

app.config.update({
    'DATABASE': 'wordbase_backend.db'
})

@app.route('/ping')
def pong():
    return 'PONG'

@app.route('/entries')
def entries():
    entries = db.get() \
                .execute('select * from entries') \
                .fetchall()
    return jsonify(entries)
