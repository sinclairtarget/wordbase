module ErrorHandling
  def halt_with_response(response_klass, *args)
    response = response_klass.new *args
    status, body = response.to_halt_args
    halt status, json(body)
  end

  class Response
    attr_reader :message, :status

    def initialize(msg, status: 500)
      @message = msg
      @status = status
    end

    def to_halt_args
      [status, body]
    end

    def body
      { message: message }
    end
  end

  class RecordNotFound < Response
    def initialize(slug)
      @message = "No entry found with slug: #{slug}."
      @status = 404
    end
  end
end
