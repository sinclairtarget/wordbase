module ErrorResponses
  def halt_with_response(response_klass, *args)
    response = response_klass.new *args
    status, body = response.to_a
    halt status, json(body)
  end

  class Response
    attr_reader :message, :status

    def initialize(msg, status=400)
      @message = msg
      @status = status
    end

    def to_a
      [status, body]
    end

    def body
      { message: message }
    end
  end

  class BadJSONRequest < Response
    def initialize
      super 'Could not parse JSON body.'
    end
  end

  class BadRequestModel < Response
    def initialize(validation_error_messages)
      super format(validation_error_messages)
    end

    def format(validation_error_messages)
      'Validation errors: ' + validation_error_messages.join('; ')
    end
  end

  class EntryNotFound < Response
    def initialize(slug)
      super "No entry found with slug: #{slug}.", 404
    end
  end

  class DuplicateEntry < Response
    attr_reader :location

    def initialize(entry)
      @location = entry.location
      super "An entry for the word '#{entry.word}' already exists.", 409
    end

    def body
      super.merge({ location: location })
    end
  end
end
