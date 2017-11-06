from http import HTTPStatus
from flask import jsonify, url_for

class ApplicationException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code

    def to_dict(self):
        return dict(message=self.message)

class EntryNotFound(ApplicationException):
    status_code = 404

    def __init__(self):
        message = 'No entry found.'
        ApplicationException.__init__(self, message)

class DuplicateEntry(ApplicationException):
    """Raised in response to an attempt to create an entry using a slug that
    already exists in the database."""
    status_code = 409

    def __init__(self, slug):
        message = 'An entry already exists for the given word.'
        ApplicationException.__init__(self, message)
        self.location = url_for('entry', slug=slug, _external=true)

    def to_dict(self):
        return dict(message=self.message, location=self.location)


