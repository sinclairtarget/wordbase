require 'sqlite3'

require_relative 'app'

module DB
  # Loads schema file into database
  def self.init
    schema_file = App.settings.schema_file
    get.execute_batch(File.read(schema_file))
  end

  def self.get
    db = SQLite3::Database.new(App.settings.database)
    db.results_as_hash = true
    db
  end
end
