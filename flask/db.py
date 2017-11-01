import sqlite3
from flask import g
from wordbase_backend import app

def get():
    """Opens a new db connection if none exists in the app context."""
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect()
    return g.sqlite_db

def dict_factory(cursor, row):
    """Converts query result rows to dicts."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def connect():
    """Connects to the specific database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = dict_factory
    return rv

@app.cli.command('initdb')
def init_command():
    """Initializes the database."""
    init()
    print('Initialized the database.')

def init():
    db = get()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

@app.teardown_appcontext
def close(error):
    """Closes db at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()
