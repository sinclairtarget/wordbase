require 'sinatra/base'
require 'sinatra/json'

require_relative 'db'
require_relative 'entry'
require_relative 'error_handling'
require_relative 'middleware/unicode_or_bust'

# App::call creates a new "prototype" instance of App if one doesn't yet exist
# Each incoming request is then handled by a new duplicate of the prototype
class App < Sinatra::Base
  include ErrorHandling

  set :database, 'wordbase_backend.db'
  set :schema_file, 'schema.sql'

  enable :logging

  use UnicodeOrBust

  get '/ping' do
    'PONG'
  end

  get '/entries' do
    entries = db.execute('select * from entries').map { |row| Entry.new(row) }
    json entries.map(&:to_hash)
  end

  get '/entries/:slug' do |slug|
    row = db.get_first_row("select * from entries where slug=?", slug)
    halt_with_response RecordNotFound, slug unless row
    entry = Entry.new(row)
    json entry.to_hash
  end

  private

  # Sinatra does some CRAZY magic to make instance methods callable from the
  # DSL blocks.

  def db
    @db ||= DB.get
  end
end
