require 'rubygems'
require 'bundler'
Bundler.require :default

EventMachine.run do
  @channel = EM::Channel.new

  EventMachine::WebSocket.start(host: "0.0.0.0", port: 8080, debug: true) do |ws|
    ws.onopen do
      sid = @channel.subscribe { |msg| ws.send(msg) }
      @channel.push("#{sid} connected")

      ws.onmessage do |msg|
        message = "<#{sid}> #{msg}"
        @channel.push(message)
      end

      ws.onclose do
         @channel.unsubscribe(sid)
         @channel.push("<#{sid}> left the chat")
      end
    end
  end
end
