import sqlite3
from flask import g
from .wordbase_backend import app

def get():
    """Opens a new db connection if none exists in the app context."""
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect()
    return g.sqlite_db

def connect():
    """Connects to the specific database."""
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

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
