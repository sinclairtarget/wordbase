import unittest
import os
import tempfile
import wordbase_backend
from flask import json

# Only use inside app context
def insert(entry_dict):
    conn = wordbase_backend.db.get()
    conn.execute(("insert into entries (slug, word, definition)"
                  " values (:slug, :word, :definition)"), entry_dict)
    conn.commit()

class WordbaseBackendTestCase(unittest.TestCase):
    entries = [
        dict(word='Gable',
             definition='Part of a roof.',
             slug='Gable'),
        dict(word='Dour',
             definition='Serious or morose.',
             slug='Dour')
    ]

    def setUp(self):
        wordbase_backend.app.testing = True
        self.client = wordbase_backend.app.test_client()

        temp_file = tempfile.mkstemp()
        self.db_fd, wordbase_backend.app.config['DATABASE'] = temp_file
        with wordbase_backend.app.app_context():
            wordbase_backend.db.init()
            for entry in self.entries:
                insert(entry)

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(wordbase_backend.app.config['DATABASE'])

# =============================================================================
# GET /ping
# =============================================================================
    def test_can_ping(self):
        resp = self.client.get('/ping')
        self.assertEqual(200, resp.status_code)
        self.assertEqual('PONG', resp.get_data(as_text=True))

# =============================================================================
# GET /entries
# =============================================================================
    def test_can_get_entries(self):
        resp = self.client.get('/entries')
        self.assertEqual(200, resp.status_code)
        self.assertEqual(2, len(json.loads(resp.get_data())))

# =============================================================================
# GET /entries/<slug>
# =============================================================================
    def test_can_get_entry(self):
        resp = self.client.get('/entries/Gable')
        self.assertEqual(200, resp.status_code)
        resp_json = json.loads(resp.get_data())

        exp_entry = self.entries[0]
        self.assertEqual(exp_entry['word'], resp_json['word'])
        self.assertEqual(exp_entry['definition'], resp_json['definition'])
        self.assertTrue('location' in resp_json)

    def test_nonexistent_entry_returns_404(self):
        resp = self.client.get('/entries/Foo')
        self.assertEqual(404, resp.status_code)

# =============================================================================
# POST /entries
# =============================================================================
    def test_can_post_valid_entry(self):
        post_data = json.dumps(dict(
            word='Desultory',
            definition='Inconsistent or distracted.'
        ))

        resp = self.client.post('/entries', data=post_data)
        self.assertEqual(201, resp.status_code, resp.get_data(as_text=True))
        self.assertIn('/entries/Desultory', resp.headers['Location'])
        self.assertIn('/entries/Desultory', resp.headers['Content-Location'])

    def test_post_requires_word(self):
        post_data = json.dumps(dict(
            definition='Inconsistent or distracted.'
        ))

        resp = self.client.post('/entries', data=post_data)
        self.assertEqual(400, resp.status_code)

    def test_post_requires_definition(self):
        post_data = json.dumps(dict(
            word='Desultory'
        ))

        resp = self.client.post('/entries', data=post_data)
        self.assertEqual(400, resp.status_code)

    def test_post_duplicate_returns_409(self):
        entry = self.entries[0]
        post_data = json.dumps(
            { k: entry[k] for k in ['word', 'definition'] }
        )

        resp = self.client.post('/entries', data=post_data)
        self.assertEqual(409, resp.status_code)

if __name__ == '__main__':
    unittest.main()
