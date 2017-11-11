ENV['RACK_ENV'] = 'test'

require 'minitest/autorun'
require 'rack/test'
require 'json'
require 'tempfile'

require 'wordbase_backend'

class TestWordbaseBackend < Minitest::Test
  include Rack::Test::Methods

  SEED_ENTRIES = [
    { slug: 'Gable', word: 'Gable', definition: 'Part of a roof.' },
    { slug: 'Dour', word: 'Dour', definition: 'Serious or morose.' }
  ].freeze

  def setup
    @temp_db_file = Tempfile.new
    App.set :database, @temp_db_file.path
    DB.init
  end

  def teardown
    @temp_db_file.close(unlink_now: true)
  end

  def app
    App
  end

# =============================================================================
# GET /ping
# =============================================================================
  def test_can_get_ping
    get '/ping'
    assert last_response.ok?
    assert_equal 'PONG', last_response.body
  end

# =============================================================================
# GET /entries
# =============================================================================
  def test_can_get_no_entries
    get '/entries'
    assert last_response.ok?
    assert_equal [], JSON.parse(last_response.body)
  end

  def test_can_get_entries
    db = DB.get
    SEED_ENTRIES.each { |entry| insert_entry(DB.get, entry) }

    get '/entries'
    assert last_response.ok?

    parsed_resp = JSON.parse(last_response.body)
    assert_equal SEED_ENTRIES.count, parsed_resp.count
  end

# =============================================================================
# GET /entries/<slug>
# =============================================================================
  def test_can_get_entry
    gable_entry = SEED_ENTRIES.first
    insert_entry(DB.get, gable_entry)

    get '/entries/Gable'
    assert last_response.ok?

    parsed_resp = JSON.parse(last_response.body)
    assert_instance_of Hash, parsed_resp
    assert_equal gable_entry[:word], parsed_resp['word']
    assert_equal gable_entry[:definition], parsed_resp['definition']
  end

  def test_nonexistent_entry_returns_404
    get '/entries/Gable'
    assert last_response.not_found?
  end

  private

  def insert_entry(db, entry)
    db.execute <<-SQL, entry[:slug], entry[:word], entry[:definition]
      insert into entries (slug, word, definition)
      values (?, ? ,?)
    SQL
  end
end
