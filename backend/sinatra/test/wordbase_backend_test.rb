ENV['RACK_ENV'] = 'test'

require 'minitest/autorun'
require 'rack/test'
require 'json'
require 'tempfile'

require 'wordbase_backend'

require_relative 'core_ext/hash'

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
    assert_equal [], parse_json_resp(last_response)
  end

  def test_can_get_entries
    db = DB.get
    SEED_ENTRIES.each { |entry| insert_entry(DB.get, entry) }

    get '/entries'
    assert last_response.ok?

    parsed_resp = parse_json_resp(last_response)
    assert_equal SEED_ENTRIES.count, parsed_resp.count
  end

# =============================================================================
# GET /entries/:slug
# =============================================================================
  def test_can_get_entry
    gable_entry = SEED_ENTRIES.first
    insert_entry(DB.get, gable_entry)

    get '/entries/Gable'
    assert last_response.ok?

    location = "/entries/#{gable_entry[:slug]}"

    parsed_resp = parse_json_resp(last_response)
    assert_instance_of Hash, parsed_resp
    assert_equal gable_entry[:word], parsed_resp['word']
    assert_equal gable_entry[:definition], parsed_resp['definition']
    assert_equal location, parsed_resp['location']
  end

  def test_nonexistent_entry_returns_404
    get '/entries/Foo'
    assert last_response.not_found?
  end

# =============================================================================
# POST /entries
# =============================================================================
  def test_can_post_valid_entry
    valid_entry = SEED_ENTRIES.first
    post_json '/entries', valid_entry.except(:slug)

    assert last_response.created?

    location = "/entries/#{valid_entry[:slug]}"
    assert last_response.headers['Location'] = location
    assert last_response.headers['Content-Location'] = location

    parsed_resp = parse_json_resp(last_response)
    assert_instance_of Hash, parsed_resp
    assert_equal valid_entry[:word], parsed_resp['word']
    assert_equal valid_entry[:definition], parsed_resp['definition']
    assert_equal location, parsed_resp['location']
  end

  def test_post_form_encoded_returns_400
    valid_entry = SEED_ENTRIES.first.except(:slug)
    post '/entries', valid_entry
    assert last_response.bad_request?
  end

  def test_post_invalid_json_returns_400
    post '/entries', '{,}', 'CONTENT_TYPE' => 'application/json'
    assert last_response.bad_request?
  end

  def test_post_with_missing_fields_returns_400
    [:word, :definition].each do |field|
      invalid_entry = SEED_ENTRIES.first.except(:slug, field)
      post_json '/entries', invalid_entry
      assert last_response.bad_request?, last_response.status
    end
  end

  def test_post_duplicate_returns_409
    valid_entry = SEED_ENTRIES.first
    insert_entry(DB.get, valid_entry)
    post_json '/entries', valid_entry.except(:slug)
    assert_equal 409, last_response.status
  end

# =============================================================================
# PUT /entries/:slug
# =============================================================================
  def test_can_update_entry_without_header
    db = DB.get
    valid_entry = SEED_ENTRIES.first
    insert_entry(db, valid_entry)

    slug = valid_entry[:slug]
    put_data = { definition: 'A newer definition.' }
    location = "/entries/#{slug}"
    put_json location, put_data

    assert last_response.ok?
    parsed_resp = parse_json_resp(last_response)
    assert_instance_of Hash, parsed_resp
    assert_equal valid_entry[:word], parsed_resp['word']
    assert_equal put_data[:definition], parsed_resp['definition']
    assert_equal location, parsed_resp['location']

    db_entry = db.get_first_row("select * from entries where slug=?", slug)
    assert_equal valid_entry[:word], db_entry['word']
    assert_equal put_data[:definition], db_entry['definition']
  end

  def test_put_nonexistent_entry_returns_404
    put_json '/entries/Foo', { defintion: 'A newer definition.' }
    assert last_response.not_found?
  end

  def test_post_form_encoded_returns_400
    valid_entry = SEED_ENTRIES.first
    slug = valid_entry[:slug]
    put "/entries/:slug", valid_entry.except(:slug)
    assert last_response.bad_request?
  end

  def test_post_invalid_json_returns_400
    put '/entries/:slug', '{,}', 'CONTENT_TYPE' => 'application/json'
    assert last_response.bad_request?
  end

# =============================================================================
# DELETE /entries/:slug
# =============================================================================
  def test_valid_delete_returns_204
    db = DB.get

    valid_entry = SEED_ENTRIES.first
    insert_entry(db, valid_entry)

    assert_equal 1, db.execute('select * from entries').count

    delete "/entries/#{valid_entry[:slug]}"
    assert last_response.no_content?

    assert_equal 0, db.execute('select * from entries').count
  end

  def test_deleting_nonexistent_returns_404
    delete "/entries/Foo"
    assert last_response.not_found?
  end

  private

  def insert_entry(db, entry)
    db.execute <<-SQL, entry[:slug], entry[:word], entry[:definition]
      insert into entries (slug, word, definition)
      values (?, ? ,?)
    SQL
  end

  def parse_json_resp(resp)
    assert_equal 'application/json', resp.headers['Content-Type']
    JSON.parse(resp.body)
  end

  def post_json(path, json_hash, **env)
    send_json(path, json_hash, 'POST', **env)
  end

  def put_json(path, json_hash, **env)
    send_json(path, json_hash, 'PUT', **env)
  end

  def send_json(path, json_hash, method, **env)
    env = env.merge('CONTENT_TYPE' => 'application/json')

    if method == 'POST'
      post path, json_hash.to_json, env
    elsif method == 'PUT'
      put path, json_hash.to_json, env
    end
  end
end
