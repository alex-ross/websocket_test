require 'thread'
require 'thwait'

task default: :serve

desc "Serves the application"
task :serve do

  backend = Thread.new do
    load 'server.rb'
  end

  frontend = Thread.new do
    system *%W(ruby -run -e httpd ./client -p 8888), out: $stdout, err: :out
  end

  # Let this rake task continue so long the servers are running
  ThreadsWait.all_waits backend, frontend

  at_exit do
    Thread.kill(backend)
    Thread.kill(frontend)
  end
end
