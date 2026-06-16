/* ROOM */
var roomName = " 💠    [ʀꜱɪ|ɪᴅ]  -  Scrim Room";
var roomPassword = "s5";
const maxPlayers = 30; 
const roomPublic = true; 
const geo = [{ lat: 10.7748, lon: 106.647  , code: "id" }]; //liga new region

//Real Soccer Variables
var throwTimeOut = 420; // 7 seconds (var is in game ticks)
var gkTimeOut = 600; // 10 seconds (var is in game ticks)
var ckTimeOut = 600; // 10 seconds (var is in game ticks)
var throwinDistance = 270; // distance players can move the ball during throw in
var gameTime = 7; //default game time if 0 is selected

const room = HBInit({
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

	"bg" : { "type" : "grass", "width" : 1270, "height" : 720, "kickOffRadius" : 180, "cornerRadius" : 0, "color" : "454955" },

	"playerPhysics" : {
		"bCoef" : 0.1,
		"invMass" : 0.5,
		"damping" : 0.96,
		"acceleration" : 0.123,
		"kickingAcceleration" : 0.06,
		"kickingDamping" : 0.96,
		"kickStrength" : 7.5,
		"kickback" : 0

	},

	"ballPhysics" : {
		"radius" : 9,
		"invMass" : 0.8,
		"pos" : [ 0, 0
		],
		"color" : "FFFFFF",
		"cMask" : [ "all"
		],
		"cGroup" : [ "ball", "kick", "score"
		],
		"damping" : 0.991,
		"bounciness" : 10,
		"friction" : 0.1

	},

	"vertexes" : [
		/* 0 */ { "x" : 1, "y" : 657, "trait" : "kickOffBarrier" },
		/* 1 */ { "x" : 0, "y" : 180, "trait" : "kickOffBarrier" },
		/* 2 */ { "x" : 0, "y" : -180, "trait" : "kickOffBarrier" },
		/* 3 */ { "x" : 0, "y" : -675, "trait" : "kickOffBarrier" },
		
		/* 4 */ { "x" : 1150, "y" : 320, "trait" : "line" },
		/* 5 */ { "x" : 840, "y" : 320, "trait" : "line" },
		/* 6 */ { "x" : 1150, "y" : -320, "trait" : "line" },
		/* 7 */ { "x" : 840, "y" : -320, "trait" : "line" },
		/* 8 */ { "x" : 1150, "y" : 180, "trait" : "line" },
		/* 9 */ { "x" : 1030, "y" : 180, "trait" : "line" },
		/* 10 */ { "x" : 1150, "y" : -180, "trait" : "line" },
		/* 11 */ { "x" : 1030, "y" : -180, "trait" : "line" },
		/* 12 */ { "x" : 840, "y" : -130, "trait" : "line", "curve" : -130 },
		/* 13 */ { "x" : 840, "y" : 130, "trait" : "line", "curve" : -130 },
		/* 14 */ { "x" : -1150, "y" : -320, "trait" : "line" },
		/* 15 */ { "x" : -840, "y" : -320, "trait" : "line" },
		/* 16 */ { "x" : -1150, "y" : 320, "trait" : "line" },
		/* 17 */ { "x" : -840, "y" : 320, "trait" : "line" },
		/* 18 */ { "x" : -1150, "y" : -175, "trait" : "line" },
		/* 19 */ { "x" : -1030, "y" : -175, "trait" : "line" },
		/* 20 */ { "x" : -1150, "y" : 175, "trait" : "line" },
		/* 21 */ { "x" : -1030, "y" : 175, "trait" : "line" },
		/* 22 */ { "x" : -840, "y" : 130, "trait" : "line", "curve" : -130 },
		/* 23 */ { "x" : -840, "y" : -130, "trait" : "line", "curve" : -130 },
		/* 24 */ { "x" : 935, "y" : 3, "trait" : "line" },
		/* 25 */ { "x" : 935, "y" : -3, "trait" : "line" },
		/* 26 */ { "x" : -935, "y" : 3, "trait" : "line" },
		/* 27 */ { "x" : -935, "y" : -3, "trait" : "line" },
		/* 28 */ { "x" : -1150, "y" : 570, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 29 */ { "x" : -1120, "y" : 600, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 30 */ { "x" : -1120, "y" : -600, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 31 */ { "x" : -1150, "y" : -570, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 32 */ { "x" : 1120, "y" : 600, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 33 */ { "x" : 1150, "y" : 570, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 34 */ { "x" : 1150, "y" : -570, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 35 */ { "x" : 1120, "y" : -600, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		
		/* 36 */ { "x" : 0, "y" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ], "trait" : "kickOffBarrier", "curve" : -180 },
		/* 37 */ { "x" : 0, "y" : -180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "trait" : "kickOffBarrier", "curve" : 180 },
		/* 38 */ { "x" : 0, "y" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "trait" : "kickOffBarrier", "curve" : 180 },
		
		/* 39 */ { "x" : -1030, "y" : -40, "bCoef" : -5.7, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line", "curve" : 70, "color" : "576C46", "vis" : false },
		/* 40 */ { "x" : -1030, "y" : 40, "bCoef" : -5.7, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line", "curve" : 70, "color" : "576C46", "vis" : false },
		/* 41 */ { "x" : 1030, "y" : -40, "bCoef" : -5.7, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line", "curve" : -70, "color" : "576C46", "vis" : false },
		/* 42 */ { "x" : 1030, "y" : 40, "bCoef" : -5.7, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line", "curve" : -70, "color" : "576C46", "vis" : false },
		/* 43 */ { "x" : 1030, "y" : -40, "trait" : "line", "color" : "576C46", "vis" : false },
		/* 44 */ { "x" : 1030, "y" : 40, "trait" : "line", "color" : "576C46", "vis" : false },
		/* 45 */ { "x" : -1030, "y" : -40, "trait" : "line", "color" : "576C46", "vis" : false },
		/* 46 */ { "x" : -1030, "y" : 40, "trait" : "line", "color" : "576C46", "vis" : false },
		/* 47 */ { "x" : 0, "y" : 3, "trait" : "line" },
		/* 48 */ { "x" : 0, "y" : -3, "trait" : "line" },
		
		/* 49 */ { "x" : -1300, "y" : -460, "bCoef" : 0, "cMask" : ["c1" ], "cGroup" : ["red","blue" ], "color" : "ec644b", "vis" : false },
		/* 50 */ { "x" : 1300, "y" : -460, "bCoef" : 0, "cMask" : ["c1" ], "cGroup" : ["red","blue" ], "color" : "ec644b", "vis" : false },
		/* 51 */ { "x" : -1300, "y" : 460, "bCoef" : 0, "cMask" : ["c1" ], "cGroup" : ["red","blue" ], "color" : "ec644b", "vis" : false },
		/* 52 */ { "x" : 1300, "y" : 460, "bCoef" : 0, "cMask" : ["c1" ], "cGroup" : ["red","blue" ], "color" : "ec644b", "vis" : false },
		/* 53 */ { "x" : -1295, "y" : -320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 54 */ { "x" : -840, "y" : -320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 55 */ { "x" : -840, "y" : 320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 56 */ { "x" : -1295, "y" : 320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 57 */ { "x" : 1295, "y" : -320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 58 */ { "x" : 840, "y" : -320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 59 */ { "x" : 840, "y" : 320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 60 */ { "x" : 1295, "y" : 320, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		/* 61 */ { "x" : -1150, "y" : -124, "bCoef" : 0.1, "cMask" : ["ball","red","blue" ] },
		/* 62 */ { "x" : -1220, "y" : -125, "bCoef" : 0.1, "cMask" : ["red","blue" ], "bias" : 0, "curve" : 5 },
		/* 63 */ { "x" : -1150, "y" : 124, "bCoef" : 0.1, "cMask" : ["ball","red","blue" ] },
		/* 64 */ { "x" : -1220, "y" : 123, "bCoef" : 0.1, "cMask" : ["red","blue" ], "bias" : 0, "curve" : 5 },
		/* 65 */ { "x" : -1250, "y" : -158, "bCoef" : 0, "cMask" : ["ball" ] },
		/* 66 */ { "x" : -1250, "y" : 158, "bCoef" : 0, "cMask" : ["ball" ] },
		/* 67 */ { "x" : 1150, "y" : 124, "bCoef" : 0.1, "cMask" : ["ball","red","blue" ] },
		/* 68 */ { "x" : 1220, "y" : 124, "bCoef" : 0.1, "cMask" : ["red","blue" ], "curve" : -5 },
		/* 69 */ { "x" : 1150, "y" : -124, "bCoef" : 0.1, "cMask" : ["ball","red","blue" ] },
		/* 70 */ { "x" : 1220, "y" : -124, "bCoef" : 0.1, "cMask" : ["red","blue" ], "curve" : -5 },
		/* 71 */ { "x" : 1250, "y" : -158, "bCoef" : 0, "cMask" : ["ball" ] },
		/* 72 */ { "x" : 1250, "y" : 158, "bCoef" : 0, "cMask" : ["ball" ] },
		
		/* 73 */ { "x" : -312.44827586206895, "y" : 718, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 74 */ { "x" : -300.44827586206895, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 75 */ { "x" : -98.25862068965517, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 76 */ { "x" : -98.25862068965517, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 77 */ { "x" : -276.9396551724138, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 78 */ { "x" : -121.76724137931035, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 79 */ { "x" : -150.4733928811961, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 80 */ { "x" : -131.96477219154093, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		
		/* 81 */ { "bCoef" : 0.001, "cMask" : ["wall" ], "cGroup" : ["all" ], "v0" : 201, "v1" : 202, "curve" : -328.13941952332, "vis" : false, "color" : "ffffff" },
		
		/* 82 */ { "x" : -98.25862068965517, "y" : 694, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 83 */ { "x" : -98.25862068965517, "y" : 680, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 84 */ { "x" : -0.4358974358974379, "y" : -1.1794871794871824, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 85 */ { "x" : -1150, "y" : -601.444450378418, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 86 */ { "x" : -1150, "y" : 600.4444694519043, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 87 */ { "x" : 1151, "y" : -600.444450378418, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 88 */ { "x" : 1150, "y" : 599.4444694519043, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 89 */ { "x" : -1149, "y" : -601, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 90 */ { "x" : 1150, "y" : -600, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 91 */ { "x" : -1150, "y" : 599, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 92 */ { "x" : 1150, "y" : 600, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 93 */ { "x" : 0, "y" : 601, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 94 */ { "x" : 0, "y" : 718, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 95 */ { "x" : 0, "y" : -719, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 96 */ { "x" : 0, "y" : -602, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 97 */ { "x" : -1270, "y" : 716, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 98 */ { "x" : 1271, "y" : 717, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 99 */ { "x" : -1270, "y" : 719, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 100 */ { "x" : 1271, "y" : 720, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 101 */ { "x" : -1270, "y" : 719, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 102 */ { "x" : 1271, "y" : 720, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 103 */ { "x" : -1269, "y" : 722, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 104 */ { "x" : 1272, "y" : 723, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 105 */ { "x" : -1270, "y" : -722, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 106 */ { "x" : 1271, "y" : -723, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 107 */ { "x" : -1270, "y" : -719, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 108 */ { "x" : 1271, "y" : -720, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 109 */ { "x" : -1269, "y" : -725, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 110 */ { "x" : 1272, "y" : -726, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 111 */ { "x" : -1266, "y" : 721, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 112 */ { "x" : -1266, "y" : -726, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 113 */ { "x" : -1266, "y" : 721, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 114 */ { "x" : -1266, "y" : -726, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 115 */ { "x" : 1269, "y" : 720, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 116 */ { "x" : 1270, "y" : -726, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 117 */ { "x" : -1268, "y" : 721, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 118 */ { "x" : -1268, "y" : -726, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 119 */ { "x" : 1266, "y" : 724, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 120 */ { "x" : 1267, "y" : -722, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 121 */ { "x" : -1271, "y" : 725, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 122 */ { "x" : -1271, "y" : -722, "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		/* 123 */ { "x" : -1133, "y" : -618, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 124 */ { "x" : -1133, "y" : -648, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 125 */ { "x" : -1067, "y" : -648, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 126 */ { "x" : -1101, "y" : -648, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 127 */ { "x" : -1100, "y" : -633, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 128 */ { "x" : -1082, "y" : -633, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 129 */ { "x" : -1082, "y" : -620, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 130 */ { "x" : -1101, "y" : -620, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 131 */ { "x" : -1071, "y" : -641, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 132 */ { "x" : -1071, "y" : -618, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 133 */ { "x" : -1111, "y" : -648, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 134 */ { "x" : -1111, "y" : -634, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 135 */ { "x" : -1133, "y" : -634, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 136 */ { "x" : -1114, "y" : -620, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		
		/* 137 */ { "x" : -210.28125, "y" : 695.0121527777777, "bCoef" : 0.001, "cMask" : ["wall" ], "cGroup" : ["all" ] },
		/* 138 */ { "x" : -209.6105324074074, "y" : 687.6342592592592, "bCoef" : 0.001, "cMask" : ["wall" ], "cGroup" : ["all" ] },
		
		/* 139 */ { "x" : -98.25862068965517, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 140 */ { "x" : -98.25862068965517, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 141 */ { "x" : -98.25862068965517, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 142 */ { "x" : -98.25862068965517, "y" : 653, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 143 */ { "x" : -98.25862068965517, "y" : 695, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 144 */ { "x" : -98.25862068965517, "y" : 679, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 145 */ { "x" : -98.25862068965517, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 146 */ { "x" : -98.25862068965517, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 147 */ { "x" : -179.4733928811961, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 148 */ { "x" : -160.96477219154093, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 149 */ { "x" : -207.4733928811961, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 150 */ { "x" : -188.96477219154093, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 151 */ { "x" : -236.4733928811961, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 152 */ { "x" : -217.96477219154093, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 153 */ { "x" : -265.4733928811961, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 154 */ { "x" : -246.96477219154093, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 155 */ { "x" : -300.2586206896552, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 156 */ { "x" : -300.2586206896552, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 157 */ { "x" : -300.2586206896552, "y" : 694, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 158 */ { "x" : -300.2586206896552, "y" : 680, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 159 */ { "x" : -300.2586206896552, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 160 */ { "x" : -300.2586206896552, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 161 */ { "x" : -300.2586206896552, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 162 */ { "x" : -300.2586206896552, "y" : 653, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 163 */ { "x" : -300.2586206896552, "y" : 695, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 164 */ { "x" : -300.2586206896552, "y" : 679, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 165 */ { "x" : -300.2586206896552, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 166 */ { "x" : -300.2586206896552, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 167 */ { "x" : 96.55172413793105, "y" : 718, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 168 */ { "x" : 108.55172413793105, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 169 */ { "x" : 310.7413793103448, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 170 */ { "x" : 310.7413793103448, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 171 */ { "x" : 132.06034482758622, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 172 */ { "x" : 287.23275862068965, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 173 */ { "x" : 258.5266071188039, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 174 */ { "x" : 277.03522780845907, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 175 */ { "x" : 310.7413793103448, "y" : 694, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 176 */ { "x" : 310.7413793103448, "y" : 680, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		
		/* 177 */ { "x" : 198.71875, "y" : 695.0121527777777, "bCoef" : 0.001, "cMask" : ["wall" ], "cGroup" : ["all" ] },
		/* 178 */ { "x" : 199.3894675925926, "y" : 687.6342592592592, "bCoef" : 0.001, "cMask" : ["wall" ], "cGroup" : ["all" ] },
		
		/* 179 */ { "x" : 310.7413793103448, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 180 */ { "x" : 310.7413793103448, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 181 */ { "x" : 310.7413793103448, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 182 */ { "x" : 310.7413793103448, "y" : 653, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 183 */ { "x" : 310.7413793103448, "y" : 695, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 184 */ { "x" : 310.7413793103448, "y" : 679, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 185 */ { "x" : 310.7413793103448, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 186 */ { "x" : 310.7413793103448, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 187 */ { "x" : 229.5266071188039, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 188 */ { "x" : 248.03522780845907, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 189 */ { "x" : 201.5266071188039, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 190 */ { "x" : 220.03522780845907, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 191 */ { "x" : 172.5266071188039, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 192 */ { "x" : 191.03522780845907, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 193 */ { "x" : 143.5266071188039, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 194 */ { "x" : 162.03522780845907, "y" : 654.0965576171875, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 195 */ { "x" : 108.74137931034483, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 196 */ { "x" : 108.74137931034483, "y" : 654, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 197 */ { "x" : 108.74137931034483, "y" : 694, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 198 */ { "x" : 108.74137931034483, "y" : 680, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 199 */ { "x" : 108.74137931034483, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 200 */ { "x" : 108.74137931034483, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 201 */ { "x" : 108.74137931034483, "y" : 670, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 202 */ { "x" : 108.74137931034483, "y" : 653, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 203 */ { "x" : 108.74137931034483, "y" : 695, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 204 */ { "x" : 108.74137931034483, "y" : 679, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 205 */ { "x" : 108.74137931034483, "y" : 715, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 206 */ { "x" : 108.74137931034483, "y" : 703, "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		/* 207 */ { "x" : -1149.6666679382324, "y" : 599.666748046875, "cMask" : ["wall" ], "trait" : "line" },
		/* 208 */ { "x" : -1148.6666679382324, "y" : -599.833251953125, "cMask" : ["wall" ], "trait" : "line" },
		/* 209 */ { "x" : 1151.0833320617676, "y" : -599.833251953125, "cMask" : ["wall" ], "trait" : "line" },
		/* 210 */ { "x" : 1150.0833320617676, "y" : 598.666748046875, "cMask" : ["wall" ], "trait" : "line" }

	],

	"segments" : [
		{ "v0" : 0, "v1" : 1, "trait" : "kickOffBarrier" },
		{ "v0" : 2, "v1" : 3, "trait" : "kickOffBarrier" },
		
		{ "v0" : 4, "v1" : 5, "trait" : "line", "y" : 320 },
		{ "v0" : 5, "v1" : 7, "trait" : "line", "x" : 840 },
		{ "v0" : 6, "v1" : 7, "trait" : "line", "y" : -320 },
		{ "v0" : 8, "v1" : 9, "trait" : "line", "y" : 180 },
		{ "v0" : 9, "v1" : 11, "trait" : "line", "x" : 1030 },
		{ "v0" : 10, "v1" : 11, "trait" : "line", "y" : -180 },
		{ "v0" : 12, "v1" : 13, "curve" : -130, "trait" : "line", "x" : 840 },
		{ "v0" : 14, "v1" : 15, "trait" : "line", "y" : -320 },
		{ "v0" : 15, "v1" : 17, "trait" : "line", "x" : -840 },
		{ "v0" : 16, "v1" : 17, "trait" : "line", "y" : 320 },
		{ "v0" : 18, "v1" : 19, "trait" : "line", "y" : -175 },
		{ "v0" : 19, "v1" : 21, "trait" : "line", "x" : -1030 },
		{ "v0" : 20, "v1" : 21, "trait" : "line", "y" : 175 },
		{ "v0" : 22, "v1" : 23, "curve" : -130, "trait" : "line", "x" : -840 },
		{ "v0" : 24, "v1" : 25, "curve" : -180, "trait" : "line", "x" : 935 },
		{ "v0" : 26, "v1" : 27, "curve" : -180, "trait" : "line", "x" : -935 },
		{ "v0" : 24, "v1" : 25, "curve" : 180, "trait" : "line", "x" : 935 },
		{ "v0" : 26, "v1" : 27, "curve" : 180, "trait" : "line", "x" : -935 },
		{ "v0" : 24, "v1" : 25, "curve" : 90, "trait" : "line", "x" : 935 },
		{ "v0" : 26, "v1" : 27, "curve" : 90, "trait" : "line", "x" : -935 },
		{ "v0" : 24, "v1" : 25, "curve" : -90, "trait" : "line", "x" : 935 },
		{ "v0" : 26, "v1" : 27, "curve" : -90, "trait" : "line", "x" : -935 },
		{ "v0" : 24, "v1" : 25, "trait" : "line", "x" : 935 },
		{ "v0" : 26, "v1" : 27, "trait" : "line", "x" : -935 },
		{ "v0" : 28, "v1" : 29, "curve" : 90, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 30, "v1" : 31, "curve" : 90, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 32, "v1" : 33, "curve" : 90, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 34, "v1" : 35, "curve" : 90, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		
		{ "v0" : 37, "v1" : 36, "curve" : -180, "vis" : false, "bCoef" : 0.1, "cGroup" : ["blueKO" ], "trait" : "kickOffBarrier" },
		
		{ "v0" : 39, "v1" : 40, "curve" : 70, "vis" : false, "color" : "576C46", "bCoef" : -5.7, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line", "x" : -1030 },
		{ "v0" : 41, "v1" : 42, "curve" : -70, "vis" : false, "color" : "576C46", "bCoef" : -5.7, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line", "x" : 1030 },
		
		{ "v0" : 37, "v1" : 38, "curve" : 180, "vis" : false, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "trait" : "kickOffBarrier" },
		
		{ "v0" : 43, "v1" : 44, "vis" : false, "color" : "576C46", "trait" : "line", "x" : 1030 },
		{ "v0" : 45, "v1" : 46, "vis" : false, "color" : "576C46", "trait" : "line", "x" : -1030 },
		{ "v0" : 47, "v1" : 48, "curve" : -180, "trait" : "line", "x" : -935 },
		{ "v0" : 47, "v1" : 48, "curve" : 180, "trait" : "line", "x" : -935 },
		{ "v0" : 47, "v1" : 48, "curve" : 90, "trait" : "line", "x" : -935 },
		{ "v0" : 47, "v1" : 48, "curve" : -90, "trait" : "line", "x" : -935 },
		{ "v0" : 47, "v1" : 48, "trait" : "line", "x" : -935 },
		
		{ "v0" : 49, "v1" : 50, "vis" : false, "color" : "ec644b", "bCoef" : 0, "cMask" : ["c1" ], "cGroup" : ["red","blue" ], "y" : -460 },
		{ "v0" : 51, "v1" : 52, "vis" : false, "color" : "ec644b", "bCoef" : 0, "cMask" : ["c1" ], "cGroup" : ["red","blue" ], "y" : 460 },
		{ "v0" : 53, "v1" : 54, "vis" : false, "color" : "ec644b", "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		{ "v0" : 54, "v1" : 55, "vis" : false, "color" : "ec644b", "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		{ "v0" : 55, "v1" : 56, "vis" : false, "color" : "ec644b", "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		{ "v0" : 57, "v1" : 58, "vis" : false, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		{ "v0" : 58, "v1" : 59, "vis" : false, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		{ "v0" : 59, "v1" : 60, "vis" : false, "cMask" : ["c0" ], "cGroup" : ["red","blue" ] },
		{ "v0" : 61, "v1" : 62, "color" : "FFFFFF", "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "y" : -124 },
		{ "v0" : 63, "v1" : 64, "color" : "FFFFFF", "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "y" : 124 },
		{ "v0" : 64, "v1" : 62, "curve" : 5, "color" : "FFFFFF", "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "bias" : 0 },
		{ "v0" : 62, "v1" : 65, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ] },
		{ "v0" : 64, "v1" : 66, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ] },
		{ "v0" : 67, "v1" : 68, "color" : "FFFFFF", "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "y" : 124 },
		{ "v0" : 69, "v1" : 70, "color" : "FFFFFF", "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "y" : -124 },
		{ "v0" : 68, "v1" : 70, "curve" : -5, "color" : "FFFFFF", "bCoef" : 0.1, "cMask" : ["ball","red","blue" ] },
		{ "v0" : 70, "v1" : 71, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ] },
		{ "v0" : 68, "v1" : 72, "color" : "FFFFFF", "bCoef" : 0, "cMask" : ["ball" ] },
		
		{ "v0" : 75, "v1" : 76, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 74, "v1" : 77, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 76, "v1" : 78, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 79, "v1" : 80, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 82, "v1" : 83, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 85, "v1" : 86, "curve" : -0.212710733178631, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 87, "v1" : 88, "curve" : -0.5926245099150841, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 89, "v1" : 90, "curve" : -0.05438611790324986, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 91, "v1" : 92, "curve" : -0.05490730726231725, "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 93, "v1" : 94, "curve" : 0, "color" : "6d925c", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 95, "v1" : 96, "curve" : 0, "color" : "6d925c", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 97, "v1" : 98, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 99, "v1" : 100, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 101, "v1" : 102, "curve" : -1.4085579510213782, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 103, "v1" : 104, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 105, "v1" : 106, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 107, "v1" : 108, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 109, "v1" : 110, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 109, "v1" : 103, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 112, "v1" : 111, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 114, "v1" : 113, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 102, "v1" : 110, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 118, "v1" : 117, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 115, "v1" : 116, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 122, "v1" : 121, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 119, "v1" : 120, "vis" : true, "color" : "000000", "bCoef" : -2.9, "cMask" : ["ball" ], "trait" : "line" },
		{ "v0" : 123, "v1" : 124, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 125, "v1" : 126, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 126, "v1" : 127, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 127, "v1" : 128, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 128, "v1" : 129, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 129, "v1" : 130, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 131, "v1" : 132, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 124, "v1" : 133, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 133, "v1" : 134, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 134, "v1" : 135, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 135, "v1" : 136, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 136, "v1" : 130, "color" : "ffffff", "bCoef" : -2.9, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		
		{ "v0" : 137, "v1" : 138, "curve" : -328.13941952332465, "vis" : false, "color" : "4D4C48", "bCoef" : 0.001, "cMask" : ["wall" ], "cGroup" : ["all" ] },
		
		{ "v0" : 139, "v1" : 140, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 141, "v1" : 142, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 143, "v1" : 144, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 145, "v1" : 146, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 147, "v1" : 148, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 149, "v1" : 150, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 151, "v1" : 152, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 153, "v1" : 154, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 155, "v1" : 156, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 157, "v1" : 158, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 159, "v1" : 160, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 161, "v1" : 162, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 163, "v1" : 164, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 165, "v1" : 166, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 169, "v1" : 170, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 168, "v1" : 171, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 170, "v1" : 172, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 173, "v1" : 174, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 175, "v1" : 176, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		
		{ "v0" : 177, "v1" : 178, "curve" : -328.13941952332465, "vis" : false, "color" : "4D4C48", "bCoef" : 0.001, "cMask" : ["wall" ], "cGroup" : ["all" ] },
		
		{ "v0" : 179, "v1" : 180, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 181, "v1" : 182, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 183, "v1" : 184, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 185, "v1" : 186, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 187, "v1" : 188, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 189, "v1" : 190, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 191, "v1" : 192, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 193, "v1" : 194, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 195, "v1" : 196, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 197, "v1" : 198, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 199, "v1" : 200, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 201, "v1" : 202, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 203, "v1" : 204, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" },
		{ "v0" : 205, "v1" : 206, "color" : "ffffff", "bCoef" : 1, "cMask" : ["ball" ], "cGroup" : ["c0" ], "trait" : "line" }

	],

	"goals" : [
		{ "p0" : [-1161.45,124 ], "p1" : [-1161.45,-124 ], "team" : "red" },
		{ "p0" : [1161.45,124 ], "p1" : [1161.45,-124 ], "team" : "blue", "radius" : 0, "invMass" : 1 }

	],

	"discs" : [
		{ "radius" : 0, "invMass" : 0, "pos" : [-1285,-13 ], "color" : "ffffffff", "bCoef" : 0, "cMask" : ["red" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1284,35 ], "color" : "ffffffff", "bCoef" : 0, "cMask" : ["blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1308,62 ], "color" : "ffffffff", "bCoef" : 0, "cMask" : ["red","blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 1.5, "invMass" : 99999999, "pos" : [0,0 ], "color" : "0", "cMask" : [ ] },
		{ "radius" : 1, "invMass" : 99999999, "pos" : [4.5,-5.5 ], "color" : "0", "cMask" : [ ] },
		{ "radius" : 1, "invMass" : 99999999, "pos" : [-6.5,2.5 ], "color" : "0", "cMask" : [ ] },
		{ "radius" : 1, "invMass" : 99999999, "pos" : [-4.5,-5.5 ], "color" : "0", "cMask" : [ ] },
		{ "radius" : 1, "invMass" : 99999999, "pos" : [6.5,2.5 ], "color" : "0", "cMask" : [ ] },
		{ "radius" : 1, "invMass" : 99999999, "pos" : [0,7.5 ], "color" : "0", "cMask" : [ ] },
		{ "radius" : 2.7, "pos" : [-1150,600 ], "cGroup" : ["ball" ], "trait" : "cornerflag" },
		{ "radius" : 2.7, "pos" : [1150,-600 ], "cGroup" : ["ball" ], "trait" : "cornerflag" },
		{ "radius" : 2.7, "pos" : [1150,600 ], "cGroup" : ["ball" ], "trait" : "cornerflag" },
		{ "radius" : 5, "invMass" : 0, "pos" : [-1150,-124 ], "bCoef" : 0.5, "trait" : "goalPost" },
		{ "radius" : 2, "invMass" : 0, "pos" : [-1250,-158 ], "color" : "000000", "bCoef" : 1, "trait" : "goalPost" },
		{ "radius" : 5, "invMass" : 0, "pos" : [1150,-124 ], "bCoef" : 0.5, "trait" : "goalPost" },
		{ "radius" : 2.7, "pos" : [-1149,-601 ], "cGroup" : ["ball" ], "trait" : "cornerflag" },
		{ "radius" : 0, "pos" : [-1149,-460 ], "cMask" : ["none" ] },
		{ "radius" : 0, "pos" : [1149,-460 ], "cMask" : ["none" ] },
		{ "radius" : 0, "pos" : [-1149,-460 ], "cMask" : ["none" ] },
		{ "radius" : 0, "pos" : [1149,-460 ], "cMask" : ["none" ] },
		{ "radius" : 0, "pos" : [-1149,460 ], "cMask" : ["none" ] },
		{ "radius" : 0, "pos" : [1149,460 ], "cMask" : ["none" ] },
		{ "radius" : 0, "pos" : [-1149,460 ], "cMask" : ["none" ] },
		{ "radius" : 0, "pos" : [1149,460 ], "cMask" : ["none" ] },
		{ "radius" : 10.060763888888891, "invMass" : 1e-27, "pos" : [-197.53761574074073,692.3292824074074 ], "color" : "4D4C48", "bCoef" : 1000, "cMask" : ["ball" ], "cGroup" : ["wall" ], "damping" : 1, "speed" : [0,-0.5 ] },
		{ "radius" : 10.060763888888891, "invMass" : 1e-27, "pos" : [211.46238425925927,692.3292824074074 ], "color" : "4D4C48", "bCoef" : 1000, "cMask" : ["ball" ], "cGroup" : ["wall" ], "damping" : 1, "speed" : [0,-0.5 ] },
		{ "radius" : 5, "invMass" : 0, "pos" : [-1150,125 ], "bCoef" : 0.5, "trait" : "goalPost" },
		{ "radius" : 2, "invMass" : 0, "pos" : [-1252,160 ], "color" : "000000", "bCoef" : 1, "trait" : "goalPost" },
		{ "radius" : 5, "invMass" : 0, "pos" : [1151,124 ], "bCoef" : 0.5, "trait" : "goalPost" },
		{ "radius" : 2, "invMass" : 0, "pos" : [1250.75,-158.75 ], "color" : "000000", "bCoef" : 1, "trait" : "goalPost" },
		{ "radius" : 2, "invMass" : 0, "pos" : [1251.75,160.25 ], "color" : "000000", "bCoef" : 1, "trait" : "goalPost" },
		{ "pos" : [-1306,752 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,752 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,751 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,752 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1305,753 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1305,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1305,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1305,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "pos" : [-1304,754 ], "radius" : 0, "color" : "DE1111", "cMask" : ["ball" ] },
		{ "radius" : 0, "pos" : [-303,-216 ], "color" : "00ff00", "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-290,-216 ], "color" : "99ff00", "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-275,-215 ], "color" : "ffff00", "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-257,-215 ], "color" : "ffbb00", "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-243,-215 ], "color" : "ff7700", "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-230,-215 ], "color" : "ff0000", "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] },
		{ "radius" : 0, "pos" : [-10,-10 ], "cMask" : ["c1" ], "cGroup" : ["c0" ] }
	],

	"planes" : [
		{ "normal" : [0,1 ], "dist" : -716, "bCoef" : 0, "cGroup" : ["ball" ], "trait" : "ballArea" },
		{ "normal" : [0,-1 ], "dist" : -714, "bCoef" : 0, "cGroup" : ["ball" ], "trait" : "ballArea" },
		
		{ "normal" : [0,1 ], "dist" : -721, "bCoef" : 0 },
		{ "normal" : [0,-1 ], "dist" : -718, "bCoef" : 0 },
		{ "normal" : [1,0 ], "dist" : -1268, "bCoef" : 0 },
		{ "normal" : [-1,0 ], "dist" : -1266, "bCoef" : 0.1 },
		{ "normal" : [1,0 ], "dist" : -1230, "bCoef" : 0, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		{ "normal" : [-1,0 ], "dist" : -1230, "bCoef" : 0, "cMask" : ["ball" ], "cGroup" : ["ball" ] }

	],

	"traits" : {
		"ballArea" : { "vis" : false, "bCoef" : 0, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		"goalPost" : { "radius" : 5, "invMass" : 0, "bCoef" : 1, "cGroup" : ["ball" ] },
		"rightNet" : { "radius" : 0, "invMass" : 1, "bCoef" : 0, "cGroup" : ["ball","c3" ] },
		"leftNet" : { "radius" : 0, "invMass" : 1, "bCoef" : 0, "cGroup" : ["ball","c2" ] },
		"stanchion" : { "radius" : 3, "invMass" : 0, "bCoef" : 3, "cMask" : ["none" ] },
		"cornerflag" : { "radius" : 3, "invMass" : 0, "bCoef" : 0.2, "color" : "FFFF00", "cMask" : ["ball" ] },
		"reargoalNetleft" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "curve" : 10, "color" : "C7E6BD" },
		"reargoalNetright" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "curve" : -10, "color" : "C7E6BD" },
		"sidegoalNet" : { "vis" : true, "bCoef" : 1, "cMask" : ["ball","red","blue" ], "color" : "C7E6BD" },
		"kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ] },
		"line" : { "vis" : true, "cMask" : [ ], "color" : "C7E6BD" }

	},

	"redSpawnPoints" : [
		[ -222, -177
		],
		[ -228, 174
		],
		[ -684, -89
		],
		[ -692, 57
		],
		[ -1087, -5
		],
		[ -214, 622
		],
		[ -214, 622
		],
		[ -214, 622
		]

	],

	"blueSpawnPoints" : [
		[ 218, -181
		],
		[ 225, 168
		],
		[ 719, 94
		],
		[ 719, -102
		],
		[ 1101, -17
		],
		[ 182, 629
		],
		[ 182, 629
		],
		[ 182, 629
		]

	],

	"joints" : [
 { "d0" : 0, "d1" : 4, "color" : "transparent", "length" : 0 },
 { "d0" : 0, "d1" : 5, "color" : "transparent", "length" : 7.106335201775948 },
 { "d0" : 0, "d1" : 8, "color" : "transparent", "length" : 6.96419413859206 },
 { "d0" : 0, "d1" : 9, "color" : "transparent", "length" : 7.5 },
 { "d0" : 0, "d1" : 6, "color" : "transparent", "length" : 6.96419413859206 },
 { "d0" : 0, "d1" : 7, "color" : "transparent", "length" : 7.106335201775948 },
 { "d0" : 5, "d1" : 7, "color" : "transparent", "length" : 9 },
 { "d0" : 5, "d1" : 8, "color" : "transparent", "length" : 8.246211251235321 },
 { "d0" : 8, "d1" : 9, "color" : "transparent", "length" : 8.200609733428363 },
 { "d0" : 6, "d1" : 9, "color" : "transparent", "length" : 8.200609733428363 },
 { "d0" : 6, "d1" : 7, "color" : "transparent", "length" : 8.246211251235321 },
 { "d0" : 7, "d1" : 8, "color" : "transparent", "length" : 13.601470508735444 },
 { "d0" : 7, "d1" : 9, "color" : "transparent", "length" : 13.756816492197604 },
 { "d0" : 5, "d1" : 9, "color" : "transparent", "length" : 13.756816492197604 },
 { "d0" : 5, "d1" : 6, "color" : "transparent", "length" : 13.601470508735444 },
 { "d0" : 6, "d1" : 8, "color" : "transparent", "length" : 13 },

],

	"cameraFollow" : "ball",

	"kickOffReset" : "full",

	"canBeStored" : false
}`;



var penMap =
 `{

	"name" : "RSI Penalty",

	"width" : 360,

	"height" : 350,

	"spawnDistance" : 215,

	"bg" : { "type" : "grass", "width" : 340, "height" : 340, "kickOffRadius" : 0, "cornerRadius" : 0, "color" : "454955" },

	"vertexes" : [
		/* 0 */ { "x" : 215, "y" : 250, "trait" : "line" },
		/* 1 */ { "x" : -95, "y" : 250, "trait" : "line" },
		/* 2 */ { "x" : 215, "y" : -250, "trait" : "line" },
		/* 3 */ { "x" : -95, "y" : -250, "trait" : "line" },
		/* 4 */ { "x" : 215, "y" : 150, "trait" : "line" },
		/* 5 */ { "x" : 95, "y" : 150, "trait" : "line" },
		/* 6 */ { "x" : 215, "y" : -150, "trait" : "line" },
		/* 7 */ { "x" : 95, "y" : -150, "trait" : "line" },
		/* 8 */ { "x" : -95, "y" : -130, "trait" : "line" },
		/* 9 */ { "x" : -95, "y" : 130, "trait" : "line" },
		/* 10 */ { "x" : 0, "y" : 4, "trait" : "line" },
		/* 11 */ { "x" : 0, "y" : -4, "trait" : "line" },
		
		/* 12 */ { "x" : 215, "y" : 112, "trait" : "goalNet" },
		/* 13 */ { "x" : 280, "y" : 112, "trait" : "goalNet" },
		/* 14 */ { "x" : 215, "y" : -112, "trait" : "goalNet" },
		/* 15 */ { "x" : 280, "y" : -112, "trait" : "goalNet" },
		
		/* 16 */ { "x" : 280, "y" : 112, "trait" : "line" },
		/* 17 */ { "x" : 315, "y" : 150, "trait" : "line" },
		/* 18 */ { "x" : 280, "y" : -111, "trait" : "line" },
		/* 19 */ { "x" : 315, "y" : -150, "trait" : "line" },
		/* 20 */ { "x" : 0, "y" : -338, "trait" : "line" },
		/* 21 */ { "x" : 0, "y" : 339, "trait" : "line" },
		
		/* 22 */ { "x" : 196, "y" : -300, "trait" : "blueLimit" },
		/* 23 */ { "x" : 196, "y" : 300, "trait" : "blueLimit" },
		
		/* 24 */ { "x" : 217, "y" : 340, "trait" : "line" },
		/* 25 */ { "x" : 215, "y" : -340, "trait" : "line" },
		
		/* 26 */ { "x" : -120, "y" : 290, "trait" : "timebar_moving_ball_stop" },
		/* 27 */ { "x" : -120, "y" : 250, "trait" : "timebar_moving_ball_stop" }

	],

	"segments" : [
		{ "v0" : 20, "v1" : 21, "trait" : "line", "color" : "6A8F59" },
		{ "v0" : 0, "v1" : 1, "trait" : "line" },
		{ "v0" : 1, "v1" : 3, "trait" : "line" },
		{ "v0" : 2, "v1" : 3, "trait" : "line" },
		{ "v0" : 4, "v1" : 5, "trait" : "line" },
		{ "v0" : 5, "v1" : 7, "trait" : "line" },
		{ "v0" : 6, "v1" : 7, "trait" : "line" },
		{ "v0" : 8, "v1" : 9, "trait" : "line", "curve" : -130 },
		{ "v0" : 10, "v1" : 11, "trait" : "line", "curve" : -180 },
		{ "v0" : 10, "v1" : 11, "trait" : "line", "curve" : 180 },
		{ "v0" : 10, "v1" : 11, "trait" : "line", "curve" : 90 },
		{ "v0" : 10, "v1" : 11, "trait" : "line", "curve" : -90 },
		{ "v0" : 10, "v1" : 11, "trait" : "line" },
		
		{ "v0" : 13, "v1" : 15, "trait" : "goalNet", "curve" : 0.5209125406123253 },
		{ "v0" : 12, "v1" : 13, "trait" : "goalNet", "curve" : -2.290030455344583 },
		{ "v0" : 14, "v1" : 15, "trait" : "goalNet", "curve" : 1.8262384781321854 },
		
		{ "v0" : 16, "v1" : 17, "trait" : "line", "color" : "FFFFFF" },
		{ "v0" : 18, "v1" : 19, "trait" : "line", "color" : "FFFFFF" },
		
		{ "v0" : 22, "v1" : 23, "trait" : "blueLimit" },
		
		{ "v0" : 24, "v1" : 25, "trait" : "line" },
		
		{ "v0" : 26, "v1" : 27, "trait" : "timebar_moving_ball_stop" }

	],

	"goals" : [
		{ "p0" : [225,110 ], "p1" : [225,-110 ], "team" : "blue" },
		{ "p0" : [215,-112 ], "p1" : [-10,-10 ], "team" : "red" },
		{ "p0" : [-10,-10 ], "p1" : [-10,10 ], "team" : "red" },
		{ "p0" : [-10,10 ], "p1" : [215,112 ], "team" : "red" }

	],

	"discs" : [
		{ "radius" : 9, "invMass" : 0.8, "pos" : [0,0 ], "color" : "FFFFFF", "cMask" : ["all" ], "cGroup" : ["ball","kick","score" ], "damping" : 0.990, "bounciness" : 0.8, "friction" : 0.05 },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1285,-13 ], "color" : "ffffffff", "bCoef" : 0, "cMask" : ["red" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1284,35 ], "color" : "ffffffff", "bCoef" : 0, "cMask" : ["blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1308,62 ], "color" : "ffffffff", "bCoef" : 0, "cMask" : ["red","blue" ], "cGroup" : ["ball" ] },
		
		{ "radius" : 9.1, "pos" : [0,0 ], "color" : "transparent", "trait" : "jb" },
		{ "radius" : 1.5, "pos" : [0,0 ], "trait" : "jb" },
		{ "radius" : 1.15, "pos" : [6.8476,2.2249 ], "trait" : "jb" },
		{ "radius" : 1.15, "pos" : [0,7.2 ], "trait" : "jb" },
		{ "radius" : 1.15, "pos" : [-6.8476,2.2249 ], "trait" : "jb" },
		{ "radius" : 1.15, "pos" : [-4.2321,-5.8249 ], "trait" : "jb" },
		{ "radius" : 1.15, "pos" : [4.2321,-5.8249 ], "trait" : "jb" },
		
		{ "pos" : [215,112 ], "trait" : "goalPost", "color" : "FFFFFF" },
		{ "pos" : [215,-112 ], "trait" : "goalPost", "color" : "FFFFFF" },
		
		{ "pos" : [315,150 ], "trait" : "stanchion", "color" : "000000" },
		{ "pos" : [315,-150 ], "trait" : "stanchion", "color" : "000000" },
		
		{ "pos" : [-120,272 ], "trait" : "timebar_ball_constant" },
		
		{ "pos" : [120,272 ], "trait" : "timebar_ball_constant_2" },
		
		{ "pos" : [120,272 ], "trait" : "timebar_ball_moving", "speed" : [-0.4,0 ] }

	],

	"planes" : [
		{ "normal" : [0,1 ], "dist" : -300, "bCoef" : 0 },
		{ "normal" : [0,-1 ], "dist" : -300, "bCoef" : 0 },
		{ "normal" : [1,0 ], "dist" : -246, "bCoef" : 0 },
		{ "normal" : [-1,0 ], "dist" : -285, "bCoef" : 0 },
		{ "normal" : [-1,0 ], "dist" : -17, "bCoef" : 0, "cMask" : ["red" ] },
		
		{ "normal" : [-1,0 ], "dist" : -250, "trait" : "blueLimit" }

	],

	"traits" : {
		"jb" : { "cMask" : [ ], "cGroup" : ["c0" ], "invMass" : 1e+250, "radius" : 0.8, "color" : "000000" },
		"ballArea" : { "vis" : false, "bCoef" : 0, "cMask" : ["ball" ] },
		"goalPost" : { "radius" : 5, "invMass" : 0, "bCoef" : 0.5 },
		"stanchion" : { "radius" : 3, "cMask" : ["" ] },
		"goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball","red","blue" ], "color" : "FFFFFF" },
		"line" : { "vis" : true, "cMask" : ["" ], "color" : "C7E6BD" },
		"blueLimit" : { "vis" : false, "bCoef" : 0, "cMask" : ["blue" ] },
		"kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ] },
		"timebar_ball_constant" : { "bCoef" : 0, "radius" : 0, "invMass" : 0, "damping" : 0, "cMask" : ["c1" ], "cGroup" : ["c1" ] },
		"timebar_ball_constant_2" : { "bCoef" : 0, "radius" : 0, "invMass" : 0, "damping" : 0, "cMask" : ["none" ], "cGroup" : ["none" ] },
		"timebar_ball_moving" : { "bCoef" : 0, "radius" : 0, "invMass" : 5e-324, "damping" : 1, "cMask" : ["c1" ], "cGroup" : ["c1" ] },
		"timebar_moving_ball_stop" : { "vis" : false, "bCoef" : 0, "cMask" : ["c1" ], "cGroup" : ["c1" ], "bias" : -280 }

	},

	"playerPhysics" : {
		"acceleration" : 0.123,
		"kickStrength" : 7.5


	},

	"cameraFollow" : "player",

	"ballPhysics" : "disc0",

	"joints" : [
		{ "d0" : 0, "d1" : 4, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 4, "d1" : 5, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 0, "d1" : 6, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 4, "d1" : 6, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 7, "d1" : 6, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 8, "d1" : 6, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 0, "d1" : 7, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 4, "d1" : 7, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 8, "d1" : 7, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 9, "d1" : 7, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 0, "d1" : 8, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 4, "d1" : 8, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 9, "d1" : 8, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 10, "d1" : 8, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 0, "d1" : 9, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 4, "d1" : 9, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 10, "d1" : 9, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 6, "d1" : 9, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 0, "d1" : 10, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 4, "d1" : 10, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 6, "d1" : 10, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 7, "d1" : 10, "strength" : "rigid", "color" : "transparent" },
		{ "d0" : 15, "d1" : 16, "color" : "718C5A" },
		{ "d0" : 15, "d1" : 17, "color" : "C7E6BD", "length" : [0,240 ] }

	],

  "canBeStored" : false
}`

  /* MODE */

var afkLimit = 1000; // limite de afk (150)
var drawTimeLimit = 1; // minutos
var maxTeamSize = 6; // máximo de jogadores num time, isso funciona para 1 (você pode querer adaptar as coisas para remover algumas estatísticas inúteis em 1v1, como assist ou cs), 2, 3 ou 4
var slowMode = 1;

/* TIM */

const Team = {
  SPECTATORS: 0,
  RED: 1,
  BLUE: 2,
};
var extendedP = [];
const eP = {
  ID: 0,
  AUTH: 1,
  CONN: 2,
  AFK: 3,
  ACT: 4,
  GK: 5,
  MUTE: 6,
};
const Ss = {
  GA: 0,
  WI: 1,
  DR: 2,
  LS: 3,
  WR: 4,
  GL: 5,
  AS: 6,
  GK: 7,
  CS: 8,
  CP: 9,
  RL: 10,
  NK: 11,
};
var players;
var TeamR;
var TeamB;
var teamS;
var messageHistory = [0, 0, 0, 0, 0, 0];
var messageCounter = 0;

/* GAME */


let link = ["https://www.haxball.com/play?c=_", "https://www.haxball.com", "haxball.com", ".com", "https://", "https:", "https://www."];

var lastTeamTouched; // records who was the last to touch the ball
var lastPlayersTouched; // allows you to receive good goal notifications (must be lastPlayersKicked, waiting for a next update to get better control of shots on target)
var lastBallPositionForTouch = null;
var countAFK = false; // created to get better control of the activity, kicks if it's AFK
var activePlay = false; // created to gain better control of ball possession
var goldenGoal = false;
var SMSet = new Set(); // set created to get slow mode which is useful in ChooseMode
var banList = []; // keep track of bans, so we can unban people if we want

/* STATS */

var game;
var GKList = ["", ""];
var Rposs = 0;
var Bposs = 0;
var point = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 0,
    y: 0,
  },
]; // created to obtain ball speed
var ballSpeed;
var lastWinner = Team.SPECTATORS;
var streak = 0;
var allBlues = []; // this is to count the players who should be counted for statistics. This includes players who left after the game started.
var allReds = [];

/* BALANCE AND RECRUITMENT */

var inChooseMode = false; // this variable allows you to distinguish the 2 phases of the game and choose which ones should be treated very differently

/* ASSISTANT */

var checkTimeVariable = false; // this is created so that chat doesn't get spammed when a game ends via timeLimit
var announced = false;
var statNumber = 0; // this allows the room to receive statistical information every X minutes
var endGameVariable = false; // this variable with the one below helps distinguish cases where games are stopped because they are over from those where games are stopped due to player movements or team resets
var statInterval = 6;

loadMap(practiceMap, scoreLimitPractice, timeLimitPractice);

/* OBJECTS */

function Goal(time, team, striker, assist) {
  this.time = time;
  this.team = team;
  this.striker = striker;
  this.assist = assist;
}

// -------------------------------------------------
// Classes
// -------------------------------------------------
class Game {
  constructor(date, scores, goals) {
    this.time = 0;
    this.paused = false;
    this.ballRadius;
    this.date = date;
    this.scores = scores;
    this.goals = goals;
    this.rsTouchTeam = 0;
    this.rsActive = true;
    this.rsReady = false;
    this.rsCorner = false;
    this.rsGoalKick = false;
    this.rsSwingTimer = 1000;
    this.rsTimer;
    this.ballOutPositionX;
    this.ballOutPositionY;
    this.throwInPosY;
    this.outStatus = "";
    this.warningCount = 0;
    this.bringThrowBack = false;
    this.extraTime = false;
    this.extraTimeCount = 0;
    this.extraTimeEnd;
    this.extraTimeAnnounced = false;
    this.lastPlayAnnounced = false;
    this.boosterState;
    this.throwinKicked = false;
    this.pushedOut;
    this.redScore = 0;
    this.blueScore = 0;
  }
}


/* FUNCTIONS */

function centerText(string) {
  var space = parseInt((80 - string.length) * 0.8, 10);
  if (space <= 0) {
    return "";
  }
  return " ".repeat(space) + string + " ".repeat(space);
}


function getCurrentTime() {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
}

/* CHASING */
/* AUXILIARY FUNCTIONS */

function pointDistance(p1, p2) {
  var d1 = p1.x - p2.x;
  var d2 = p1.y - p2.y;
  return Math.sqrt(d1 * d1 + d2 * d2);
}

function distanceToBallPath(point, start, end) {
  if (start == null || end == null) {
    return Infinity;
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared == 0) {
    return pointDistance(point, end);
  }

  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return pointDistance(point, { x: start.x + t * dx, y: start.y + t * dy });
}

function ballPathProgress(point, start, end) {
  if (start == null || end == null) {
    return 0;
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared == 0) {
    return 1;
  }

  return Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/* BUTTONS */

/* GAME FUNCTIONS */

function checkTime() {
  const scores = room.getScores();
  game.scores = scores;
  if (Math.abs(scores.time - scores.timeLimit) <= 0.01 && scores.timeLimit != 0) {
    if (scores.red != scores.blue) {
      if (checkTimeVariable == false) {
        checkTimeVariable = true;
        setTimeout(() => {
          checkTimeVariable = false;
        }, 3000);
        scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
        setTimeout(() => {
          room.stopGame();
        }, 2000);
      }
      return;
    }
    goldenGoal = true;
    // room.sendAnnouncement("⚽ Gol de Gold!", null, 0xF1AF09);
    room.sendAnnouncement(centerText("EXTRA TIME"), null, 0xffff17, "bold");
    room.sendAnnouncement(centerText("Added +" + drawTimeLimit * 60 + " seconds!"), null, 0xffffff, "normal");
    room.sendAnnouncement(centerText("⚽ First goal wins! ⚽"), null, 0xffffff, "normal");
  }
  if (scores.time > scores.timeLimit + drawTimeLimit * 60 - 15 && scores.time <= scores.timeLimit + drawTimeLimit * 60) {
    if (checkTimeVariable == false && announced == false) {
      checkTimeVariable = true;
      announced = true;
      setTimeout(() => {
        checkTimeVariable = false;
      }, 10);
      room.sendAnnouncement(centerText("⌛ 15 seconds to draw!"), null, 0xffff17, "bold");
    }
  }
  if (scores.time > scores.timeLimit + drawTimeLimit * 60) {
    if (checkTimeVariable == false) {
      checkTimeVariable = true;
      setTimeout(() => {
        checkTimeVariable = false;
      }, 10);
      endGame(Team.SPECTATORS);
      room.stopGame();
      goldenGoal = false;
    }
  }
}


function endGame(winner) {
  const scores = room.getScores();
  game.scores = scores;
  Rposs = Rposs / (Rposs + Bposs);
  Bposs = 1 - Rposs;
  lastWinner = winner;
  endGameVariable = true;
  if (winner == Team.RED) {
    streak++;
    //room.sendAnnouncement(centerText("🏆 Red team won! | Win Streak(s):") + streak + " 🏆", null, 0xfdc43a);
  } else if (winner == Team.BLUE) {
    streak = 1;
    //room.sendAnnouncement(centerText("🏆 Blue team won! | Win streak(s):") + streak + " 🏆", null, 0xfdc43a);
  } else {
    streak = 0;
    room.sendAnnouncement("💤 ʟɪᴍɪᴛ ʀᴇᴀᴄʜᴇᴅ");
  }
  if (!isFirstHalf) {
    room.sendAnnouncement(centerText("🏆 FULL TIME 🏆"), null, 0xffffff, "bold");
    room.sendAnnouncement(centerText(" " + scores.red + " - " + scores.blue), null, 0xffffff, "normal");
    room.sendAnnouncement(centerText((Rposs * 100).toPrecision(3).toString() + "% | Ball possession | " + (Bposs * 100).toPrecision(3).toString() + "% "), null, 0xffffff, "normal");
  }
  // scores.red == 0
  //   ? scores.blue == 0
  //     ? room.sendAnnouncement("🥅 " + GKList[0].name + " it's a man? no, it's a barrier! " + GKList[1].name + " saved all goals ", null, 0xfdc43a)
  //     : room.sendAnnouncement("🥅 it's a man? no, it's a barrier! " + GKList[1].name + " saved all goals ", null, 0xfdc43a)
  //   : scores.blue == 0
  //   ? room.sendAnnouncement("🥅 it's a man? no, it's a barrier! " + GKList[0].name + " saved all goals ", null, 0xfdc43a)
  //   : null;
  updateStats();
}

function loadMap(map, scoreLim = scoreLimitPractice, timeLim = timeLimitPractice) {
  if (map != "") {
    room.setCustomStadium(map);
  } else {
    //console.log("There was an error loading the stadium");
    room.setDefaultStadium("Classic");
  }
  room.setScoreLimit(scoreLim);
  room.setTimeLimit(timeLim);
}

function resetRealSoccerState() {
  game = new Game(Date.now(), room.getScores(), []);
  lastPlayersTouched = [null, null];
  lastTeamTouched = Team.SPECTATORS;
  activePlay = false;
  countAFK = false;
  game.rsActive = true;
  game.rsReady = false;
  game.rsCorner = false;
  game.rsGoalKick = false;
  game.outStatus = "";
  game.rsTimer = 0;
  lastBallPositionForTouch = null;
}

function hasRequiredRealSoccerDiscs() {
  try {
    return room.getDiscProperties(0) != null && room.getDiscProperties(1) != null && room.getDiscProperties(2) != null && room.getDiscProperties(3) != null;
  } catch (e) {
    return false;
  }
}

function stopGameIfRunning() {
  if (room.getScores() != null) {
    room.stopGame();
  }
}

function updateTeams() {
  // updates the list of players and the list of all teams
  players = room.getPlayerList().filter((player) => player.id != 0 && !getAFK(player));
  TeamR = players.filter((p) => p.team === Team.RED);
  TeamB = players.filter((p) => p.team === Team.BLUE);
  teamS = players.filter((p) => p.team === Team.SPECTATORS);
}

function handleInactivity() {
  // handles inactivity: players will be kicked after afkLimit
  if (countAFK && TeamR.length + TeamB.length > 1) {
    for (var i = 0; i < TeamR.length; i++) {
      setActivity(TeamR[i], getActivity(TeamR[i]) + 1);
    }
    for (var i = 0; i < TeamB.length; i++) {
      setActivity(TeamB[i], getActivity(TeamB[i]) + 1);
    }
  }
  for (var i = 0; i < extendedP.length; i++) {
    if (extendedP[i][eP.ACT] == 60 * ((2 / 3) * afkLimit)) {
      room.sendAnnouncement("@" + room.getPlayer(extendedP[i][eP.ID]).name + " AFK detected... Move within " + Math.floor(afkLimit / 3) + "s to cancel", extendedP[i][eP.ID], 0xf4a404, "bold", 2);
    }
    if (extendedP[i][eP.ACT] >= 60 * afkLimit) {
      extendedP[i][eP.ACT] = 0;
      if (room.getScores().time <= afkLimit - 0.5) {
        setTimeout(() => {
          !inChooseMode ? quickRestart() : room.stopGame();
        }, 10);
      }
      room.kickPlayer(extendedP[i][eP.ID], "ᴀꜰᴋ", false);
    }
  }
}

function getAuth(player) {
  return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.AUTH] : null;
}

function getAFK(player) {
  return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.AFK] : null;
}

function setAFK(player, value) {
  extendedP.filter((a) => a[0] == player.id).forEach((player) => (player[eP.AFK] = value));
}

function getActivity(player) {
  return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.ACT] : null;
}

function setActivity(player, value) {
  extendedP.filter((a) => a[0] == player.id).forEach((player) => (player[eP.ACT] = value));
}

function getGK(player) {
  return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.GK] : null;
}

function setGK(player, value) {
  extendedP.filter((a) => a[0] == player.id).forEach((player) => (player[eP.GK] = value));
}

function getMute(player) {
  return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.MUTE] : null;
}

function setMute(player, value) {
  extendedP.filter((a) => a[0] == player.id).forEach((player) => (player[eP.MUTE] = value));
}

/* STATISTICS FUNCTIONS */

function recordBallTouch(player) {
  if (player == null || player.team == Team.SPECTATORS) {
    return;
  }

  !activePlay ? (activePlay = true) : null;
  if (lastPlayersTouched[0] == null || lastPlayersTouched[0].id != player.id) {
    lastPlayersTouched[1] = lastPlayersTouched[0];
    lastPlayersTouched[0] = player;
  }
  lastTeamTouched = player.team;
  game.rsTouchTeam = player.team;
}

function getLastTouchOfTheBall() {
  const ballPosition = room.getBallPosition();
  updateTeams();
  for (var i = 0; i < players.length; i++) {
    if (players[i].position != null) {
      var distanceToBall = pointDistance(players[i].position, ballPosition);
      if (distanceToBall < triggerDistance) {
        recordBallTouch(players[i]);
      }
    }
  }
}

function getStats() {
  // gives possession, ball speed and GK of each team
  if (activePlay) {
    updateTeams();
    lastTeamTouched == Team.RED ? Rposs++ : Bposs++;
    var ballPosition = room.getBallPosition();
    point[1] = point[0];
    point[0] = ballPosition;
    ballSpeed = (pointDistance(point[0], point[1]) * 60 * 60 * 60) / 15000;
    var k = [-1, Infinity];
    for (var i = 0; i < TeamR.length; i++) {
      if (TeamR[i].position.x < k[1]) {
        k[0] = TeamR[i];
        k[1] = TeamR[i].position.x;
      }
    }
    k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
    k = [-1, -Infinity];
    for (var i = 0; i < TeamB.length; i++) {
      if (TeamB[i].position.x > k[1]) {
        k[0] = TeamB[i];
        k[1] = TeamB[i].position.x;
      }
    }
    k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
    findGK();
  }
}

function updateStats() {
  if (
    players.length >= 2 * maxTeamSize &&
    (game.scores.time >= (5 / 6) * game.scores.timeLimit || game.scores.red == game.scores.scoreLimit || game.scores.blue == game.scores.scoreLimit) &&
    allReds.length >= maxTeamSize &&
    allBlues.length >= maxTeamSize
  ) {
    var stats;
    for (var i = 0; i < allReds.length; i++) {
      localStorage.getItem(getAuth(allReds[i])) ? (stats = JSON.parse(localStorage.getItem(getAuth(allReds[i])))) : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allReds[i].name]);
      stats[Ss.GA]++;
      lastWinner == Team.RED ? stats[Ss.WI]++ : lastWinner == Team.BLUE ? stats[Ss.LS]++ : stats[Ss.DR]++;
      stats[Ss.WR] = ((100 * stats[Ss.WI]) / stats[Ss.GA]).toPrecision(3);
      localStorage.setItem(getAuth(allReds[i]), JSON.stringify(stats));
    }
    for (var i = 0; i < allBlues.length; i++) {
      localStorage.getItem(getAuth(allBlues[i])) ? (stats = JSON.parse(localStorage.getItem(getAuth(allBlues[i])))) : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allBlues[i].name]);
      stats[Ss.GA]++;
      lastWinner == Team.BLUE ? stats[Ss.WI]++ : lastWinner == Team.RED ? stats[Ss.LS]++ : stats[Ss.DR]++;
      stats[Ss.WR] = ((100 * stats[Ss.WI]) / stats[Ss.GA]).toPrecision(3);
      localStorage.setItem(getAuth(allBlues[i]), JSON.stringify(stats));
    }
    for (var i = 0; i < game.goals.length; i++) {
      if (game.goals[i].striker != null) {
        if (allBlues.concat(allReds).findIndex((player) => player.id == game.goals[i].striker.id) != -1) {
          stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].striker)));
          stats[Ss.GL]++;
          localStorage.setItem(getAuth(game.goals[i].striker), JSON.stringify(stats));
        }
      }
      if (game.goals[i].assist != null) {
        if (allBlues.concat(allReds).findIndex((player) => player.name == game.goals[i].assist.name) != -1) {
          stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].assist)));
          stats[Ss.AS]++;
          localStorage.setItem(getAuth(game.goals[i].assist), JSON.stringify(stats));
        }
      }
    }
    if (allReds.findIndex((player) => player.id == GKList[0].id) != -1) {
      stats = JSON.parse(localStorage.getItem(getAuth(GKList[0])));
      stats[Ss.GK]++;
      game.scores.blue == 0 ? stats[Ss.CS]++ : null;
      stats[Ss.CP] = ((100 * stats[Ss.CS]) / stats[Ss.GK]).toPrecision(3);
      localStorage.setItem(getAuth(GKList[0]), JSON.stringify(stats));
    }
    if (allBlues.findIndex((player) => player.id == GKList[1].id) != -1) {
      stats = JSON.parse(localStorage.getItem(getAuth(GKList[1])));
      stats[Ss.GK]++;
      game.scores.red == 0 ? stats[Ss.CS]++ : null;
      stats[Ss.CP] = ((100 * stats[Ss.CS]) / stats[Ss.GK]).toPrecision(3);
      localStorage.setItem(getAuth(GKList[1]), JSON.stringify(stats));
    }
  }
}

function findGK() {
  var tab = [
    [-1, ""],
    [-1, ""],
  ];
  for (var i = 0; i < extendedP.length; i++) {
    if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.RED) {
      if (tab[0][0] < extendedP[i][eP.GK]) {
        tab[0][0] = extendedP[i][eP.GK];
        tab[0][1] = room.getPlayer(extendedP[i][eP.ID]);
      }
    } else if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.BLUE) {
      if (tab[1][0] < extendedP[i][eP.GK]) {
        tab[1][0] = extendedP[i][eP.GK];
        tab[1][1] = room.getPlayer(extendedP[i][eP.ID]);
      }
    }
  }
  GKList = [tab[0][1], tab[1][1]];
}

/* PLAYER MOVEMENT */

const specialAuths = [
  "Gz6lv-5YsUCk-bJHBxyzbXtFAV2O3edJUev3DhEf_xA", //fox
  "0Zu3VQi49L7EVFA2vhBhlvHSycK4E7CksBY2v4KpPAc", //m4
  "LnEtoSdVonFZdGMYKDUVPAWb-SzD-PsUMJC2nDPHO5w", //roti
  "EKGPaC2usPnvew9o0KH9P6J3nSmBOpKf3meC25VidQo", //stickmar
  "4sNwsfwEjsR37sYEkXMatM8YkcjM3KaJ5uoC2WJ02rY" //bizkit
];
const specialConns = [
  "33362E37332E33352E313832", //fox
  "3130332E37352E35352E3632", //m4
  "3132392E3232372E33392E313139", //roti
  "3134302E3231332E3132372E3337", //bizkit
  "3138322E332E34352E323331" //stickmar
];

room.onPlayerJoin = function (player) {
  var id = player.id;
  var auth = player.auth;
  var playername = player.name;

  const currentTime = getCurrentTime();
  console.log(`${currentTime} ➡️ ${player.name} [${player.id}] has joined. (auth: ${player.auth} | conn: ${player.conn})`);
  if (specialAuths.includes(player.auth) || specialConns.includes(player.conn)) {
    room.setPlayerAdmin(player.id, true);
  }

  extendedP.push([player.id, player.auth, player.conn, false, 0, 0, false]);
  // updateRoleOnPlayerIn();
  // room.sendAnnouncement("👋🏼 ᴡᴇʟᴄᴏᴍᴇ, " + player.name + "!", null, 0x5ee7ff, "bold");
  const text = [
    "╔═══════════════════════════════════════════════════╗",
    "║                                                      𝗥𝗦𝗜.𝗖𝗢𝗠𝗠𝗨𝗡𝗜𝗧𝗬                                                        ║",
    "║                                                 ᴅɪꜱᴄᴏʀᴅ.ɢɢ/ᴘᴍ55ᴛᴠꜱQᴍx                                               ║",
    "╠═══════════════════════════════════════════════════╣",
    "║                                                            !ᴀꜰᴋ   !ʙʙ                                                                ║",
    "╚═══════════════════════════════════════════════════╝"
  ];

  setTimeout(() => {
    text.forEach(line => {
        room.sendAnnouncement(line, player.id, 0x5CF49C, "normal");
    });
  }, 2700); 

  setTimeout(() => {
    room.sendAnnouncement("use ( t ) before text if you want to sent team chat", player.id, 0xedc021, "normal");
    room.sendAnnouncement("use ( a ) before text if you want to sent global chat", player.id, 0xedc021, "normal");
    room.sendAnnouncement("example: t hello / a hello", player.id, 0xedc021, "normal");
    setTimeout(() => {
      room.sendAnnouncement("!setpassword to change room password", player.id, 0x39d100, "normal");
      room.sendAnnouncement("!clearpassword to clear room password", player.id, 0x39d100, "normal");
    }, 4000);
  }, 3200);

  // if (localStorage.getItem(player.auth) != null) {
  //   var playerRole = JSON.parse(localStorage.getItem(player.auth))[Ss.RL];
  //   if (playerRole == "admin" || playerRole == "master") {
  //     room.setPlayerAdmin(player.id, true);
  //     room.sendAnnouncement("「ᴀᴅᴍɪɴ」" + player.name + " ᴄᴀᴍᴇ ɪɴᴛᴏ ᴛʜᴇ ʀᴏᴏᴍ!", null, 0xff7900, "normal");
  //   }
  // }
  if (localStorage.getItem(getAuth(player)) == null) {
    stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", player.name];
    localStorage.setItem(getAuth(player), JSON.stringify(stats));
  }
};


room.onPlayerTeamChange = function (changedPlayer, byPlayer) {

  if (changedPlayer.id == 0) {
    room.setPlayerTeam(0, Team.SPECTATORS);
    return;
  }
  if (getAFK(changedPlayer) && changedPlayer.team != Team.SPECTATORS) {
    room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
    room.sendChat(changedPlayer.name + " is AFK!");
    return;
  }
  updateTeams();
  if (changedPlayer.team == Team.SPECTATORS) {
    setActivity(changedPlayer, 0);
  }

  // if (changedPlayer.team == 0) {
  //   room.sendAnnouncement("🡪 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴍᴏᴠᴇᴅ ᴛᴏ ꜱᴘᴇᴄᴛᴀᴛᴏʀ", changedPlayer.id, 0xffffff, "small", 1);
  // } else if (changedPlayer.team == 1) {
  //   room.sendAnnouncement("🡪 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴍᴏᴠᴇᴅ ᴛᴏ ʀᴇᴅ ᴛᴇᴀᴍ", changedPlayer.id, 0xed6a5a, "small", 1);
  // } else if (changedPlayer.team == 2) {
  //   room.sendAnnouncement("🡪 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴍᴏᴠᴇᴅ ᴛᴏ ʙʟᴜᴇ ᴛᴇᴀᴍ", changedPlayer.id, 0x33dddd, "small", 1);
  // }

  if (changedPlayer.team == 1) {
    room.sendAnnouncement("🡪 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴍᴏᴠᴇᴅ ᴛᴏ ʀᴇᴅ ᴛᴇᴀᴍ", changedPlayer.id, 0xed6a5a, "small", 1);
  } else if (changedPlayer.team == 2) {
    room.sendAnnouncement("🡪 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴍᴏᴠᴇᴅ ᴛᴏ ʙʟᴜᴇ ᴛᴇᴀᴍ", changedPlayer.id, 0x33dddd, "small", 1);
  }

};

room.onPlayerLeave = function (player) {
  const currentTime = getCurrentTime();
  console.log(`${currentTime} ➡️ ${player.name} [${player.id}] has left.`);
};

room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
  ban == true ? banList.push([kickedPlayer.name, kickedPlayer.id]) : null;
};

/* PLAYER ACTIVITY */

room.onPlayerChat = function (player, message) {
  var players = room.getPlayerList();
  let args = message.split(" ");

  if (message.startsWith("t ") || message.startsWith("T ")) {
    teamMsg = message.substring(2).trim();
    var players;
    var teamColor;
    var teamMsgPrefix;
    var showAdmins = false;

    if (player.team == 1) {
        players = room.getPlayerList().filter(p => p.team == 1);
        teamColor = 0xed6a5a;
        teamMsgPrefix = "🔴[TEAM CHAT]";
        showAdmins = false;
    } else if (player.team == 2) {
        players = room.getPlayerList().filter(p => p.team == 2);
        teamColor = 0x5995ed;
        teamMsgPrefix = "🔵[TEAM CHAT]";
        showAdmins = false;
    } else if (player.team == 0) {
        players = room.getPlayerList().filter(p => p.team == 0);
        teamColor = 0xdee7fa;
        teamMsgPrefix = "[SPECTATOR]";
    }

    if (players) {
        players.forEach(function (teamPlayer) {
            room.sendAnnouncement(teamMsgPrefix + " " + player.name + ": " + teamMsg, teamPlayer.id, teamColor, "normal", 1);
        });

        // Send message to all admins if the player is in team 1 or 2
        if (showAdmins) {
            var admins = room.getPlayerList().filter(p => p.admin);
            admins.forEach(function (admin) {
                room.sendAnnouncement(teamMsgPrefix + " " + player.name + ": " + teamMsg, admin.id, teamColor, "normal", 1);
            });
        }
    }
    
    return false;

  } else if (message.startsWith("a ") || message.startsWith("A ")) {
    handleGlobalChat(player, message);
  }

  function handleGlobalChat(player, message) {
    if (globalChatEnabled) {
      var globalMsg = message.substring(2).trim();
      room.sendAnnouncement("[GLOBAL CHAT] " + player.name + ": " + globalMsg, null, 0xffffff);      
    } else {
      room.sendAnnouncement("Global chat disabled.", player.id, 0xffffff);
    }
  }


  /* RSI ANTI SPAM */
  var playerId = player.id;
  var currentTime = Date.now();

  if (lastMessageTime[playerId]) {
    var timeSinceLastMessage = currentTime - lastMessageTime[playerId];
      
        if (lastMessageTime[playerId]) {
        var timeSinceLastMessage = currentTime - lastMessageTime[playerId];

        if (timeSinceLastMessage > cooldownPeriod) {
            messageCounts[playerId] = 0;
        }
        messageCounts[playerId] = (messageCounts[playerId] || 0) + 1;

        if (messageCounts[playerId] > maxMessages) {
          if(player.admin == true){} 
          else {
            room.sendAnnouncement("Spam Alert", playerId, 0x5DDB7E, "normal", 2);
            return false; // Block the message
          }
        }
    } else {r
        messageCounts[playerId] = 1;
    }
  }
  // Update the last message time for the player
  lastMessageTime[playerId] = currentTime;


  if (message.startsWith("@@")) {
    message = message.substr(2).trim();
    if (message.indexOf(" ") !== -1) {
      let args = message.match(/^(\S+)\s(.*)/).slice(1);

      if (args.length > 1) {
        var pmMsg = args[1];
        var players = room.getPlayerList();
        var pmSent = false;
        players.forEach(function (pmPlayer) {
          if (pmPlayer.name === args[0] || pmPlayer.name === args[0].replace(/_/g, " ")) {
            whisper("[PM > " + pmPlayer.name + "] " + player.name + ": " + pmMsg, player.id, 0xff20ff, "normal", 1);
            whisper("[PM] " + player.name + ": " + pmMsg, pmPlayer.id, 0xff20ff, "normal", 1);
            pmSent = true;
          }
        });
        if (pmSent == false) {
          whisper("Cannot find user '" + args[0] + "'", player.id, 0xff20ff, "normal", 1);
        }
        return false;
      }
    }
  }


  if (message.startsWith("!kick #")) {
    if (player.admin) {
      // Extract the player ID from the message, removing the "kick #" prefix
      var playerId = message.substr(6);
  
      // Call the function to kick the player
      var success = kickPlayerById(playerId);
  
      if (!success) {
        room.sendChat("⚠️ Player not found.");
      }
    }
    return false;
  }
  
  // Function to kick a player by ID
  function kickPlayerById(playerId) {
    if (player.admin) {
      var playerToKick = room.getPlayer(playerId);
  
      if (playerToKick !== null) {
        room.kickPlayer(playerToKick.id, "You have been kicked from the room");
        return true; // Player successfully kicked
      } else {
        return false; // Player not found
      }
    } else {
      return false; // Permission denied
    }
  }

  if (message.startsWith("k ") || message.startsWith("K ")) {
    teamKom = message.substring(1).trim();
    if (player.admin) {
      //room.sendAnnouncement("👀 [Komentator]: " + teamKom + "", null, 0x99ffff, "normal", 1);
      room.sendAnnouncement("👀 [Komentator]: " + teamKom + "", null, 0xffffe0, "normal", 1);
      return false;
    } else {
      whisper("⚠️ You don't have permission", player.id);
    }
    return false;
  }

  if (message.startsWith("Y ") || message.startsWith("y ")) {
    var remainingMessage = message.substring(2).trim();
    if (player.admin) {
        var parts = remainingMessage.split(" ");
        var targetPlayerName = parts[0];
        var reason = parts.slice(1).join(" ");
        room.sendAnnouncement(`[BOOKINGS] 🟨 Player: ${targetPlayerName} got yellow card for Reason: ${reason}`, null, 0xffffe0, "normal", 1);
    } else {
        room.sendChat("⚠️ You don't have permission", player.id);
    }
    return false; // Prevent the message from being displayed in chat
  }

  if (message.startsWith("R ") || message.startsWith("r ")) {
    var remainingMessage = message.substring(2).trim();
    if (player.admin) {
        var parts = remainingMessage.split(" ");
        var targetPlayerName = parts[0];
        var reason = parts.slice(1).join(" ");
        room.sendAnnouncement(`[BOOKINGS] 🟥 Player: ${targetPlayerName} got red card for Reason: ${reason}`, null, 0xffffe0, "normal", 1);
    } else {
        room.sendChat("⚠️ You don't have permission", player.id);
    }
    return false; // Prevent the message from being displayed in chat
  }

  // if (message.startsWith("!reqsub ") || message.startsWith("!reqsub ")) {
  //   var remainingMessage = message.substring(6).trim();
  //   var parts = remainingMessage.split(" ");
  //   var playerout = parts[0];
  //   var playerin = parts.slice(1).join(" ");
    
  //   var playerTeam = (player.team === 1) ? "Red team" : "Blue team";
  //   var playerName = player.name;
  //   var teamEmoji = (player.team === 1) ? "🟥" : "🟦";
    
  //   room.sendAnnouncement(`[SUBS REQUEST ${teamEmoji}] Captain ${playerName} request (Player out: ${playerout})  (Player in: ${playerin})`, null, 0xffffe0, "normal", 1);
  
  //   return false; // Prevent the message from being displayed in chat
  // }

  if (message.startsWith("m ") || message.startsWith("M ")) {
    if (player.admin) {
      teamTalk = message.substring(1).trim();
      announce("" + teamTalk + "");
      return false;
    } else {
      whisper("⚠️ You don't have permission", player.id);
    }
    return false;
  }

  function findPlayerById(id) {
    var players = room.getPlayerList();
    return players.find(player => player.id === id);
  }

  messageHistory.push(player.id);
  messageCounter++;
  if (messageCounter === 1545) {
    if (
      messageHistory[messageHistory.length - 1] === player.id &&
      messageHistory[messageHistory.length - 2] === player.id &&
      messageHistory[messageHistory.length - 3] === player.id &&
      messageHistory[messageHistory.length - 4] === player.id
    ) {
      room.sendChat(":)", player.id);
    }
  }
  // ban player if 6 messages are typed in a row (disabled)
  msg = message;
  message = message;
  originalMessage = message;
  message = message.split(/ +/);
  player.team != Team.SPECTATORS ? setActivity(player, 0) : null;
  if (["!help", "!command"].includes(message[0].toLowerCase())) {
    room.sendAnnouncement("[📄]ᴄᴏᴍᴍᴀɴᴅꜱ : !ᴅᴄ, !ᴀꜰᴋ, !fixstart, !start, ᴛ [ᴄʜᴀᴛ ᴛɪᴍ] !ɢᴀᴍᴇꜱ, !ᴀꜱꜱɪꜱᴛꜱ", player.id, 0x309d2b, "bold");
    player.admin ? room.sendAnnouncement("[📄] ᴀᴅᴍɪɴ : !ᴍᴜᴛᴇ <ᴅᴜʀᴀᴛɪᴏɴ = 3> #<ɪᴅ>, !ᴜɴᴍᴜᴛᴇ ᴀʟʟ/#<ɪᴅ>, !ᴄʟᴇᴀʀʙᴀɴꜱ <ɴᴜᴍʙᴇʀ = ᴀʟʟ>, !ꜱʟᴏᴡ <ᴅᴜʀᴀᴛɪᴏɴ>, !ᴇɴᴅꜱʟᴏᴡ", player.id, 0x309d2b, "bold") : null;
  }

else if (["!afk"].includes(message[0].toLowerCase())) {
    if (players.length != 1 && player.team != Team.SPECTATORS) {
      if (player.team == Team.RED && streak > 0 && room.getScores() == null) {
        room.setPlayerTeam(player.id, Team.SPECTATORS);
      } else {
        room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴ'ᴛ ɢᴏ ᴀꜰᴋ ᴡʜɪʟᴇ ᴘʟᴀʏɪɴɢ!", player.id, 0xff7b08);
        return false;
      }
    } else if (players.length == 1 && !getAFK(player)) {
      room.setPlayerTeam(player.id, Team.SPECTATORS);
    }
    setAFK(player, !getAFK(player));
    room.sendAnnouncement(player.name + (getAFK(player) ? " ɪꜱ ᴀꜰᴋ!" : " ɪꜱ ɴᴏᴡ ᴏɴʟɪɴᴇ!"), null, getAFK(player) ? 0xff7b08 : 0x8fff8f);
    room.sendAnnouncement((getAFK(player) ? "ᴛʏᴘᴇ !ᴀꜰᴋ ᴛᴏ ʀᴇᴛᴜʀɴ" : ""), player.id, getAFK(player) ? 0xff7b08 : 0x8fff8f);
    getAFK(player) ? updateRoleOnPlayerOut() : updateRoleOnPlayerIn();
    localStorage.getItem(getAuth(player)) ? (stats = JSON.parse(localStorage.getItem(getAuth(player)))) : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player"]);
    setTimeout(() => {
      if (getAFK(player) && stats[Ss.RL] != "vip") {
        room.kickPlayer(player.id, "𝗔𝗙𝗞 𝘁𝗶𝗺𝗲𝗼𝘂𝘁", false);
      }
    }, 30 * 60 * 1000);
    return false;
  }else if (["!adm"].includes(message[0].toLowerCase())) {
    if (message[1] == adminPassword) {
      room.setPlayerAdmin(player.id, true);
      var stats;
      localStorage.getItem(getAuth(player)) ? (stats = JSON.parse(localStorage.getItem(getAuth(player)))) : (stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", player.name]);
      if (stats[Ss.RL] != "master") {
        stats[Ss.RL] = "master";
        //room.sendAnnouncement(player.name + " ʟᴏɢɢᴇᴅ ɪɴ ᴀꜱ ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴏʀ!", null, 0xff7900, 2);
        localStorage.setItem(getAuth(player), JSON.stringify(stats));
      }
    }
  } else if (["!mutes", "!mutelist"].includes(message[0].toLowerCase())) {
    var cstm = "[RSI] List of muteds: ";
    for (var i = 0; i < extendedP.length; i++) {
      if (room.getPlayer(extendedP[i][eP.ID]) != null && getMute(room.getPlayer(extendedP[i][eP.ID]))) {
        if (140 - cstm.length < (room.getPlayer(extendedP[i][eP.ID]).name + "[" + extendedP[i][eP.ID] + "], ").length) {
          room.sendChat(cstm, player.id);
          cstm = "... ";
        }
        cstm += room.getPlayer(extendedP[i][eP.ID]).name + "[" + extendedP[i][eP.ID] + "], ";
      }
    }
    if (cstm == "[RSI] List of muteds: ") {
      room.sendChat("[RSI] There is no one on the mutated list!", player.id);
      return false;
    }
    cstm = cstm.substring(0, cstm.length - 2);
    cstm += ".";
    room.sendChat(cstm, player.id);
  } else if (["!mute"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      updateTeams();
      var timeOut;
      if (!Number.isNaN(Number.parseInt(message[1])) && message.length > 1) {
        if (Number.parseInt(message[1]) > 0) {
          timeOut = Number.parseInt(message[1]) * 60 * 1000;
        } else {
          timeOut = 3 * 60 * 1000;
        }
        if (message[2].length > 1 && message[2][0] == "#") {
          message[2] = message[2].substring(1, message[2].length);
          if (!Number.isNaN(Number.parseInt(message[2])) && room.getPlayer(Number.parseInt(message[2])) != null) {
            if (room.getPlayer(Number.parseInt(message[2])).admin || getMute(room.getPlayer(Number.parseInt(message[2])))) {
              return false;
            }
            setTimeout(
              function (player) {
                setMute(player, false);
              },
              timeOut,
              room.getPlayer(Number.parseInt(message[2]))
            );
            setMute(room.getPlayer(Number.parseInt(message[2])), true);
            room.sendChat(room.getPlayer(Number.parseInt(message[2])).name + " was muted for " + timeOut / 60000 + " minutes!");
          }
        }
      } else if (Number.isNaN(Number.parseInt(message[1]))) {
        if (message[1].length > 1 && message[1][0] == "#") {
          message[1] = message[1].substring(1, message[1].length);
          if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null) {
            if (room.getPlayer(Number.parseInt(message[1])).admin || getMute(room.getPlayer(Number.parseInt(message[1])))) {
              return false;
            }
            setTimeout(
              function (player) {
                setMute(player, false);
              },
              3 * 60 * 1000,
              room.getPlayer(Number.parseInt(message[1]))
            );
            setMute(room.getPlayer(Number.parseInt(message[1])), true);
            room.sendChat(room.getPlayer(Number.parseInt(message[1])).name + " was muted for 3 minutes!");
          }
        }
      }
    }
  } else if (["!unmute"].includes(message[0].toLowerCase())) {
    if (player.admin && message.length >= 2) {
      if (message[1] == "all") {
        extendedP.forEach((ePlayer) => {
          ePlayer[eP.MUTE] = false;
        });
        room.sendChat("All were demutated");
      } else if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null && getMute(room.getPlayer(Number.parseInt(message[1])))) {
        setMute(room.getPlayer(Number.parseInt(message[1])), false);
        room.sendChat(room.getPlayer(Number.parseInt(message[1])).name + " has been unmuted!");
      } else if (Number.isNaN(Number.parseInt(message[1]))) {
        if (message[1].length > 1 && message[1][0] == "#") {
          message[1] = message[1].substring(1, message[1].length);
          if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null && getMute(room.getPlayer(Number.parseInt(message[1])))) {
            setMute(room.getPlayer(Number.parseInt(message[1])), false);
            room.sendChat(room.getPlayer(Number.parseInt(message[1])).name + " has been unmuted!");
          }
        }
      }
    }
  } else if (["!mutenon"].includes(message[0].toLowerCase())) {
    updateTeams();
    var timeOut;
    if (!Number.isNaN(Number.parseInt(message[1])) && message.length > 1) {
      if (Number.parseInt(message[1]) > 0) {
        timeOut = Number.parseInt(message[1]) * 60 * 1000;
      } else {
        timeOut = 3 * 60 * 1000;
      }
      if (message[2].length > 1 && message[2][0] == "#") {
        message[2] = message[2].substring(1, message[2].length);
        if (!Number.isNaN(Number.parseInt(message[2])) && room.getPlayer(Number.parseInt(message[2])) != null) {
          if (room.getPlayer(Number.parseInt(message[2])).admin || getMute(room.getPlayer(Number.parseInt(message[2])))) {
            return false;
          }
          setTimeout(
            function (player) {
              setMute(player, false);
            },
            timeOut,
            room.getPlayer(Number.parseInt(message[2]))
          );
          setMute(room.getPlayer(Number.parseInt(message[2])), true);
          room.sendChat(room.getPlayer(Number.parseInt(message[2])).name + " was muted for " + timeOut / 60000 + " minutes!");
        }
      }
    } else if (Number.isNaN(Number.parseInt(message[1]))) {
      if (message[1].length > 1 && message[1][0] == "#") {
        message[1] = message[1].substring(1, message[1].length);
        if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null) {
          if (room.getPlayer(Number.parseInt(message[1])).admin || getMute(room.getPlayer(Number.parseInt(message[1])))) {
            return false;
          }
          setTimeout(
            function (player) {
              setMute(player, false);
            },
            3 * 60 * 1000,
            room.getPlayer(Number.parseInt(message[1]))
          );
          setMute(room.getPlayer(Number.parseInt(message[1])), true);
          room.sendChat(room.getPlayer(Number.parseInt(message[1])).name + " was muted for 3 minutes!");
        }
      }
    }
} else if (["!unmutenon"].includes(message[0].toLowerCase())) {
    if (message[1] == "all") {
      extendedP.forEach((ePlayer) => {
        ePlayer[eP.MUTE] = false;
      });
      room.sendChat("All were demutated");
    } else if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null && getMute(room.getPlayer(Number.parseInt(message[1])))) {
      setMute(room.getPlayer(Number.parseInt(message[1])), false);
      room.sendChat(room.getPlayer(Number.parseInt(message[1])).name + " has been unmuted!");
    } else if (Number.isNaN(Number.parseInt(message[1]))) {
      if (message[1].length > 1 && message[1][0] == "#") {
        message[1] = message[1].substring(1, message[1].length);
        if (!Number.isNaN(Number.parseInt(message[1])) && room.getPlayer(Number.parseInt(message[1])) != null && getMute(room.getPlayer(Number.parseInt(message[1])))) {
          setMute(room.getPlayer(Number.parseInt(message[1])), false);
          room.sendChat(room.getPlayer(Number.parseInt(message[1])).name + " has been unmuted!");
        }
      }
    }
    if (banList.length == 0) {
      room.sendChat("[RSI] There is no one on the banned list!", player.id);
      return false;
    }
    var cstm = "[RSI] Banned list: ";
    for (var i = 0; i < banList.length; i++) {
      if (140 - cstm.length < (banList[i][0] + "[" + banList[i][1] + "], ").length) {
        room.sendChat(cstm, player.id);
        cstm = "... ";
      }
      cstm += banList[i][0] + "[" + banList[i][1] + "], ";
    }
    cstm = cstm.substring(0, cstm.length - 2);
    cstm += ".";
    room.sendChat(cstm, player.id);
  } else if (["!clearbans"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      if (message.length == 1) {
        room.clearBans();
        room.sendChat("All Bans removed!");
        banList = [];
      }
      if (message.length == 2) {
        if (!Number.isNaN(Number.parseInt(message[1]))) {
          if (Number.parseInt(message[1]) > 0) {
            ID = Number.parseInt(message[1]);
            room.clearBan(ID);
            if (banList.length != banList.filter((array) => array[1] != ID)) {
              room.sendChat(banList.filter((array) => array[1] == ID)[0][0] + " has been banned from the host!");
            }
            setTimeout(() => {
              banList = banList.filter((array) => array[1] != ID);
            }, 20);
          }
        }
      }
    }
  } else if (["!bb", "!bye", "!gn"].includes(message[0].toLowerCase())) {
    room.kickPlayer(player.id, "👋 (leave) Until later!", false);
  } else if (["!pause", "!p"].includes(message[0].toLowerCase())) {
    if (isPaused) {
      room.sendAnnouncement("Game already paused", player.id, 0xffffe0, "normal", 1);
      return false;
    }

    var team = player.team;
    var teamName = team === 1 ? "🟥 Red" : team === 2 ? "🟦 Blue" : "Spectator";

    if (team === 1 && redPauseCount >= maxPauses) {
        room.sendAnnouncement("🟥 Red team has no more pause chances", player.id, 0xffffe0, "normal", 1);
        return false;
    } else if (team === 2 && bluePauseCount >= maxPauses) {
        room.sendAnnouncement("🟦 Blue team has no more pause chances", player.id, 0xffffe0, "normal", 1);
        return false;
    }

    room.pauseGame(true);
    isPaused = true;
    if (team === 1) redPauseCount++;
    if (team === 2) bluePauseCount++;

    room.sendAnnouncement(`${teamName} team captain ${player.name} paused the game for 20 sec`, null, 0xffffe0, "normal", 1);
    pauseTimer = setTimeout(function() {
        room.pauseGame(false);
        isPaused = false;
        room.sendAnnouncement("Game un-paused", null, 0xffffe0, "normal", 1);
    }, 20000);
  } else if (["!setpassword"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        room.setPassword(args[1]);
        roomPassword = args[1];
        announce("Password room diubah oleh: " + player.name);
      } else {
        whisper("Only Super Admins can change password", player.id);
      }
  } else if (["!clearpassword"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      room.setPassword(null);
      roomPassword = null;
      announce("Password dibersihkan oleh " + player.name);
    } else {
      whisper("Only Super Admins can clear password", player.id);
    }
  } else if (["!swap"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      if (args.length == 1) {
        var players = room.getPlayerList().filter((player) => player.id != 0);
        if (players.length == 0) return false;
        players.forEach(function (player) {
          if (player.team == 1) {
            room.setPlayerTeam(player.id, 2);
          }
          if (player.team == 2) {
            room.setPlayerTeam(player.id, 1);
          }
        });
        announce("🔄 Tim Berhasil Ditukar");
      }
    } else {
      whisper("Only Super Admins can clear password", player.id);
    }
  } else if (["!start", "!fixstart"].includes(message[0].toLowerCase())) {
    if (room.getScores() == null) {
      room.startGame();
    } else {
      whisper("Cannot start while game in progress", player.id);
    }
  } else if (["!map"].includes(message[0].toLowerCase())) {
    room.sendAnnouncement("List Map RSI : Real Soccer [!rsmap], Training [!premap / !training], Penalty [!penmap]", player.id, 0xffffff, "normal");
  } else if (["!rsmap"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        penKick = false;
        console.log(`penKick = false`);
        stopGameIfRunning();
        loadMap(practiceMap, scoreLimitPractice, gameTime);
        resetRealSoccerState();
      } 
  } else if (["!premap", "!training", "!trainmap"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        penKick = false;
        console.log(`penKick = false`);
        stopGameIfRunning();
        loadMap(practiceMap, scoreLimitPractice, 0);
        resetRealSoccerState();
      } 
  } else if (["!penmap"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        penKick = true;
        console.log(`penKick = true`);
        stopGameIfRunning();
        loadMap(penMap, scoreLimitPractice, 0);
        resetRealSoccerState();
      } else {
        if (room.getScores() == null) {
          loadMap(penMap, scoreLimitPractice, 0);
          resetRealSoccerState();
          penKick = true;
          console.log(`penKick = true`);
        } else {
          whisper("ᴄᴀɴɴᴏᴛ ᴄʜᴀɴɢᴇ ᴍᴀᴘ ᴡʜɪʟᴇ ɢᴀᴍᴇ ɪɴ ᴘʀᴏɢʀᴇꜱꜱ", player.id);
        }
      }
  } else if (["!disableglobal"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      globalChatEnabled = false;
      room.sendAnnouncement("Global chat disabled", null, 0xdee7fa);
    } 
  } else if (["!enableglobal"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      globalChatEnabled = true;
      room.sendAnnouncement("Global chat enabled", null, 0xdee7fa);
    } 
  }

  if (link.includes(message[0])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (link.includes(message[1])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (link.includes(message[2])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (link.includes(message[3])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (link.includes(message[4])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (link.includes(message[5])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (link.includes(message[6])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (link.includes(message[7])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, 0xff9966, "italic", 2);
    return false;
  }

  if (message[0][0] == "!") {
    // the command used in the chat does not appear
    return false;
  }

  if (getMute(player)) {
    room.sendChat("You are muted", player.id);
    return false;
  }
  if (slowMode > 0) {
    if (!player.admin) {
      if (!SMSet.has(player.id)) {
        SMSet.add(player.id);
        setTimeout(
          (number) => {
            SMSet.delete(number);
          },
          slowMode * 1000,
          player.id
        );
      } else {
        return false;
      }
    }
  }
  if (localStorage.getItem(getAuth(player))) {
    stats = JSON.parse(localStorage.getItem(getAuth(player)));
    var announcement = "";
    var chatColor = "";

    announcement += player.admin ? "[🌐Admin] " : "[💠Player] ";
    chatColor = player.admin ? 0x99ffff : 0xEDEDED;

    announcement += player.name + ": " + originalMessage;
    room.sendAnnouncement(announcement, null, chatColor);
    return false;
  } else {
    room.sendAnnouncement(`❌ ${player.name}: ${originalMessage}`, null, 0xabaea7);
    return false;
  }
};

room.onPlayerActivity = function (player) {
  setActivity(player, 0);
};

room.onPlayerBallKick = function (player) {
  recordBallTouch(player);

  if (game.rsReady == true) {
    var players = room.getPlayerList().filter((player) => player.team != 0);
    players.forEach(function (player) {
      if (room.getPlayerDiscProperties(player.id).invMass.toFixed(1) != 0.3) {
        room.setPlayerDiscProperties(player.id, { invMass: 0.3 });
      }
    });
  }

  if (game.rsActive == false && game.rsReady == true && (game.rsCorner == true || game.rsGoalKick == true)) {
    // make game active on kick from CK/GK
    game.boosterState = true;

    game.rsActive = true;
    game.rsReady = false;
    room.setDiscProperties(1, { x: 2000, y: 2000 });
    room.setDiscProperties(2, { x: 2000, y: 2000 });
    room.setDiscProperties(0, { color: "0xffffff" });
    game.rsTimer = 1000000;
    game.warningCount++;

    // set gravity for real soccer corners/goalkicks
    if (game.rsCorner == true) {
      room.setDiscProperties(0, { xgravity: (room.getPlayerDiscProperties(player.id).xspeed / 16) * -1, ygravity: (room.getPlayerDiscProperties(player.id).yspeed / 16) * -1 });  //default 16
    }
    if (game.rsGoalKick == true) {
      room.setDiscProperties(0, { xgravity: 0, ygravity: (room.getPlayerDiscProperties(player.id).yspeed / 20) * -1 });  //default 20
    }

    game.rsCorner = false;
    game.rsGoalKick = false;
    game.outStatus = "";
  }

  if (game.rsActive == false && (game.outStatus == "redThrow" || game.outStatus == "blueThrow")) {
    game.outStatus = "";
    game.rsActive = true;
    game.rsReady = false;
    room.setDiscProperties(0, { color: "0xffffff" });
    game.rsTimer = 1000000;
    game.warningCount++;
  }
};

/* GAME MANAGEMENT */

room.onGameStart = function (byPlayer) {
  isTurneyStarted = true;
  console.log(`isTurneyStarted = true`);
  game = new Game(Date.now(), room.getScores(), []);
  countAFK = true;
  activePlay = false;
  goldenGoal = false;
  endGameVariable = false;
  lastPlayersTouched = [null, null];
  lastBallPositionForTouch = null;
  Rposs = 0;
  Bposs = 0;
  GKList = [];
  allReds = [];
  allBlues = [];
  globalChatEnabled = false;
  //whisper("Global chat disabled", null);

  room.sendAnnouncement(centerText("🥅 KICK OFF 🥅"), null, 0xffffff, "bold");
  room.sendAnnouncement(centerText("Game Duration: " + gameTime + " minutes / Half"), null, 0x2ef55d, "bold");
  // room.sendAnnouncement(centerText("RSI League S4"), null, 0x5ee7ff);
};

room.onGameStop = function (byPlayer) {
  isTurneyStarted = false;
  console.log(`isTurneyStarted = false`);
  announcement30sSent = false; 
  announcement20sSent = false; 
  announcement10sSent = false;
  redPauseCount = 0;
  bluePauseCount = 0;
  globalChatEnabled = true;
  //whisper("Global chat enabled", null);
};

room.onGameUnpause = function (byPlayer) {
};

// Function to get a new random choice that is not the same as the previous one
room.onTeamGoal = function (team) {
  // updateScores(team); //update scores halftime + fulltime
  let goalTime = secondsToMinutes(Math.floor(room.getScores().time));
  game.rsActive = false;
  
  // Reset throw-in related variables immediately
  game.outStatus = "";
  game.rsActive = true;
  game.rsReady = false;
  game.rsTimer = 0;
  
  teamgoaler = team;
  let assistencia = "";
  let goleador = "";
  let goalMaker = lastPlayersTouched[0].id;
  activePlay = false;
  countAFK = false;
  const scores = room.getScores();
  game.scores = scores;

  if (lastPlayersTouched[0] != null && lastPlayersTouched[0].team == team) {
    if (lastPlayersTouched[1] != null && lastPlayersTouched[1].team == team) {
      const text = [
        "──────────────────────────────────────────────────────",
        `${goalTime} | ⚽ ɢᴏᴀʟ sᴄᴏʀᴇᴅ ʙʏ ${lastPlayersTouched[0].name} | ᴀssɪsᴛ ʙʏ - ${lastPlayersTouched[1].name} | 🟥 ${scores.red} - ${scores.blue} 🟦`,
        "──────────────────────────────────────────────────────"
      ];
      text.forEach(line => {
        room.sendAnnouncement(line, null, 0x11DEB3, "small");
      });
    } else {
      const text = [
        "──────────────────────────────────────────────────────",
        `${goalTime} | ⚽ ɢᴏᴀʟ sᴄᴏʀᴇᴅ ʙʏ ${lastPlayersTouched[0].name} | 🟥 ${scores.red} - ${scores.blue} 🟦`,
        "──────────────────────────────────────────────────────"
      ];
      text.forEach(line => {
        room.sendAnnouncement(line, null, 0x11DEB3, "small");
      });
    }

    if (lastPlayersTouched[1] != null && lastPlayersTouched[1].team == team) {
      let goalAssist = lastPlayersTouched[1].id;
      assistencia = lastPlayersTouched[1];
    }
  } else {
    const text = [
      "──────────────────────────────────────────────────────",
      `${goalTime} | ☠️ ᴏᴡɴ ɢᴏᴀʟ sᴄᴏʀᴇᴅ ʙʏ ${lastPlayersTouched[0].name} | 🟥 ${scores.red} - ${scores.blue} 🟦`,
      "──────────────────────────────────────────────────────"
    ];
    text.forEach(line => {
      room.sendAnnouncement(line, null, 0xFB6B6B, "small");
    });
    game.goals.push(new Goal(scores.time, team, null, null));
  }

  // Set a 2-second delay before resetting the ball position to center
  setTimeout(() => {
    room.setDiscProperties(0, {
      x: 0,
      y: 0,
      xspeed: 0,
      yspeed: 0,
      xgravity: 0,
      ygravity: 0,
      color: "0xffffff"
    });
  }, 2000);

  if (scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || (scores.blue == scores.scoreLimit && scores.blue > 0) || goldenGoal == true)) {
    endGame(team);
    goldenGoal = false;
    setTimeout(() => {
      room.stopGame();
    }, 1000);
  }
};

room.onPositionsReset = function () {
  countAFK = true;
  lastPlayersTouched = [null, null];
  if (game.lastPlayAnnounced == true) {
    room.stopGame(true);
    game.lastPlayAnnounced = false;
    announce("⚽ FULL TIME ⚽");
  }
};

/* SEVERAL */

room.onRoomLink = function (url) {};

room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
  if (getMute(changedPlayer) && changedPlayer.admin) {
    room.sendChat(changedPlayer.name + " was unmuted.");
    setMute(changedPlayer, false);
  }
  // if (byPlayer.id != 0 && localStorage.getItem(getAuth(byPlayer)) && JSON.parse(localStorage.getItem(getAuth(byPlayer)))[Ss.RL] == "admin") {
  //   room.sendChat("ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ ᴛᴏ ᴀᴘᴘᴏɪɴᴛ ᴀ ᴘʟᴀʏᴇʀ ᴀꜱ ᴀɴ ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴏʀ!", byPlayer.id);
  //   room.setPlayerAdmin(changedPlayer.id, false);
  // }
};

room.onStadiumChange = function (newStadiumName, byPlayer) {
  if (restoringStadium || byPlayer == null) {
    return;
  }

  restoringStadium = true;
  const scores = room.getScores();

  if (scores != null) {
    room.stopGame();
  }

  loadMap(practiceMap, scoreLimitPractice, timeLimitPractice);
  resetRealSoccerState();
  penKick = false;
  restoringStadium = false;
  room.sendAnnouncement("Manual stadium changes are disabled for Real Soccer. Map restored.", byPlayer.id, 0xff9966, "bold", 2);
};

room.onGameTick = function () {
  if (game == null || room.getScores() == null || !hasRequiredRealSoccerDiscs()) {
    return;
  }

  updateGameStatus();
  if (!penKick) {
    handleBallTouch();
    realSoccerRef();
  }
  // if (!isTurneyStarted) {
  //   checkTime();
  // }

  getLastTouchOfTheBall();
  getStats();
  handleInactivity();
  if (isTurneyStarted) {
    const gameTimeRemaining = game.time;
    if (gameTimeRemaining === 7 * 60) {
      pauseAndResumeGame();
    }
    if (gameTimeRemaining === 7 * 60 - 10 && countdownTimeouts.length === 0) {
      countdownToHalfTime();
    }
  }
  if (!isFirstHalf) {
    const gameTimeRemaining = game.time;
    if (gameTimeRemaining === 7 * 60) {
      stopFullTime();
    }
  }
  if (!isFirstHalf) {
    var time = room.getScores().time;
    
    if (time >= 6 * 60 + 30 && !announcement30sSent) {
        announce(`Full Time in 30 seconds ⏳`);
        announcement30sSent = true;
    } else if (time >= 6 * 60 + 40 && !announcement20sSent) {
        announce(`Full Time in 20 seconds ⏳`);
        announcement20sSent = true;
    } else if (time >= 6 * 60 + 50 && !announcement10sSent) {
        announce(`Full Time in 10 seconds ⏳`);
        announcement10sSent = true;
    }
  }
};

function stopFullTime() {
  const scores = room.getScores();
  game.scores = scores;
  Rposs = Rposs / (Rposs + Bposs);
  Bposs = 1 - Rposs;

  room.stopGame(true);

  // Display full-time announcement
  room.sendAnnouncement(centerText("🏆 FULL TIME 🏆"), null, 0xffffff, "bold");
  room.sendAnnouncement(centerText(" " + scores.red + " - " + scores.blue), null, 0xffffff, "normal");
  room.sendAnnouncement(centerText((Rposs * 100).toPrecision(3).toString() + "% | Ball possession | " + (Bposs * 100).toPrecision(3).toString() + "% "), null, 0xffffff, "normal");
  isFirstHalf = true;
  console.log(`isFirstHalf = true`);
}

function pauseAndResumeGame() {
  const scores = room.getScores();
  game.scores = scores;
  Rposs = Rposs / (Rposs + Bposs);
  Bposs = 1 - Rposs;
  room.stopGame(true);

  setTimeout(() => {
  room.sendAnnouncement(centerText("🏆 HALF TIME (1 MIN) 🏆"), null, 0xffffff, "bold");
  room.sendAnnouncement(centerText(" " + scores.red + " - " + scores.blue), null, 0xffffff, "normal");
  room.sendAnnouncement(centerText((Rposs * 100).toPrecision(3).toString() + "% | Ball Possession | " + (Bposs * 100).toPrecision(3).toString() + "% "), null, 0xffffff, "normal");
  }, 700);

  setTimeout(() => {
    swapTeamsAndAnnounce();
  }, 1800);
  
  isTurneyStarted = false;
  console.log(`isTurneyStarted = false`);

  setTimeout(() => {
    let timeLeft = 10; // Time left before resuming in seconds
    let timerId = setInterval(() => {
      if (timeLeft > 0) {
        announce(`Kick-off in ${timeLeft} seconds ⏳`);
        timeLeft--;
      } else {
        clearInterval(timerId);
        room.startGame();
        announce("⚽ KICK OFF - SECOND HALF ⚽");
        setTimeout(() => {
          isTurneyStarted = false;
          console.log(`isTurneyStarted = false`);
          isFirstHalf = false;
          console.log(`isFirstHalf = false`);
        }, 8000);
      }
    }, 1000); // Repeat every second
  }, 50 * 1000); // 50 * 1000 seconds after initial pause 
}

function countdownToHalfTime() {
  let timeLeft = 10; // Countdown time in seconds

  for (let i = 0; i <= timeLeft; i++) {
    countdownTimeouts.push(setTimeout(() => {
      if (i < timeLeft) {
        announce(`Half Time in ${timeLeft - i} seconds ⏳`);
      } else {
        // Clear all timeouts to reset the state
        countdownTimeouts.forEach(timeout => clearTimeout(timeout));
        countdownTimeouts = [];
      }
    }, i * 1000)); // Announce every second
  }
}

function swapTeamsAndAnnounce() {
  var players = room.getPlayerList().filter((player) => player.id != 0);
  if (players.length == 0) return false;
  
  players.forEach(function (player) {
    if (player.team == 1) {
      room.setPlayerTeam(player.id, 2);
    } else if (player.team == 2) {
      room.setPlayerTeam(player.id, 1);
    }
  });
  
  announce("🔄 Teams Swapped");
}

function realSoccerRef() {
  blockThrowIn();
  blockGoalKick();
  removeBlock();
  // if (game.time == gameTime * 60 && game.extraTimeAnnounced == false) {
  //    extraTime();
  //    game.extraTimeAnnounced = true;
  // }

  // if (game.time == game.extraTimeEnd && game.lastPlayAnnounced == false) {
  //   announce("Peluang Terakhir", null, null, null, 1);
  //   game.lastPlayAnnounced = true;
  // }

  if (game.rsCorner == true || game.rsGoalKick == true) {
    //add extra time
    game.extraTimeCount++;
  }

  if (game.rsTimer < 99999 && game.paused == false && game.rsActive == false && game.rsReady == true) {
    game.rsTimer++;
  }

  if (game.rsSwingTimer < 150 && game.rsCorner == false && game.rsGoalKick == false) {
    game.rsSwingTimer++;
    if (game.rsSwingTimer > 5) {
      room.setDiscProperties(0, { xgravity: room.getDiscProperties(0).xgravity * 0.97, ygravity: room.getDiscProperties(0).ygravity * 0.97 });
    }
    if (game.rsSwingTimer == 150) {
      room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
    }
  }

  if (game.boosterState == true) {
    game.boosterCount++;
  }

  if (game.boosterCount > 30) {
    game.boosterState = false;
    game.boosterCount = 0;
    room.setDiscProperties(0, { cMask: 63 });
  }

  if (room.getBallPosition().x == 0 && room.getBallPosition().y == 0) {
    game.rsActive = true;
    game.outStatus = "";
  }

  if (game.rsActive == false && game.rsReady == true) {
    //expire barrier time
    if (game.outStatus == "redThrow") {
      if (game.rsTimer == throwTimeOut - 120) {
        // warning indicator
        ballWarning("0xff3f34", ++game.warningCount);
      }
      if (game.rsTimer == throwTimeOut && game.bringThrowBack == false) {
        // switch to blue throw
        game.outStatus = "blueThrow";
        game.rsTimer = 0;
        room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        sleep(100).then(() => {
          room.setDiscProperties(0, { color: "0x0fbcf9", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY });
        });
      }
    } else if (game.outStatus == "blueThrow") {
      if (game.rsTimer == throwTimeOut - 120) {
        // warning indicator
        ballWarning("0x0fbcf9", ++game.warningCount);
      }
      if (game.rsTimer == throwTimeOut && game.bringThrowBack == false) {
        // switch to red throw
        game.outStatus = "redThrow";
        game.rsTimer = 0;
        room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        sleep(100).then(() => {
          room.setDiscProperties(0, { color: "0xff3f34", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY });
        });
      }
    } else if (game.outStatus == "blueGK" || game.outStatus == "redGK") {
      if (game.rsTimer == gkTimeOut - 120) {
        // warning indicator
        if (game.outStatus == "blueGK") {
          ballWarning("0x0fbcf9", ++game.warningCount);
        }
        if (game.outStatus == "redGK") {
          ballWarning("0xff3f34", ++game.warningCount);
        }
      }
      if (game.rsTimer == gkTimeOut) {
        game.outStatus = "";
        room.setDiscProperties(0, { color: "0xffffff" });
        game.rsTimer = 1000000;
      }
    } else if (game.outStatus == "blueCK" || game.outStatus == "redCK") {
      if (game.rsTimer == ckTimeOut - 120) {
        if (game.outStatus == "blueCK") {
          ballWarning("0x0fbcf9", ++game.warningCount);
        }
        if (game.outStatus == "redCK") {
          ballWarning("0xff3f34", ++game.warningCount);
        }
      }
      if (game.rsTimer == ckTimeOut) {
        game.outStatus = "";
        room.setDiscProperties(1, { x: 0, y: 2000, radius: 0 });
        room.setDiscProperties(2, { x: 0, y: 2000, radius: 0 });
        room.setDiscProperties(0, { color: "0xffffff" });
        game.rsTimer = 1000000;
      }
    }
  }

  if (game.rsActive == true) {
    if (room.getBallPosition().y > 611.45 || room.getBallPosition().y < -611.45) {
      game.rsActive = false;
      if (game.lastPlayAnnounced == true) {
        room.stopGame(true);
        game.lastPlayAnnounced = false;
        announce("⚽ FULL TIME ⚽");
        announce("⚽ FULL TIME ⚽");
        room.setTimeLimit(gameTime);
        // whisper("ʀᴇᴘʟᴀʏ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ꜱᴇɴᴛ ᴛᴏ ᴅɪꜱᴄᴏʀᴅ!", null);
      }

      room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });

      game.ballOutPositionX = Math.round(room.getBallPosition().x * 10) / 10;
      if (room.getBallPosition().y > 611.45) {
        game.ballOutPositionY = 400485;
        game.throwInPosY = 610;
      }
      if (room.getBallPosition().y < -611.45) {
        game.ballOutPositionY = -400485;
        game.throwInPosY = -610;
      }
      if (room.getBallPosition().x > 1130) {
        game.ballOutPositionX = 1130;
      }
      if (room.getBallPosition().x < -1130) {
        game.ballOutPositionX = -1130;
      }

      const throwLastTouchTeam = lastPlayersTouched[0] != null ? lastPlayersTouched[0].team : game.rsTouchTeam;

      if (throwLastTouchTeam == 1) {
        room.setDiscProperties(3, { x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
        sleep(30).then(() => {
          game.outStatus = "blueThrow";
          game.throwinKicked = false;
          game.rsTimer = 0;
          game.rsReady = true;
          room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, xgravity: 0, ygravity: 0 });
          room.setDiscProperties(0, { color: "0x0fbcf9" });
        });
        sleep(1000).then(() => { // Total delay tetap terjaga (30 + 30)
          room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        });
      } else {
        room.setDiscProperties(3, { x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
        sleep(30).then(() => {
          game.outStatus = "redThrow";
          game.throwinKicked = false;
          game.rsTimer = 0;
          game.rsReady = true;
          room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, xgravity: 0, ygravity: 0 });
          room.setDiscProperties(0, { color: "0xff3f34" });
        });
        sleep(1000).then(() => {
          room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        });
      }
    }      

    if (room.getBallPosition().x > 1161.45 && (room.getBallPosition().y > 124 || room.getBallPosition().y < -124)) {
      game.rsActive = false;
      if (game.lastPlayAnnounced == true) {
        room.stopGame(true);
        game.lastPlayAnnounced = false;
        announce("⚽ FULL TIME ⚽");
        announce("⚽ FULL TIME ⚽");
        room.setTimeLimit(gameTime);
        // whisper("ʀᴇᴘʟᴀʏ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ꜱᴇɴᴛ ᴛᴏ ᴅɪꜱᴄᴏʀᴅ!", null);
      }
      room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
      room.getPlayerList().forEach(function (player) {
        room.setPlayerDiscProperties(player.id, { invMass: 100000 });
      });

      if (game.rsTouchTeam == 1) {
        room.setDiscProperties(3, { x: 1060, y: 0, radius: 18 });
        sleep(100).then(() => {
          game.outStatus = "blueGK";
          game.rsTimer = 0;
          game.rsReady = true;
          //room.sendAnnouncement("👀 [ᴄᴏᴍᴍᴇɴᴛᴀᴛᴏʀ]: Goal Kick for the blue team 🥅", null, 0xffffe0, "normal");
          game.rsGoalKick = true;
          game.rsSwingTimer = 0;
          game.boosterCount = 0;
          game.boosterState = false;
          room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: 1060, y: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0 });
        });
        sleep(3000).then(() => {
          room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        });
      } else {
        //room.sendAnnouncement("👀 [ᴄᴏᴍᴍᴇɴᴛᴀᴛᴏʀ]: Corner Kick for the red team 🚩", null, 0xffffe0, "normal");
        game.rsSwingTimer = 0;
        if (room.getBallPosition().y < -124) {
          room.setDiscProperties(3, { x: 1140, y: -590, radius: 18 });
          sleep(100).then(() => {
            game.rsCorner = true;
            game.outStatus = "redCK";
            game.rsTimer = 0;
            game.rsReady = true;
            game.boosterCount = 0;
            game.boosterState = false;
            room.setDiscProperties(0, { x: 1140, y: -590, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0 });
            room.setDiscProperties(2, { x: 1150, y: -670, radius: 420 });
            room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          });
        }
        if (room.getBallPosition().y > 124) {
          room.setDiscProperties(3, { x: 1140, y: 590, radius: 18 });
          sleep(100).then(() => {
            game.rsCorner = true;
            game.outStatus = "redCK";
            game.rsTimer = 0;
            game.rsReady = true;
            game.boosterCount = 0;
            game.boosterState = false;
            room.setDiscProperties(0, { x: 1140, y: 590, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0 });
            room.setDiscProperties(2, { x: 1150, y: 670, radius: 420 });
            room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          });
        }
      }
    }
    if (room.getBallPosition().x < -1161.45 && (room.getBallPosition().y > 124 || room.getBallPosition().y < -124)) {
      game.rsActive = false;
      if (game.lastPlayAnnounced == true) {
        room.stopGame(true);
        game.lastPlayAnnounced = false;
        announce("⚽ FULL TIME ⚽");
        announce("⚽ FULL TIME ⚽");
        room.setTimeLimit(gameTime);
        // whisper("ʀᴇᴘʟᴀʏ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ꜱᴇɴᴛ ᴛᴏ ᴅɪꜱᴄᴏʀᴅ!", null);
      }
      room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
      room.getPlayerList().forEach(function (player) {
        room.setPlayerDiscProperties(player.id, { invMass: 100000 });
      });

      if (game.rsTouchTeam == 1) {
        //room.sendAnnouncement("👀 [ᴄᴏᴍᴍᴇɴᴛᴀᴛᴏʀ]: Corner Kick for the blue team🚩", null, 0xffffe0, "normal");
        game.rsSwingTimer = 0;
        if (room.getBallPosition().y < -124) {
          room.setDiscProperties(3, { x: -1140, y: -590, radius: 18 });
          sleep(100).then(() => {
            game.rsCorner = true;
            game.outStatus = "blueCK";
            game.rsTimer = 0;
            game.rsReady = true;
            game.boosterCount = 0;
            game.boosterState = false;
            room.setDiscProperties(0, { x: -1140, y: -590, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0 });
            room.setDiscProperties(1, { x: -1150, y: -670, radius: 420 });
            room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          });
        }
        if (room.getBallPosition().y > 124) {
          room.setDiscProperties(3, { x: -1140, y: 590, radius: 18 });
          sleep(100).then(() => {
            game.rsCorner = true;
            game.outStatus = "blueCK";
            game.rsTimer = 0;
            game.rsReady = true;
            game.boosterCount = 0;
            game.boosterState = false;
            room.setDiscProperties(0, { x: -1140, y: 585, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0 });
            room.setDiscProperties(1, { x: -1150, y: 670, radius: 420 });
            room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          });
        }
      } else {
        room.setDiscProperties(3, { x: -1060, y: 0, radius: 18 });
        sleep(100).then(() => {
          game.outStatus = "redGK";
          game.rsTimer = 0;
          game.rsReady = true;
          //room.sendAnnouncement("👀 [ᴄᴏᴍᴍᴇɴᴛᴀᴛᴏʀ]: Goal Kick for the red team 🥅", null, 0xffffe0, "normal");
          game.rsGoalKick = true;
          game.rsSwingTimer = 0;
          game.boosterCount = 0;
          game.boosterState = false;
          room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: -1060, y: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0 });
        });
        sleep(3000).then(() => {
          room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        });
      }
    }
  }
}

function handleBallTouch() {
  var players = room.getPlayerList();
  var ballPosition = room.getBallPosition();
  var ballRadius = game.ballRadius;
  var playerRadius = 15;
  var triggerDistance = ballRadius + playerRadius + 0.01;
  var touchPlayer = null;
  var touchProgress = -1;

  for (var i = 0; i < players.length; i++) {
    // Iterate over all the players
    var player = players[i];
    if (player.position == null) continue;
    var distanceToBall = pointDistance(player.position, ballPosition);
    var pathDistanceToBall = distanceToBallPath(player.position, lastBallPositionForTouch, ballPosition);
    if (distanceToBall < triggerDistance || pathDistanceToBall < triggerDistance) {
      var progress = distanceToBall < triggerDistance ? 1 : ballPathProgress(player.position, lastBallPositionForTouch, ballPosition);
      if (progress > touchProgress) {
        touchPlayer = player;
        touchProgress = progress;
      }
    }
  }

  if (touchPlayer != null) {
    recordBallTouch(touchPlayer);
    game.throwinKicked = false;

    if (game.rsCorner == false && room.getDiscProperties(0).xgravity != 0) {
      room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
      game.rsSwingTimer = 10000;
    }
  }

  lastBallPositionForTouch = { x: ballPosition.x, y: ballPosition.y };
}

function updateGameStatus() {
  game.time = Math.floor(room.getScores().time);
  game.ballRadius = room.getDiscProperties(0).radius;
}

function announce(msg, targetId, color, style, sound) {
  if (color == null) {
    color = 0xfffd82;
  }
  if (style == null) {
    style = "bold";
  }
  if (sound == null) {
    sound = 0;
  }
  room.sendAnnouncement(msg, targetId, color, style, sound);
  //console.log("Announce: " + msg);
}

function whisper(msg, targetId, color, style, sound) {
  if (color == null) {
    color = 0x66c7ff;
  }
  if (style == null) {
    style = "normal";
  }
  if (sound == null) {
    sound = 0;
  }
  room.sendAnnouncement(msg, targetId, color, style, sound);
  if (room.getPlayer(targetId) != null) {
    //console.log("Whisper -> " + room.getPlayer(targetId).name + ": " + msg);
  }
}

// optimize
async function ballWarning(origColour, warningCount) {
  const intervals = [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1675, 1750];
  const colorSequence = ["0xffffff", origColour];

  for (let i = 0; i < intervals.length; i++) {
    await sleep(intervals[i]);
    if (game.warningCount === warningCount) {
      room.setDiscProperties(0, { color: colorSequence[i % 2] });
    }
  }
}

function extraTime() {
  var extraSeconds = Math.ceil(game.extraTimeCount / 41);
  game.extraTimeEnd = gameTime * 60 + extraSeconds;
  // announce("Extra time: " + extraSeconds + " Seconds", null, null, null, 1);
}

function secondsToMinutes(time) {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

function blockThrowIn() {
  var players = room.getPlayerList().filter((player) => player.team != 0);
  if (room.getBallPosition().y < 0) {
    // top throw line
    if (game.outStatus == "redThrow") {
      players.forEach(function (player) {
        if (room.getPlayerDiscProperties(player.id).invMass != 9999999) {
          room.setPlayerDiscProperties(player.id, { invMass: 9999999 });
        }
        if (player.team == 2 && room.getPlayerDiscProperties(player.id).y < 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
            room.setPlayerDiscProperties(player.id, { cGroup: 536870918 });
          }
          if (player.position.y < -460) {
            room.setPlayerDiscProperties(player.id, { y: -445 });
          }
        }
        if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
        }
        if (room.getDiscProperties(17).x != 1149) {
          // show top red line
          //room.setDiscProperties(17, { x: 1149 });
        }
        if (room.getDiscProperties(19).x != -1149) {
          // hide top blue line
          //room.setDiscProperties(19, { x: -1149 });
        }
      });
    }
    if (game.outStatus == "blueThrow") {
      players.forEach(function (player) {
        if (room.getPlayerDiscProperties(player.id).invMass != 9999999) {
          room.setPlayerDiscProperties(player.id, { invMass: 9999999 });
        }
        if (player.team == 1 && room.getPlayerDiscProperties(player.id).y < 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
            room.setPlayerDiscProperties(player.id, { cGroup: 536870918 });
          }
          if (player.position.y < -460) {
            room.setPlayerDiscProperties(player.id, { y: -445 });
          }
        }
        if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
        }
        if (room.getDiscProperties(19).x != 1149) {
          // show top blue line
          //room.setDiscProperties(19, { x: 1149 });
        }
        if (room.getDiscProperties(17).x != -1149) {
          // hide top red line
          //room.setDiscProperties(17, { x: -1149 });
        }
      });
    }
  }
  if (room.getBallPosition().y > 0) {
    // bottom throw line
    if (game.outStatus == "redThrow") {
      players.forEach(function (player) {
        if (room.getPlayerDiscProperties(player.id).invMass != 9999999) {
          room.setPlayerDiscProperties(player.id, { invMass: 9999999 });
        }
        if (player.team == 2 && room.getPlayerDiscProperties(player.id).y > 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
            room.setPlayerDiscProperties(player.id, { cGroup: 536870918 });
          }
          if (player.position.y > 460) {
            room.setPlayerDiscProperties(player.id, { y: 445 });
          }
        }
        if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
        }
        if (room.getDiscProperties(21).x != 1149) {
          // show bottom red line
          //room.setDiscProperties(21, { x: 1149 });
        }
        if (room.getDiscProperties(23).x != -1149) {
          // hide bottom blue line
          //room.setDiscProperties(23, { x: -1149 });
        }
      });
    }
    if (game.outStatus == "blueThrow") {
      players.forEach(function (player) {
        if (room.getPlayerDiscProperties(player.id).invMass != 9999999) {
          room.setPlayerDiscProperties(player.id, { invMass: 9999999 });
        }
        if (player.team == 1 && room.getPlayerDiscProperties(player.id).y > 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup != 536870918) {
            room.setPlayerDiscProperties(player.id, { cGroup: 536870918 });
          }
          if (player.position.y > 460) {
            room.setPlayerDiscProperties(player.id, { y: 445 });
          }
        }
        if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
        }
        if (room.getDiscProperties(23).x != 1149) {
          // show bottom blue line
          //room.setDiscProperties(23, { x: 1149 });
        }
        if (room.getDiscProperties(21).x != -1149) {
          // hide bottom red line
          //room.setDiscProperties(21, { x: -1149 });
        }
      });
    }
  }
}

function blockGoalKick() {
  var players = room.getPlayerList().filter((player) => player.team != 0);
  if (room.getBallPosition().x < 0) {
    // left side red goal kick
    if (game.outStatus == "redGK") {
      players.forEach(function (player) {
        if (player.team == 2 && room.getPlayerDiscProperties(player.id).x < 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup != 268435462) {
            room.setPlayerDiscProperties(player.id, { cGroup: 268435462 });
          }
          if (player.position.x < -840 && player.position.y > -320 && player.position.y < 320) {
            room.setPlayerDiscProperties(player.id, { x: -825 });
          }
        }
        if (player.team == 1 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
        }
      });
    }
  }
  if (room.getBallPosition().x > 0) {
    // right side blue goal kick
    if (game.outStatus == "blueGK") {
      players.forEach(function (player) {
        if (player.team == 1 && room.getPlayerDiscProperties(player.id).x > 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup != 268435462) {
            room.setPlayerDiscProperties(player.id, { cGroup: 268435462 });
          }
          if (player.position.x > 840 && player.position.y > -320 && player.position.y < 320) {
            room.setPlayerDiscProperties(player.id, { x: 825 });
          }
        }
        if (player.team == 2 && room.getPlayerDiscProperties(player.id).cGroup != 2) {
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
        }
      });
    }
  }
}

// optimize
function removeBlock() {
  const redLineX = -1149;
  const blueLineX = -1149;

  const players = room.getPlayerList().filter((player) => player.team !== 0);

  if (game.outStatus === "") {
    players.forEach((player) => {
      const discProperties = room.getPlayerDiscProperties(player.id);
      const cGroup = player.team === 1 ? 2 : 4;
      if (discProperties.cGroup !== cGroup) {
        room.setPlayerDiscProperties(player.id, { cGroup });
      }
    });

    const lines = [17, 19, 21, 23];
    lines.forEach((line) => {
      const lineX = room.getDiscProperties(line).x;
      if (lineX !== redLineX && lineX !== blueLineX) {
        room.setDiscProperties(line, { x: redLineX });
      }
    });
  }
}

// setInterval(function () {
//   room.sendAnnouncement("🔊 Join our Discord. https://discord.gg/pm55tVsQMX ", null, 0x5ee7ff, "small", 0);
   // setTimeout(function () {
   //   room.sendAnnouncement("⚽ RSI League Season 3", null, 0x61ddff, "normal", 0);
   // }, 50000); // Wait 40 seconds after the first announcement
// }, 220000);


let redTeamPlayers = [];
let blueTeamPlayers = [];
