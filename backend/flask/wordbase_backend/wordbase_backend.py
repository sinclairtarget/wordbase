from http import HTTPStatus
from flask import Flask, jsonify, request, url_for
import sqlite3

app = Flask(__name__)

from . import db
from .errors import ApplicationException, EntryNotFound, DuplicateEntry
from .entry import Entry

@app.errorhandler(ApplicationException)
def handle_not_found(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.errorhandler(KeyError)
def handle_key_error(error):
    msg = "Required key %s not provided." % error
    response = jsonify(dict(message=msg))
    response.status_code = HTTPStatus.BAD_REQUEST
    return response

app.config.update({
    'DATABASE': 'wordbase_backend.db'
})

def get_entry(slug, conn=None):
    conn = conn or db.get()
    result = conn.execute("select * from entries where slug=?", (slug,)) \
                 .fetchone()
    return Entry(dict(result)) if result else None

@app.route('/ping')
def pong():
    return 'PONG'

@app.route('/entries')
def entries():
    results = db.get() \
                .execute('select * from entries') \
                .fetchall()
    entries = [Entry(dict(r)) for r in results]
    return jsonify([e.to_dict() for e in entries])

@app.route('/entries/<slug>')
def entry(slug):
    entry = get_entry(slug)

    if entry is not None:
        return jsonify(entry.to_dict())
    else:
        raise EntryNotFound

@app.route('/entries', methods=['POST'])
def create_entry():
    """Idempotent POST. Returns error on duplicate create."""
    entry = Entry(request.get_json(force=True))

    conn = db.get()
    try:
        with conn:
            conn.execute(("insert into entries (slug, word, definition) "
                          "values (?, ?, ?)"),
                         (entry.slug, entry.word, entry.definition))
    except sqlite3.IntegrityError:
        raise DuplicateEntry(entry.slug)

    location = url_for('entry', slug=entry.slug, _external=True)
    response = jsonify(entry.to_dict())
    response.status_code = HTTPStatus.CREATED
    response.headers = {
        'Location': location,
        'Content-Location': location
    }
    return response

@app.route('/entries/<slug>', methods=['DELETE'])
def delete_entry(slug):
    entry = get_entry(slug)

    if entry is not None:
        conn = db.get()
        conn.execute("delete from entries where slug=?", (slug,))
        conn.commit()
        return ('', HTTPStatus.NO_CONTENT)
    else:
        raise EntryNotFound
