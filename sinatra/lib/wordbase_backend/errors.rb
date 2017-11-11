class ValidationError < StandardError
  attr_reader :error_messages

  def initialize(error_messages)
    super 'Validation errors: ' + error_messages.to_s
    @error_messages = error_messages
  end
end
