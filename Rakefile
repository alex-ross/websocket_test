require 'rubygems'
require 'bundler'
Bundler.require :default, :frontend_build

require 'thread'
require 'thwait'

task default: :serve

desc "Runs serve:development"
task serve: :"serve:development"

namespace :serve do
  desc "Serve in development mode"
  task :development do
    serve_with_frontend_path("./client")
  end

  desc "Serve in production mode"
  task :production do
    serve_with_frontend_path("./dist")
  end

  def serve_with_frontend_path(path)
    backend = Thread.new do
      load 'server.rb'
    end

    frontend = Thread.new do
      system *%W(ruby -run -e httpd #{path} -p 8888), out: $stdout, err: :out
    end

    # Let this rake task continue so long the servers are running
    ThreadsWait.all_waits backend, frontend

    at_exit do
      Thread.kill(backend)
      Thread.kill(frontend)
    end
  end
end

desc "Build frontend into ./dist"
task build: %i(build:create_dist_path build:javascript build:html)

namespace :build do
  desc "Copy html files to dist"
  task html: :create_dist_path do
    FileUtils.copy File.join("client", "index.html"),
                   File.join("dist", "index.html")
  end

  desc "Build javascript into dist"
  task javascript: :create_dist_path do
    options = {
      output:   { max_line_len: 80 },
      compress: { angular: true }
    }

    source = File.read(File.join "client", "client.js")

    uglified, source_map = Uglifier.new(options).compile_with_map(source)
    File.write("dist/client.js", uglified)
    File.write("dist/client.js.map", source_map)
  end

  desc "Creates dist path"
  task :create_dist_path do
    FileUtils.mkdir_p "dist"
  end
end

