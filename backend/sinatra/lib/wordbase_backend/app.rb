require 'time'
require 'sinatra/base'
require 'sinatra/json'

require_relative 'db'
require_relative 'entry'
require_relative 'errors'
require_relative 'error_responses'
require_relative 'middleware/unicode_or_bust'

# App::call creates a new "prototype" instance of App if one doesn't yet exist
# Each incoming request is then handled by a new duplicate of the prototype
class App < Sinatra::Base
  include ErrorResponses

  set :database, 'wordbase_backend.db'
  set :schema_file, 'schema.sql'

  enable :logging

  use UnicodeOrBust

  error JSON::ParserError do
    halt_with_response BadJSONRequest
  end

  error ValidationError do |error|
    halt_with_response BadRequestModel, error.error_messages
  end

  get '/ping' do
    'PONG'
  end

  get '/entries' do
    entries = db.execute('select * from entries').map { |row| Entry.new(row) }
    json entries.map(&:to_hash)
  end

  get '/entries/:slug' do |slug|
    entry = get_entry(slug)
    json entry.to_hash
  end

  put '/entries/:slug' do |slug|
    entry_data = JSON.parse(request.body.read)
    entry = get_entry(slug)

    header = request.env['HTTP_IF_UNMODIFIED_SINCE']
    check_if_unmodified_since(entry, header)

    entry.definition = entry_data['definition'] || entry.definition
    db.execute <<-SQL, entry.definition, entry.slug
      update entries set definition=?, updatedAt=datetime('now') where slug=?
    SQL

    entry = get_entry(slug) # To get updatedAt
    json entry.to_hash
  end

  # Idempotent post. Fails on duplicate entry.
  post '/entries' do
    entry_data = JSON.parse(request.body.read)
    entry = Entry.new(entry_data)

    begin
      db.execute <<-SQL, entry.slug, entry.word, entry.definition
        insert into entries (slug, word, definition)
        values (?, ? ,?)
      SQL
    rescue SQLite3::ConstraintException
      halt_with_response DuplicateEntry, entry
    end

    location = url(entry.location)
    headers = { 'Location' => location, 'Content-Location' => location }
    [201, headers, json(entry.to_hash)]
  end

  delete '/entries/:slug' do |slug|
    entry = get_entry(slug)
    db.execute("delete from entries where slug=?", slug)
    204
  end

  private

  # Sinatra does some CRAZY magic to make instance methods callable from the
  # DSL blocks.

  def db
    @db ||= DB.get
  end

  def get_entry(slug)
    row = db.get_first_row("select * from entries where slug=?", slug)
    halt_with_response EntryNotFound, slug unless row
    Entry.new(row)
  end

  def check_if_unmodified_since(entry, header)
    return if header.nil? || header.empty?
    return if entry.updated_at.nil? || entry.updated_at.empty?

    header_datetime = Time.httpdate(header)
    entry_datetime = Time.parse(entry.updated_at + ' UTC')
    halt 412 if entry_datetime > header_datetime
  end
end
