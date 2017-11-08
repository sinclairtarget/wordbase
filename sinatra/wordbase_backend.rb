require 'sinatra/base'

require_relative 'db'

# App#call creates a new instance (prototype) of App if one doesn't yet exist
# It then creates a duplicate instance to hand the request to
class App < Sinatra::Base
  set :database, 'wordbase_backend.db'
  set :schema_file, 'schema.sql'

  get '/ping' do
    'PONG'
  end

  private

  def db
    @db ||= DB.get
  end
end
