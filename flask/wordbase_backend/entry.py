from urllib import parse
from flask import url_for

def make_slug(word):
    hyphenated = word.replace(' ', '-')
    return parse.quote(hyphenated)

class Entry:
    """Model encapuslating a wordbase entry."""
    def __init__(self, entry_data):
        self.word = entry_data['word']
        self.definition = entry_data['definition']
        self.slug = entry_data.get('word', make_slug(self.word))

    def to_dict(self):
        return dict(word=self.word,
                    definition=self.definition,
                    location=url_for('entry', slug=self.slug, _external=True))
