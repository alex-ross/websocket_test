angular.module("app", [])

.controller("ChatCtrl", function($scope, $timeout, Message) {
  "use strict";
  $scope.messages = [];
  $scope.newMessage = "";

  var ws = new WebSocket("ws://" + location.hostname + ":8080/");

  ws.onmessage = function(event) {
    $timeout(function() {
      $scope.messages.push(new Message(event.data));
    });
  };

  ws.onopen = function() {
    console.log("Connected");
    ws.send("Hello from " + navigator.userAgent);
  };

  ws.onclose = function() {
    console.log("Socket closed");
  };

  $scope.postMessage = function() {
    ws.send($scope.newMessage);
    $scope.newMessage = "";
  };
})

.factory("Message", function() {
  var Message = function(text) {
    this.text = text;
  };

  return Message;
});

