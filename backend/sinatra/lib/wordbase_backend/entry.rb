require 'cgi'
require_relative 'errors'

class Entry
  attr_accessor :slug, :word, :definition, :updated_at

  ERR_WORD = 'Entry must have a word'.freeze
  ERR_DEFINTION = 'Entry must have a definition'.freeze

  def initialize(entry_hash)
    @word = entry_hash['word']
    @definition = entry_hash['definition']
    validate!

    @slug = entry_hash['slug'] || self.class.make_slug(@word)
    @updated_at = entry_hash['updatedAt']
  end

  def validate!
    errors = []
    errors << ERR_WORD unless @word && !@word.empty?
    errors << ERR_DEFINTION unless @definition && !@definition.empty?
    raise ValidationError.new(errors) if errors.any?
  end

  def to_hash
    {
      word: word,
      definition: definition,
      location: location,
      updated_at: updated_at
    }
  end

  def location
    '/api/entries/' + slug # hmm, would be nicer to generate this somehow
  end

  def self.make_slug(word)
    CGI.escape(word.gsub(' ', '-'))
  end
end
