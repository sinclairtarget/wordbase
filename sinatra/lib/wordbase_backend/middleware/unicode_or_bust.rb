# Ehhhhhhhh. Rack + Sinatra will hand you a string in "ASCII-8BIT" otherwise,
# which sqlite3 does NOT like.
class UnicodeOrBust
  def initialize(app)
    @app = app
  end

  def call(env)
    @app.call(force_path_encoding(env))
  end

  def force_path_encoding(env)
    env['PATH_INFO'] = env['PATH_INFO'].force_encoding('UTF-8')
    env
  end
end

