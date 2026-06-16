/* ROOM */
var roomName = " 💠    [ʀꜱɪ|ɪᴅ]  -  Scrim Room";
var roomPassword = "s6";
const maxPlayers = 25; 
const roomPublic = true; 
const geo = [{ lat: 10.7748, lon: 106.647  , code: "id" }]; //liga new region

//Real Soccer Variables
var throwTimeOut = 420; // 7 seconds (var is in game ticks)
var gkTimeOut = 600; // 10 seconds (var is in game ticks)
var ckTimeOut = 600; // 10 seconds (var is in game ticks)
var throwinDistance = 270; // distance players can move the ball during throw in
var gameTime = 7; //default game time if 0 is selected

const room = HBInit({
  token: "",
  roomName: roomName,
  maxPlayers: maxPlayers,
  public: roomPublic,
  noPlayer: true,
  password: roomPassword,
  geo: geo[0],
});

const scoreLimitPractice = 0;
const timeLimitPractice = 7;

// here you can place/edit assistance messages, always respecting the " , ". Example: "Nice pass," the player's name will always be after the comma.

var registro = new Map();
room.setTeamsLock(true);
var message;
var adminPassword = "rsi";
// Cooldown period in milliseconds
var cooldownPeriod = 3000; // 2 seconds
var maxMessages = 2; // Maximum messages allowed in the cooldown period

var isPaused = false;
var pauseTimer;
var redPauseCount = 0;
var bluePauseCount = 0;
const maxPauses = 3;

let playerIds = new Set();
let whitelist = new Set([
  "oCk6n6FWrfoalDXXPijIKiPkZG9O1qZsoNmUnJ8ECbg", //mainoo 
  "0Zu3VQi49L7EVFA2vhBhlvHSycK4E7CksBY2v4KpPAc" //m4
]);

// Store last message times and counts for players
var lastMessageTime = {};
var messageCounts = {};

var globalChatEnabled = true;

let isTurneyStarted = false;
let countdownTimeouts = [];
let penKick = false;
let isFirstHalf = true;
let restoringStadium = false;
var announcement30sSent = false; 
var announcement20sSent = false; 
var announcement10sSent = false;

// let firstHalfScores = { red: 0, blue: 0 };
// let secondHalfScores = { red: 0, blue: 0 };
// function updateScores(team) {
//   if (isFirstHalf) {
//     // Update first half scores
//     if (team === 1) {
//       firstHalfScores.red += 1;
//     } else if (team === 2) {
//       firstHalfScores.blue += 1;
//     }
//   } else {
//     // Update second half scores
//     if (team === 1) {
//       secondHalfScores.red += 1;
//     } else if (team === 2) {
//       secondHalfScores.blue += 1;
//     }
//   }
// }

/* STADIUM*/

var playerRadius = 15;
var ballRadius = 6.25;
var triggerDistance = playerRadius + ballRadius + 0.01;

var practiceMap =
`{

	"name" : "RSI Football",

	"width" : 1320,

	"height" : 800,

	"spawnDistance" : 560,
