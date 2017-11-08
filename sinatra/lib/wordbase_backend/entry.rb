class Entry
  attr_accessor :id, :slug, :word, :definition

  def initialize(entry_hash)
    @id = entry_hash['id']
    @slug = entry_hash['slug']
    @word = entry_hash['word']
    @definition = entry_hash['definition']
  end

  def to_hash
    {
      word: word,
      definition: definition
    }
  end
end
