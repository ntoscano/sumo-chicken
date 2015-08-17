var serverUtils = require('./serverUtils.js');

var playerInformation = {};

var startingLocation = {x: 0,
                        y: 0};

var Player = function() {
  return {
    velocityX: 0,
    velocityY: 0,
    positionX: startingLocation.x,
    positionY: startingLocation.y,
    dashingBool: false,
    kills: 0,
    paused: false,
  };
};

var getPlayers = function() {
  return playerInformation;
};

var getPlayersByLobby = function(socketID) {
  var lobby = serverUtils.getLobbyById(socketID);
  var players = {};
  for (var key in lobby) {
    if (key !== 'numPlayers' && lobby[key] !== '') {
      var playerID = lobby[key];
      players[playerID] = playerInformation[playerID];
    }
  }
  return players;
};

var getStartLoc = function() {
  return startingLocation;
};

var newPlayer = function(socketID) {
  playerInformation[socketID] = Player();
  serverUtils.addToLobby(socketID);
};

var updatePlayer = function(socketID, data) {
  playerInformation[socketID].positionX = data.PX;
  playerInformation[socketID].positionY = data.PY;
  playerInformation[socketID].velocityX = data.VX;
  playerInformation[socketID].velocityY = data.VY;
  playerInformation[socketID].dashingBool = data.dashBool;
};

var dcPlayer = function(socketID) {
  delete playerInformation[socketID];
  serverUtils.removeFromLobby(socketID);
};

var incrementKills = function(socketID) {
  playerInformation[socketID].kills ++;
};

var resetKills = function(socketID) {
  playerInformation[socketID].kills = 0;
};

var pausePlayer = function(socketID, pausedOrResumed) {
  playerInformation[socketID].paused = pausedOrResumed;
};

module.exports = {
  newPlayer: newPlayer,
  updatePlayer: updatePlayer,
  dcPlayer: dcPlayer,
  getPlayers: getPlayers,
  getPlayersByLobby : getPlayersByLobby,
  getStartLoc: getStartLoc,
  incrementKills: incrementKills,
  resetKills: resetKills,
  pausePlayer: pausePlayer
};