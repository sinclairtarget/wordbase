require 'sinatra/base'
require 'sinatra/json'

require_relative 'db'
require_relative 'entry'

# App#call creates a new instance (prototype) of App if one doesn't yet exist
# It then creates a duplicate instance to hand the request to
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
