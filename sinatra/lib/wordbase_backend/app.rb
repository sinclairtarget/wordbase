require 'sinatra/base'
require 'sinatra/json'

require_relative 'db'
require_relative 'entry'

# App::call creates a new "prototype" instance of App if one doesn't yet exist
# Each incoming request is then handled by a new duplicate of the prototype
class App < Sinatra::Base
  set :database, 'wordbase_backend.db'
  set :schema_file, 'schema.sql'

  get '/ping' do
    'PONG'
  end

  get '/entries' do
    entries = db.execute('select * from entries').map { |row| Entry.new(row) }
    json entries.map(&:to_hash)
  end

  private

  def db
    @db ||= DB.get
  end
end
