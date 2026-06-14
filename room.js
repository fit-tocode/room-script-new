/* ROOM */
var roomName = " 💠    [ʀꜱɪ|ɪᴅ]  -  League Room A";
var roomPassword = "s6";
const maxPlayers = 30; 
const roomPublic = true; 
const geo = [{ lat: 10.7748, lon: 106.647  , code: "id" }]; //liga new region

//Real Soccer Variables
var throwTimeOut = 420; // 7 seconds (var is in game ticks)
var gkTimeOut = 600; // 10 seconds (var is in game ticks)
var ckTimeOut = 600; // 10 seconds (var is in game ticks)
var throwinDistance = 270; // distance players can move the ball during throw in
var powerShotMode = false;
var gameTime = 7; //default game time if 0 is selected
let playerLoginStatus = {};
var playersElo = {};
var usernames = {};

const room = HBInit ({
  token: "thr1.AAAAAGotHLoabqkWGWzOWg.MTzA1H0W42A",
  roomName: roomName,
  maxPlayers: maxPlayers,
  public: roomPublic,
  noPlayer: true,
  password: roomPassword,
  geo: geo[0],
})

var playerDefTime = {};

var postKickReset = {
    active: false,
    tickCount: 0,
    targetTicks: 3
};



var matchStats = {
    red: {
        shots: 0,
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        xG: 0,
        saves: 0
    },

    blue: {
        shots: 0,
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        xG: 0,
        saves: 0
    },

    goals: {},
    assists: {},
    savesByPlayer: {},
    ratings: {},
    passes: {},
successfulPasses: {},
keyPasses: {},
interceptions: {},
tackles: {}
};
var shotPendingSave = null;
var lastShot = null;


const scoreLimitPractice = 0;
const timeLimitPractice = 7;


let Cor = {
  Vermelho: 0xfa5646,
  Laranja: 0xffc12f,
  Verde: 0x7dfa89,
  Azul: 0x05c5ff,
  Amarelo: 0xffff17,
  Cinza: 0xcccccc,
  Branco: 0xffffff,
  Azulclaro: 0x6ecaff,
  Powderblue: 0xb0e0e6,
  Roxo: 0x800080,
  Platinum: 0xe5e4e2,
  Gold: 0xffd700,
  Silver: 0xd5d5d5,
  Bronze: 0x896728,
  Thistle: 0xd8bfd8,
  Khaki: 0xf0e68c,
  AliceBlue: 0xf0f8ff,
  GhostWhite: 0xf8f8ff,
  Snow: 0xfffafa,
  Seashell: 0xfff5ee,
  FloralWhite: 0xfffaf0,
  WhiteSmoke: 0xf5f5f5,
  Beige: 0xf5f5dc,
  OldLace: 0xfdf5e6,
  Ivory: 0xfffff0,
  Linen: 0xfaf0e6,
  Cornsilk: 0xfff8dc,
  AntiqueWhite: 0xfaebd7,
  BlanchedAlmond: 0xffebcd,
  Bisque: 0xffe4c4,
  LightYellow: 0xffffe0,
  LemonChiffon: 0xfffacd,
  LightGoldenrodYellow: 0xfafad2,
  PapayaWhip: 0xffefd5,
  PeachPuff: 0xffdab9,
  Moccasin: 0xffe4b5,
  PaleGoldenrod: 0xeee8aa,
  Azulescuro: 0x426ad6,
  Warn: 0xff9966,
};
// here you can place/edit goal messages, always respecting the " , ". Example: "Belo gooool," the player's name will always be after the comma.
const frasesGols = [
  "What a great goal from ",
  "Goalll !!!! world class shoot from ",
  "Its a goall againnn ",
  "Wow! puskas nominated goall from ",
  "What a goall !! even the goalkeeper can't save that ",
  "Rocket shoot from ",
  "Impressive finishing from ",
  "Its a goallll !! good finishing ",
  "Holy shit, what a goal is that ",
  "Wow! a masterpice goall that is ",
  "More and more and more, clutch shoot from ",
  "Gollazooo, goles de los mejores jugadores del campo que es ",
];
const bannedWords = [
    "ajg",
    "anjg",
    "anjing",
    "anjeng",
    "jembut",
    "jnck",
    "jncuk",
    "jancok",
    "jancox",
    "jancuk",
    "jncx",
    "peler",
    "pler",
    "plr",
    "pepek",
    "pe pek",
    "ppk",
    "fuck",
    "kontol",
    "ktl",
    "kntl",
    "memmek",
    "titit",
    "konntol",
    "konthol",
    "kintil",
    "bgsd",
    "bangsat",
    "bgst",
    "bangst",
    "bgsd",
    "entot",
    "ngewe",
    "bngsd",
    "babi",
    "yatim",
    "tl0l",
    "pala kau",
    "njeng",
    "njing",
    "boodoh",
    "ciu",
    "pantek",
    "memek",
    "mmk",
    "puki",
    "taik",
    "taii",
    "paok",
    "bodoh",
    "bloon",
    "dongo",
    "goblok",
    "goblog",
    "gblk",
    "blok",
    "blogg",
    "bego",
    "be go",
    "bacot",
    "beego",
    "tolol",
    "to lol",
    "tlool",
    "tlol",
    "tlloooll",
    "idiot",
    "shit",
    "banci",
    "nigga",
    "niga",
    "gay",
    "coli",
  ];
// here you can place/edit assistance messages, always respecting the " , ". Example: "Nice pass," the player's name will always be after the comma.
const frasesasis = [" with the beautiful of ", " accompanied by the beautiful pass of ", " with the ball in the mouth of the goal by ", " with the phenomenal assistance of ", " and we cannot forget the magnificent pass of"];
// here you can post/edit messages for mockery, for own goals, always respecting the " , ". Example: "Try to kick to the other side," the player's name will always be after the comma.
const frasesautogol = [" I'm sure it was by accident, right, ", " YOU'RE PLAYING FOR THE WRONG TEAM, ", " IT'S GOOOOOOOOOL... against ", " Return to the sea offering, "];

const secondsToResetAvatar = 3;
var registro = new Map();
const css = "border:2px solid;padding:8px;background:";
room.setTeamsLock(true);
var message;
var Botdivulga;
var msg1;
var msg1Time = 300000;
var Deus = [];
var BotdivulgaTime = 900000;
var adminPassword = "rsi";
var freeze = []; //Holds the name of the frozen players.
var playerInformations = []; //Holds players names, ID's and positions (undefined if not frozen).
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

let previousPlayerCount = 0;

// Store last message times and counts for players
var lastMessageTime = {};
var messageCounts = {};

var vip1 = [];
var vip2 = [];
var vip3 = [];
var globalChatEnabled = true;

let isTurneyStarted = false;
let countdownTimeouts = [];
let penKick = false;
let isFirstHalf = true;
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

// RSI RANDOM KIT
var redTeamColors = [
  // COUNTRY
  {angle: 132, textColor: 0xffffff, colors: [0x1fa303, 0xfc0000], name: "Portugal", type: "country"},
  {angle: 180, textColor: 0x000000, colors: [0x2a74d1, 0xfcfcfc, 0x2a74d1], name: "Argentina", type: "country"},
  {angle: 90, textColor: 0x000000, colors: [0xffee1c, 0x1fd111], name: "Brazil", type: "country"},
  {angle: 90, textColor: 0xd19e1f, colors: [0x151619, 0x990011, 0x990011], name: "Belgia", type: "country"},
  {angle: 90, textColor: 0xffffff, colors: [0xff5f05], name: "Netherlands", type: "country"},
  {angle: 90, textColor: 0x000000, colors: [0xEBEBEB, 0xD40000, 0xEBEBEB], name: "England", type: "country"},
  {angle: 90, textColor: 0x000000, colors: [0xf50000, 0xffffff], name: "Indonesia", type: "country"},
  {angle: 90, textColor: 0xfeea67, colors: [0xff3136], name: "Spain", type: "country"},
  
  //CLUB
  {angle: 0, textColor: 0xffffff, colors: [0xd10000], name: "Liverpool FC", type: "club"},
  {angle: 90, textColor: 0xffffff, colors: [0x0D0000, 0xD80000, 0x0D0000], name: "FC Bayer Leverkusen", type: "club"},
  {angle: 180, textColor: 0x000000, colors: [0xffffff], name: "Real Madrid CF", type: "club"},
  {angle: 0, textColor: 0xffffff, colors: [0xf50000, 0x000000, 0xff0000], name: "AC Milan", type: "club"},
  {angle: 180, textColor: 0xffffff, colors: [0xff0000, 0x3228d1, 0xff0000], name: "FC Barcelona", type: "club"},
  {angle: 180, textColor: 0xadadad, colors: [0x232323, 0xffffff], name: "Juventus FC", type: "club"},
  {angle: 90, textColor: 0xffffff, colors: [0xfa0c0c, 0x000000], name: "Man United FC", type: "club"},
  {angle: 180, textColor: 0x000000, colors: [0xff0000, 0xffffff, 0xff0000], name: "Atletico Madrid", type: "club"},
  {angle: 90, textColor: 0xffffff, colors: [0xe7eaef, 0xba1029, 0xba1029], name: "Arsenal FC", type: "club"},
  {angle: 0, textColor: 0xFFFFFF, colors: [0x21298F, 0xC40000, 0xD6D6D6], name: "PSG", type: "club"},
  {angle: 0, textColor: 0xFFFFFF, colors: [0xCF0000, 0xCF0000, 0xABABAB], name: "FC Benfica", type: "club"},
  {angle: 0, textColor: 0xE0BC57 , colors: [0xB71D1D, 0x941717, 0xB71D1D], name: "Garuda Home", type: "club"},
  {angle: 0, textColor: 0xFFFFFF  , colors: [0xE0BC57 , 0xCFAD50, 0xE0BC57], name: "Garuda Away", type: "club"},
  {angle: 0, textColor: 0xFFFFFF, colors: [0xFFFFFF, 0xFF0000, 0xFFFFFF], name: "Sevilla FC", type: "club"}
];
var blueTeamColors = [
  //COUNTRY
  {angle: 132, textColor: 0xffffff, colors: [0x1fa303, 0xfc0000], name: "Portugal", type: "country"},
  {angle: 180, textColor: 0x000000, colors: [0x2a74d1, 0xfcfcfc, 0x2a74d1], name: "Argentina", type: "country"},
  {angle: 90, textColor: 0x000000, colors: [0xffee1c, 0x1fd111], name: "Brazil", type: "country"},
  {angle: 90, textColor: 0xd19e1f, colors: [0x151619, 0x990011, 0x990011], name: "Belgia", type: "country"},
  {angle: 90, textColor: 0x000000, colors: [0x25318F, 0x25318F, 0xEBEBEB], name: "France", type: "country"},
  {angle: 90, textColor: 0x000000, colors: [0x4D5AFF, 0x4D5AFF, 0xAFC1E3], name: "Uruguay", type: "country"},
  {angle: 270, textColor: 0xFFFFFF, colors: [0x2E911D], name: "Saudi Arabia", type: "country"},

  //CLUB
  {angle: 0, textColor: 0xffffff, colors: [0x040099], name: "Chelsea FC", type: "club"},
  {angle: 90, textColor: 0xffffff, colors: [0x0D0000, 0xD80000, 0x0D0000], name: "FC Bayer Leverkusen", type: "club"},
  {angle: 180, textColor: 0x000000, colors: [0xffffff], name: "Real Madrid CF", type: "club"},
  {angle: 0, textColor: 0xffffff, colors: [0x2526f5, 0x000000, 0x2526f5], name: "Inter Milan", type: "club"},
  {angle: 180, textColor: 0xadadad, colors: [0x232323, 0xffffff], name: "Juventus FC", type: "club"},
  {angle: 90, textColor: 0x000000, colors: [0x2186d1, 0xfcfcfc], name: "Man City FC", type: "club"},
  {angle: 180, textColor: 0x000000, colors: [0xff0000, 0xffffff, 0xff0000], name: "Atletico Madrid", type: "club"},
  {angle: 270, textColor: 0x000000, colors: [0x130c5c, 0xffffff, 0xffffff], name: "Tottenham Hotspurs", type: "club"},
  {angle: 0, textColor: 0xFFFFFF, colors: [0x21298F, 0xC40000, 0xD6D6D6], name: "PSG", type: "club"},
  {angle: 90, textColor: 0xFFFFFF, colors: [0x0080FF, 0xFFFFFF, 0x0080F], name: "SSC Napoli", type: "club"},
  {angle: 0, textColor: 0xFFFFFF, colors: [0x0000FF, 0xFFFFFF, 0x0000FF], name: "FC Porto", type: "club"},
  {angle: 0, textColor: 0xFFFFFF, colors: [0xFFFFFF, 0xFF0000, 0xFFFFFF], name: "Sevilla FC", type: "club"}
];
// Function to get a random item from an array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
// Function to check if two uniform configurations are the same
function areUniformsEqual(uniform1, uniform2) {
  return JSON.stringify(uniform1) === JSON.stringify(uniform2);
}

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
     
    { "radius" : 0, "pos" : [-1000,-1000 ], "cGroup" : ["c2" ] },
		{ "radius" : 0, "pos" : [-1000,-1000 ], "cGroup" : ["c2" ] },
		{ "radius" : 0, "pos" : [-1000,-1000 ], "cGroup" : ["c2" ] },
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
 { "d0" : 62, "d1" : 63, "strength" : 0.000002, "color" : "000000", "length" : [0,10000 ] },
 { "d0" : 62, "d1" : 64, "strength" : 0.000002, "color" : "ff0000", "length" : [0,10000 ] },

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

var curveState = {
	active: false,
	startTime: 0,
	dir: { x: 0, y: 0 },
	lastUpdate: 0,
  ownerId: null
};
// ================= DRIBBLE SLIDER =================
var dribbleState = {
	active: false,
	startTime: 0,
	playerId: null,
	ready: false
};

var sliderCurrentPos = {
    start: { x: 0, y: 0 },
    power: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
};
var sliderInitialized = false;

var dribbleCurveEnabled = true;
let lastBallVel = { x: 0, y: 0 };

let dribblePlayers = new Set();
let dribbleLock = false;

const DRIBBLE_THRESHOLD = 1500;
const POWER_THRESHOLD = 1000;
const DRIBBLE_CURVE_MAX = 0.06;


const DRIBBLE_SLIDER_START = 62;
const DRIBBLE_SLIDER_POWER = 63;
const DRIBBLE_SLIDER_END = 64;

let playerCurveToggle = new Map();
// ================= DRIBBLE SLIDER =================

var sliderState = {
	active: false,
	init: false,
	pos: {
		start: { x: 0, y: 0 },
		power: { x: 0, y: 0 },
		end: { x: 0, y: 0 }
	}
};

// ================= DEADBALL INVMASS =================

const CORNER_INVMASS_START = 0.45;
const CORNER_INVMASS_MAX   = 1.4;

// GOALKICK
const GOALKICK_INVMASS_START = 0.3;
const GOALKICK_INVMASS_MAX   = 1.8;

// THROWIN
const THROWIN_INVMASS_START = 0.35;
const THROWIN_INVMASS_MAX   = 0.9;

var deadBallPowerState = {
	active: false,
	playerId: null,
	invMass: 0.8,
  progress: 0
};


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
var teams = ["spectators","red","blue"];

/* GAME */

let forbid = ["macaco", "adolf hitler", "nazismo", "cuzao", "cuzão", "autista", "cu", "hitler", "Macaco", "Hitler", "Pênis"];

let link = ["https://www.haxball.com/play?c=_", "https://www.haxball.com", "haxball.com", ".com", "https://", "https:", "https://www."];

function nameForbid(player) {
  if (forbid.includes(player.name)) {
    room.kickPlayer(player.id, "nick proibido nessa sala", false);
  }
}

var lastTeamTouched; // records who was the last to touch the ball
var lastPlayersTouched; // allows you to receive good goal notifications (must be lastPlayersKicked, waiting for a next update to get better control of shots on target)
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
var redCaptainChoice = "";
var blueCaptainChoice = "";
var chooseTime = 20;
var timeOutCap;

/* ASSISTANT */

var checkTimeVariable = false; // this is created so that chat doesn't get spammed when a game ends via timeLimit
var announced = false;
var statNumber = 0; // this allows the room to receive statistical information every X minutes
var endGameVariable = false; // this variable with the one below helps distinguish cases where games are stopped because they are over from those where games are stopped due to player movements or team resets
var resettingTeams = false;
var capLeft = false;
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
// Webhooks
// -------------------------------------------------

let replayWebHook = "https://discord.com/api/webhooks/151203328499594047/X7MRX6ehKIqVnMREYQbLik9A9D2ywN7w7e_xDzlCsL5Otoz2MP5mmGBVZMbWKlXXC5eu";
let goalWebHook = "https://discord.com/api/webhooks/151203328499594047/X7MRX6ehKIqVnMREYQbLik9A9D2ywN7w7e_xDzlCsL5Otoz2MP5mmGBVZMbWKlXXC5eu";
let chatWebHook = "https://discordapp.com/api/webhooks/1330141556866285588/3O9bGOCUzI-1A-Wl-5k13oHwOxRhZ0ZC_rIvnb1tUS-RcAJMpxx2gDbJt4IRoofemWe8";
let joinWebHook = "https://discordapp.com/api/webhooks/1330141701406326888/HabH3dSxlinBCCEQ2zA0Xr5q-4QfgoR8A3G1xQQAuLoCFa0RTk4xcY_sQNMXvWKYzkqr";
let countWebHook = "https://discordapp.com/api/webhooks/1359705772421812295/MyPVLYIr15mvpERNFqvt-7n43WFKTRRfvj38QmXm8u7ap0NDRaWiYkrhVPpXl_f-KNR5";


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
    this.lastKickerId;
    this.lastKickerName;
    this.lastKickerTeam;
    this.secondLastKickerId;
    this.secondLastKickerName;
    this.secondLastKickerTeam;
    this.redScore = 0;
    this.blueScore = 0;
    this.powershotCounter = 0;
    this.powershotID = 0;
    this.powershotTrigger = false;
  }

  updateLastKicker(id, name, team) {
    this.secondLastKickerId = this.lastKickerId;
    this.secondLastKickerName = this.lastKickerName;
    this.secondLastKickerTeam = this.lastKickerTeam;

    this.lastKickerId = id;
    this.lastKickerName = name;
    this.lastKickerTeam = team;
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

// Function to send webhook
function sendWebhook(url, content) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res);
}

/* CHASING */
function golcontra(goaler) {
  var messages = [
    "I'm sure it was unintentional, right, " + goaler.name + "?",
    "YOU'RE PLAYING FOR THE WRONG TEAM, " + goaler.name,
    "Pro tip " + goaler.name + ": Next time... DON'T AIM AT YOUR GOAL!!",
    goaler.name + " What are you doing?",
    "Harry " + goaler.name + " Maguire",
  ];
  var randomIndex = Math.floor(Math.random() * messages.length);
  var announcement = messages[randomIndex];
  setTimeout(function () {
    room.sendAnnouncement(centerText(announcement), null, Cor.White, "bold");
  }, 3000);
}

/* AUXILIARY FUNCTIONS */

function getRandomInt(max) {
  // returns a random number from 0 to max-1
  return Math.floor(Math.random() * Math.floor(max));
}

function getTime(scores) {
  // returns the current game time
  return (
    "[" +
    Math.floor(Math.floor(scores.time / 60) / 10).toString() +
    Math.floor(Math.floor(scores.time / 60) % 10).toString() +
    ":" +
    Math.floor(Math.floor(scores.time - Math.floor(scores.time / 60) * 60) / 10).toString() +
    Math.floor(Math.floor(scores.time - Math.floor(scores.time / 60) * 60) % 10).toString() +
    "]"
  );
}

function createPlayer(player){ //Create player informations, it will be used in the event.
  playerInformations[playerInformations.length] = {
name:player.name,
id:player.id,
freezePoint:{
    x:undefined,
    y:undefined
}
  }
}

function deletePlayer(id){ //Delete player informations, it will be used in the event.
  for(var i=0; i<playerInformations.length; i++){
if(playerInformations[i].id == id){
    playerInformations.splice(i,1);
}
  }
}

function getPlayerByID(id){ //Gets players by their ID's, it will be used by controlling players one by one.
  for(var i=0; i<playerInformations.length; i++){
if(playerInformations[i].id == id){
    return playerInformations[i];
}
  }
}

function handleFrozenPlayerMoves(){ //Detects moves of frozen players. If a frozen player tries to move from their freeze point, then they will be moved to that point.
  var players = room.getPlayerList();
  for(var i=0; i<players.length; i++){
if(freeze.includes(players[i].name) == true && pointDistance(room.getPlayerDiscProperties(players[i].id),getPlayerByID(players[i].id).freezePoint) > 0){
    room.setPlayerDiscProperties(players[i].id,{x:getPlayerByID(players[i].id).freezePoint.x,y:getPlayerByID(players[i].id).freezePoint.y,xspeed:0,yspeed:0});
}
  }
}

function pointDistance(p1, p2) {
  var d1 = p1.x - p2.x;
  var d2 = p1.y - p2.y;
  return Math.sqrt(d1 * d1 + d2 * d2);
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/* BUTTONS */

function download(conteudo, nomeDoArquivo, tipoDeArquivo) {
  let blob = new Blob([conteudo], {
    type: tipoDeArquivo,
  });
  const link = window.document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = nomeDoArquivo;
  link.click();
  window.URL.revokeObjectURL(link.href);
}

function topBtn() {
  if (teamS.length == 0) {
    return;
  } else {
    if (TeamR.length == TeamB.length) {
      if (teamS.length > 1) {
        room.setPlayerTeam(teamS[0].id, Team.RED);
        room.setPlayerTeam(teamS[1].id, Team.BLUE);
      }
      return;
    } else if (TeamR.length < TeamB.length) {
      room.setPlayerTeam(teamS[0].id, Team.RED);
    } else {
      room.setPlayerTeam(teamS[0].id, Team.BLUE);
    }
  }
}

function randomBtn() {
  if (teamS.length == 0) {
    return;
  } else {
    if (TeamR.length == TeamB.length) {
      if (teamS.length > 1) {
        var r = getRandomInt(teamS.length);
        room.setPlayerTeam(teamS[r].id, Team.RED);
        teamS = teamS.filter((spec) => spec.id != teamS[r].id);
        room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
      }
      return;
    } else if (TeamR.length < TeamB.length) {
      room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED);
    } else {
      room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
    }
  }
}

function blueToSpecBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  for (var i = 0; i < TeamB.length; i++) {
    room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
  }
}

function redToSpecBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  for (var i = 0; i < TeamR.length; i++) {
    room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
  }
}

function resetBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  if (TeamR.length <= TeamB.length) {
    for (var i = 0; i < TeamR.length; i++) {
      room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
      room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
    }
    for (var i = TeamR.length; i < TeamB.length; i++) {
      room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
    }
  } else {
    for (var i = 0; i < TeamB.length; i++) {
      room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
      room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
    }
    for (var i = TeamB.length; i < TeamR.length; i++) {
      room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
    }
  }
}

function blueToRedBtn() {
  resettingTeams = true;
  setTimeout(() => {
    resettingTeams = false;
  }, 100);
  for (var i = 0; i < TeamB.length; i++) {
    room.setPlayerTeam(TeamB[i].id, Team.RED);
  }
}

/* GAME FUNCTIONS */

function trackGoalkeepers(){

    let players = room.getPlayerList();

    players.forEach(player=>{

        if(player.team == Team.RED){

            let pos = room.getPlayerDiscProperties(player.id);

            if(pos && pos.x < -600){
                playerDefTime[player.id]++;
            }

        }

        if(player.team == Team.BLUE){

            let pos = room.getPlayerDiscProperties(player.id);

            if(pos && pos.x > 600){
                playerDefTime[player.id]++;
            }

        }

    });

}

function getGoalkeeper(team){

    let players = room
        .getPlayerList()
        .filter(p=>p.team == team);

    let gk = null;
    let best = -1;

    players.forEach(player=>{

        let t = playerDefTime[player.id] || 0;

        if(t > best){
            best = t;
            gk = player;
        }

    });

    return gk;
}

function registerShot(player){

    let ball = room.getBallPosition();
    let vel = room.getDiscProperties(0);

    let towardsGoal =
        player.team == Team.RED
        ? vel.x > 0
        : vel.x < 0;

    if(!towardsGoal) return;

    let goalLine =
        player.team == Team.RED
        ? 1161.45
        : -1161.45;

   let t =
    (goalLine - ball.x) /
    (vel.xspeed || 0.01); 

let projectedY =
    ball.y + vel.yspeed * t; 

    let onTarget =
        Math.abs(projectedY) <= 124;

    shotPendingSave = null;

    if(onTarget){

        shotPendingSave = {
            shooterTeam: player.team,
            shooterId: player.id
        };
    }

    let xg = calculateXG(
        ball.x,
        ball.y,
        player.team
    );

    if(player.team == Team.RED){

        matchStats.red.shots++;
        matchStats.red.xG += xg;

        if(onTarget)
            matchStats.red.shotsOnTarget++;
        else
            matchStats.red.shotsOffTarget++;

    }else{

        matchStats.blue.shots++;
        matchStats.blue.xG += xg;

        if(onTarget)
            matchStats.blue.shotsOnTarget++;
        else
            matchStats.blue.shotsOffTarget++;
    }

    lastShot = {
        playerId: player.id,
        playerName: player.name,
        team: player.team,
        x: ball.x,
        y: ball.y,
        xG: xg,
        onTarget: onTarget,
        projectedY: projectedY
    };
}

function isShot(player){

    let ball = room.getBallPosition();
    let vel = room.getDiscProperties(0);

    if(player.team == Team.RED){

        return (
            ball.x > 420 &&
            vel.xspeed > 0
        );
    }

    if(player.team == Team.BLUE){

        return (
            ball.x < -420 &&
            vel.xspeed < 0
        );
    }

    return false;
}

function calculateXG(x,y,team){

    let goalX =
        team == Team.RED
        ? 1161.45
        : -1161.45;

    let distance = Math.sqrt(
        (goalX-x)*(goalX-x) +
        y*y
    );

    let angleFactor =
        1 -
        Math.min(
            Math.abs(y)/400,
            1
        );

    let distanceFactor =
        Math.max(
            0,
            1 - distance/1200
        );

    let xg =
        distanceFactor *
        angleFactor *
        0.7;

    return Math.max(
        0.01,
        Math.min(0.85,xg)
    );
}

function resetMatchStats() {

    matchStats = {
        red: {
            shots: 0,
            shotsOnTarget: 0,
            shotsOffTarget: 0,
            xG: 0,
            saves: 0
        },

        blue: {
            shots: 0,
            shotsOnTarget: 0,
            shotsOffTarget: 0,
            xG: 0,
            saves: 0
        },

        goals: {},
        assists: {},
        savesByPlayer: {},
        ratings: {}
    };

    lastShot = null;

    playerDefTime = {};

    room.getPlayerList().forEach(p=>{
        playerDefTime[p.id] = 0;
    });

}

// ===============================
// POST KICK DEBUG LOGGER
// ===============================


function getDeadBallInvMass(progress) {

	// ===============================
	// CORNER
	// ===============================

	if (game.rsCorner) {

		return (
			CORNER_INVMASS_START +
			(CORNER_INVMASS_MAX - CORNER_INVMASS_START) * progress
		);
	}

	// ===============================
	// GOALKICK
	// ===============================

	if (game.rsGoalKick) {

		return (
			GOALKICK_INVMASS_START +
			(GOALKICK_INVMASS_MAX - GOALKICK_INVMASS_START) * progress
		);
	}

	// ===============================
	// THROWIN
	// ===============================

	if (
		game.outStatus == "redThrow" ||
		game.outStatus == "blueThrow"
	) {

		return (
			THROWIN_INVMASS_START +
			(THROWIN_INVMASS_MAX - THROWIN_INVMASS_START) * progress
		);
	}

	// fallback
	return 0.8;
}

const LERP_SPEED = 0.25;

function lerp(a, b, t) {
	return a + (b - a) * t;
}

function lockDribblePlayers() {
	dribblePlayers.clear();

	room.getPlayerList().forEach(p => {
		if (p.team !== 0) {
			dribblePlayers.add(p.id);
		}
	});

	dribbleLock = true;
}

function tryRelockDribble() {
	if (dribbleLock) return;

	const activePlayers = room.getPlayerList().filter(p => p.team !== 0);

	if (activePlayers.length >= 2) { // atau sesuai kebutuhan (misal full team)
		lockDribblePlayers();
	}
}


//fitur rs only tidak bisa dicopy untuk game mode lain
function resetCurve() {
	curveState.active = false;
	curveState.startTime = 0;
	curveState.lastUpdate = 0;

	curveState.dir = {
		x: 0,
		y: 0
	};

	curveState.ownerId = null;

	room.setDiscProperties(0, {
		xgravity: 0,
		ygravity: 0
	});
}

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
    room.sendAnnouncement(centerText("EXTRA TIME"), null, Cor.Amarelo, "bold");
    room.sendAnnouncement(centerText("Added +" + drawTimeLimit * 60 + " seconds!"), null, Cor.White, "normal");
    room.sendAnnouncement(centerText("⚽ First goal wins! ⚽"), null, Cor.White, "normal");
  }
  if (scores.time > scores.timeLimit + drawTimeLimit * 60 - 15 && scores.time <= scores.timeLimit + drawTimeLimit * 60) {
    if (checkTimeVariable == false && announced == false) {
      checkTimeVariable = true;
      announced = true;
      setTimeout(() => {
        checkTimeVariable = false;
      }, 10);
      room.sendAnnouncement(centerText("⌛ 15 seconds to draw!"), null, Cor.Amarelo, "bold");
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
    room.sendAnnouncement(centerText("🏆 FULL TIME 🏆"), null, Cor.White, "bold");
    room.sendAnnouncement(centerText(" " + scores.red + " - " + scores.blue), null, Cor.White, "normal");
    room.sendAnnouncement(centerText((Rposs * 100).toPrecision(3).toString() + "% | Ball possession | " + (Bposs * 100).toPrecision(3).toString() + "% "), null, Cor.White, "normal");
  }
  // sendWebhook(goalWebHook, `\`[SECOND-HALF]\`** Scores ** \`🟥 ${scores.red} - ${scores.blue} 🟦\``);
  // scores.red == 0
  //   ? scores.blue == 0
  //     ? room.sendAnnouncement("🥅 " + GKList[0].name + " it's a man? no, it's a barrier! " + GKList[1].name + " saved all goals ", null, 0xfdc43a)
  //     : room.sendAnnouncement("🥅 it's a man? no, it's a barrier! " + GKList[1].name + " saved all goals ", null, 0xfdc43a)
  //   : scores.blue == 0
  //   ? room.sendAnnouncement("🥅 it's a man? no, it's a barrier! " + GKList[0].name + " saved all goals ", null, 0xfdc43a)
  //   : null;
  updateStats();
}

function loadMap(map, scoreLim, timeLim) {
  if (map != "") {
    room.setCustomStadium(map);
  } else {
    //console.log("There was an error loading the stadium");
    room.setDefaultStadium("Classic");
  }
  room.setScoreLimit(scoreLim);
  room.setTimeLimit(timeLim);
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

function getLastTouchOfTheBall() {
  const ballPosition = room.getBallPosition();
  updateTeams();
  for (var i = 0; i < players.length; i++) {
    if (players[i].position != null) {
      var distanceToBall = pointDistance(players[i].position, ballPosition);
      if (distanceToBall < triggerDistance) {
        !activePlay ? (activePlay = true) : null;
        if (lastTeamTouched == players[i].team && lastPlayersTouched[0] != null && lastPlayersTouched[0].id != players[i].id) {
          lastPlayersTouched[1] = lastPlayersTouched[0];
          lastPlayersTouched[0] = players[i];
        }
        lastTeamTouched = players[i].team;
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
  sendWebhook(joinWebHook, `\`${player.name} [${player.id}] [id:${player.conn}] [auth:${player.auth}] joined rs server.\``);
  createPlayer(player);

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

function updatePlayerCount() {
  const players = room.getPlayerList().filter(player => player.id !== 0); // Exclude the host bot
  const currentPlayerCount = players.length;

  if (currentPlayerCount !== previousPlayerCount) {
      const playerNames = players.map(player => `[-] ${player.name}${player.admin ? ' (admin)' : ''}`).join('\n');
      const adminCount = players.filter(player => player.admin).length;
      let message;

      if (adminCount > 0) {
          message = `\`🟢[rsi league s5] ${currentPlayerCount} players (${adminCount} admin)\n${playerNames}\``;
      } else {
          message = `\`🟢[rsi league s5] ${currentPlayerCount} players\n${playerNames}\``;
      }

      sendWebhook(countWebHook, message);
      previousPlayerCount = currentPlayerCount; // Update the previous player count only if the webhook is sent
  }
}

setInterval(updatePlayerCount, 5000);

function findNextAdmin() {
  var players = room.getPlayerList();
  for (var i = 0; i < players.length; i++) {
    if (!players[i].admin && players[i].id !== 0) {
      return players[i];
    }
  }
  return null; // No suitable player found
}

room.onPlayerTeamChange = function (changedPlayer, byPlayer) {

  // Prevent host (id 0) join team
  if (changedPlayer.id === 0) {
    room.setPlayerTeam(0, Team.SPECTATORS);
    return;
  }

  // AFK check
  if (getAFK(changedPlayer) && changedPlayer.team !== Team.SPECTATORS) {
    room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
    room.sendChat(changedPlayer.name + " is AFK!");
    return;
  }

  updateTeams();

  // Reset activity kalau jadi spectator
  if (changedPlayer.team === Team.SPECTATORS) {
    setActivity(changedPlayer, 0);
  }

  // Announcement team
  if (changedPlayer.team === Team.RED) {
    room.sendAnnouncement(
      "🡪 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴍᴏᴠᴇᴅ ᴛᴏ ʀᴇᴅ ᴛᴇᴀᴍ",
      changedPlayer.id,
      0xed6a5a,
      "small",
      1
    );
  } else if (changedPlayer.team === Team.BLUE) {
    room.sendAnnouncement(
      "🡪 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴍᴏᴠᴇᴅ ᴛᴏ ʙʟᴜᴇ ᴛᴇᴀᴍ",
      changedPlayer.id,
      0x33dddd,
      "small",
      1
    );
  }

  if (changedPlayer.team !== Team.SPECTATORS) {
    // Player masuk tim → langsung bisa dribble
    dribblePlayers.add(changedPlayer.id);
  } else {
    // Player keluar tim → hapus dari dribble
    dribblePlayers.delete(changedPlayer.id);

    // Kalau dia lagi pegang dribble → reset
    if (dribbleState.playerId === changedPlayer.id) {
      resetDribbleSlider();
    }
  }

};

function isAdminPresent() {
  var players = room.getPlayerList();
  if (players.find((player) => player.admin) != null) {
    return true;
  } else {
    return false;
  }
}

room.onPlayerLeave = function (player) {
  const currentTime = getCurrentTime();
  console.log(`${currentTime} ➡️ ${player.name} [${player.id}] has left.`);
  sendWebhook(joinWebHook, `\`${player.name} [${player.id}] has left rs server.\``);
  deletePlayer(player);
  	playerCurveToggle.delete(player.id);


  // if (TeamR.findIndex((red) => red.id == player.id) == 0 && inChooseMode && TeamR.length <= TeamB.length) {
  //   choosePlayer();
  //   capLeft = true;
  //   setTimeout(() => {
  //     capLeft = false;
  //   }, 10);
  // }
  // if (TeamB.findIndex((blue) => blue.id == player.id) == 0 && inChooseMode && TeamB.length < TeamR.length) {
  //   choosePlayer();
  //   capLeft = true;
  //   setTimeout(() => {
  //     capLeft = false;
  //   }, 10);
  // }
  // setActivity(player, 0);
  // updateRoleOnPlayerOut();
};

room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
  ban == true ? banList.push([kickedPlayer.name, kickedPlayer.id]) : null;
};

/* PLAYER ACTIVITY */

room.onPlayerChat = function (player, message) {
  
  sendWebhook(chatWebHook, `\`💬 [league] ${player.name} [${player.id}]: ${message}\``);
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
      let username = usernames[player.id] || "Guest";
      room.sendAnnouncement("[GLOBAL CHAT] [" + username + "] " + player.name + ": " + globalMsg, null, 0xffffff);      
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

  if (message.toLowerCase() === "!curveoff") {
		playerCurveToggle.set(player.id, false);
		room.sendAnnouncement("Banana kick disabled.", player.id, 0xff4d4d);
		return false;
	}

	if (message.toLowerCase() === "!curveon") {
		playerCurveToggle.set(player.id, true);
		room.sendAnnouncement("Banana kick enabled.", player.id, 0x5cff8d);
		return false;
	}

  	if (message.toLowerCase() === "!dribblecurve") {
	if (!player.admin) {
		room.sendAnnouncement(" Hanya admin yang bisa toggle dribble curve!", player.id, 0xff4d4d);
		return false;
	}

	dribbleCurveEnabled = !dribbleCurveEnabled;

	const status = dribbleCurveEnabled ? "🟢 ENABLED" : "🔴 DISABLED";
	room.sendAnnouncement(`⚡ DRIBBLE CURVE: ${status}`);

	// Reset kalau dimatiin biar clean
	if (!dribbleCurveEnabled) {
	curveState.active = false;

	room.setDiscProperties(0, {
		xgravity: 0,
		ygravity: 0
	});
}

	return false;
}

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

        sendWebhook(goalWebHook, `\`[BOOKINGS]\` 🟨 Player: \`${targetPlayerName}\` Reason: \`${reason}\` `);
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

        sendWebhook(goalWebHook, `\`[BOOKINGS]\` 🟥 Player: \`${targetPlayerName}\` Reason: \`${reason}\` `);
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
    
  //   sendWebhook(goalWebHook, `\`[SUBS REQUEST ${teamEmoji}]\` Captain ${playerName} request subs OUT: \`${playerout}\` IN: \`${playerin}\` `);
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

  if (message.startsWith("!sub ") || message.startsWith("!s ")) {
    if (args.length !== 3) {
        room.sendChat("Usage: !sub #<player_id_out> #<player_id_in>");
        return false;
    }
    
    var playerIdOut = parseInt(args[1].substring(1)); // Remove the '#' and parse the ID
    var playerIdIn = parseInt(args[2].substring(1));  // Remove the '#' and parse the ID
    
    var playerOut = findPlayerById(playerIdOut);
    var playerIn = findPlayerById(playerIdIn);
    
    if (!playerOut || !playerIn) {
        room.sendChat("Invalid player IDs.");
        return false;
    }
    
    if (playerOut.team === 0 || playerIn.team !== 0) {
        room.sendChat("Ensure player out is on a team and player in is a spectator.");
        return false;
    }
    room.pauseGame(true);
    setTimeout(() => {
      // Substitute the players
      var teamOut = playerOut.team;
      room.setPlayerTeam(playerOut.id, 0); // Move playerOut to spectators
      room.setPlayerTeam(playerIn.id, teamOut); // Move playerIn to the team of playerOut

      var teamName = teamOut === 1 ? "🟥 Red" : "🟦 Blue";
      room.sendAnnouncement(`${teamName} team subs (Player out: ${playerOut.name}) (Player in: ${playerIn.name}) by captain ${player.name}`, null, 0xffffe0, "normal", 1);
      
      setTimeout(() => {
        room.pauseGame(false);
      }, 100);
    }, 300);
    
    
    return false; // Prevent the message from being broadcasted to all players
  }

  for (let i = 0; i < bannedWords.length; i++) {
    if (message.toLowerCase().includes(bannedWords[i])) {
      if (!player.admin) {
        whisper("⚠️ ʙᴀᴅᴡᴏʀᴅ ᴅᴇᴛᴇᴄᴛᴇᴅ !!", player.id);
        sendWebhook(toxicWebHook, `\`[${player.name}] received warn ( Bad Word Detected ) \``);
        return false;
      }
    }
  }

  // SOCCER TEAMS //

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
 else if (["!adm"].includes(message[0].toLowerCase())) {
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
  } else if (["!setteamava"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let teamId = parseInt(args[1]);
      let avatarUrl = args[2];

      if ((teamId === 1 || teamId === 2) && avatarUrl) {
          let team = teamId === 1 ? 1 : 2; // 1 for red team, 2 for blue team
          let players = room.getPlayerList();

          players.forEach(p => {
              if (p.team === team) {
                  room.setPlayerAvatar(p.id, avatarUrl);
              }
          });

          //room.sendAnnouncement("Team " + (teamId === 1 ? "Red" : "Blue") + " avatars set by " + player.name, null, 0x00FF00, "normal", 2);
      } else {
          room.sendAnnouncement("Invalid team ID or avatar URL.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can set team avatars", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!setavatar"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let playerId = parseInt(args[1]);
      let avatarUrl = args[2]; // Assuming the avatar URL is provided as the third argument

      let targetPlayer = room.getPlayer(playerId);

      if (targetPlayer !== null) {
          room.setPlayerAvatar(playerId, avatarUrl);
          // room.sendAnnouncement("Player ID " + playerId + "'s avatar set by " + player.name);
      } else {
          room.sendAnnouncement("Invalid player ID.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can set player avatars", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!resetteamava"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let teamId = parseInt(args[1]);

      if (teamId === 1 || teamId === 2) {
          let team = teamId === 1 ? 1 : 2; // 1 for red team, 2 for blue team
          let players = room.getPlayerList();

          players.forEach(p => {
              if (p.team === team) {
                  room.setPlayerAvatar(p.id, null); // Resetting the avatar to default (null)
              }
          });

          //room.sendAnnouncement("Team " + (teamId === 1 ? "Red" : "Blue") + " avatars reset by " + player.name, null, 0x00FF00, "normal", 2);
      } else {
          room.sendAnnouncement("Invalid team ID.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can reset team avatars", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!resetavatar"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let playerId = parseInt(args[1]);

      let targetPlayer = room.getPlayer(playerId);

      if (targetPlayer !== null) {
          room.setPlayerAvatar(playerId, null); // Setting avatar to null (default avatar)
          // room.sendAnnouncement("Player ID " + playerId + "'s avatar reset by " + player.name);
      } else {
          room.sendAnnouncement("Invalid player ID.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can reset player avatars", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!blink"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let playerId = parseInt(args[1]);
      let intervalId;
      let targetPlayer = room.getPlayer(playerId);

      if (targetPlayer !== null) {
          let currentRadius = 15; // Assuming current radius is 15, you should adjust this according to your actual scenario
          let newRadius = 0;
          let direction = 2;

          intervalId = setInterval(() => {
              room.setPlayerDiscProperties(playerId, { radius: newRadius });
              newRadius += direction * 5;

              if (newRadius >= currentRadius || newRadius <= 0) {
                  direction *= -1; // Reverse the direction
              }
          }, 200); // Adjust the interval time as needed

          // Stop blinking after 10 seconds (just an example)
          setTimeout(() => {
              clearInterval(intervalId);
              room.setPlayerDiscProperties(playerId, { radius: currentRadius });
          }, 12000); // 10000 milliseconds = 10 seconds
      } else {
          room.sendAnnouncement("Invalid player ID.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can make players blink", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!blinkteam"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let teamId = parseInt(args[1]); // 1 for red team, 2 for blue team
      let intervalId;
      let playersInTeam = room.getPlayerList().filter(p => p.team === teamId);

      if (playersInTeam.length > 0) {
          let currentRadius = 15; // Assuming current radius is 15, adjust as necessary
          let newRadius = 0;
          let direction = 2;

          intervalId = setInterval(() => {
              playersInTeam.forEach(p => {
                  room.setPlayerDiscProperties(p.id, { radius: newRadius });
              });
              newRadius += direction * 5;

              if (newRadius >= currentRadius || newRadius <= 0) {
                  direction *= -1; // Reverse the direction
              }
          }, 200); // Adjust the interval time as needed

          // Stop blinking after 10 seconds (just an example)
          setTimeout(() => {
              clearInterval(intervalId);
              playersInTeam.forEach(p => {
                  room.setPlayerDiscProperties(p.id, { radius: currentRadius });
              });
          }, 12000); // 10000 milliseconds = 10 seconds
      } else {
          room.sendAnnouncement("Invalid team ID or no players in the specified team.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can make teams blink", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!blink2"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let playerId = parseInt(args[1]);
      let intervalId;
      let targetPlayer = room.getPlayer(playerId);

      if (targetPlayer !== null) {
          let currentRadius = 15; // Assuming current radius is 15, you should adjust this according to your actual scenario
          let newRadius = 0;
          let direction = 3;

          intervalId = setInterval(() => {
              room.setPlayerDiscProperties(playerId, { radius: newRadius });
              newRadius += direction * 5;

              if (newRadius >= currentRadius || newRadius <= 0) {
                  direction *= -1; // Reverse the direction
              }
          }, 200); // Adjust the interval time as needed

          // Stop blinking after 10 seconds (just an example)
          setTimeout(() => {
              clearInterval(intervalId);
              room.setPlayerDiscProperties(playerId, { radius: currentRadius });
          }, 12000); // 10000 milliseconds = 10 seconds
      } else {
          room.sendAnnouncement("Invalid player ID.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can make players blink", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!setsize"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let playerId = parseInt(args[1]);
      let newRadius = parseFloat(args[2]);
      let targetPlayer = room.getPlayer(playerId);

      if (targetPlayer !== null && !isNaN(newRadius)) {
          room.setPlayerDiscProperties(playerId, { radius: newRadius });
          // room.sendAnnouncement("Player ID " + playerId + " disc size set to " + newRadius + " by " + player.name);
      } else {
          room.sendAnnouncement("Invalid player ID or radius.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can change player disc properties", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!setteamsize"].includes(message[0].toLowerCase())) {
    if (player.admin) {
      let teamId = parseInt(args[1]);
      let newRadius = parseFloat(args[2]);

      if ((teamId === 1 || teamId === 2) && !isNaN(newRadius)) {
          let players = room.getPlayerList();

          players.forEach(p => {
              if (p.team === teamId) {
                  room.setPlayerDiscProperties(p.id, { radius: newRadius });
              }
          });

          room.sendAnnouncement("Team " + (teamId === 1 ? "Red" : "Blue") + " disc sizes set to " + newRadius + " by " + player.name, null, 0x00FF00, "normal", 2);
      } else {
          room.sendAnnouncement("Invalid team ID or radius.", player.id, 0xff0000, "normal", 2);
      }
    } else {
        room.sendAnnouncement("Only Super Admins can change team disc sizes", player.id, 0xff0000, "normal", 2);
    }
  } else if (["!start", "!fixstart"].includes(message[0].toLowerCase())) {
    if (room.getScores() == null) {
      room.startGame();
    } else {
      whisper("Cannot start while game in progress", player.id);
    }
  } else if (["!map"].includes(message[0].toLowerCase())) {
    room.sendAnnouncement("List Map RSI : Real Soccer [!rsmap], Futsal [!futsalmap], 1v1 [!winkymap]", player.id, 0xffffff, "normal");
      if (player.admin) {
        room.setTeamColors(2, 48, 0xFFFFFF, [0xD1AD4D, 0x000000, 0x0F0F0F]);
      } 
  } else if (["!powershot", "!ps"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        if (powerShotMode == false) {
          powerShotMode = true;
          announce("" + player.name + " ʜᴀꜱ ᴇɴᴀʙʟᴇ ᴛʜᴇ ᴘᴏᴡᴇʀꜱʜᴏᴛ", null, 0x00ff00);
        } else {
          powerShotMode = false;
          announce("" + player.name + " ʜᴀꜱ ᴅɪꜱᴀʙʟᴇ ᴛʜᴇ ᴘᴏᴡᴇʀꜱʜᴏᴛ", null, 0xff0000);
        }
      } else {
        whisper("⚠️ ʏᴏᴜ ᴅᴏɴ'ᴛ ʜᴀᴠᴇ ᴘᴇʀᴍɪꜱꜱɪᴏɴ", player.id);
      }
  } else if (["!rsmap"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        penKick = false;
        console.log(`penKick = false`);
        room.stopGame();
        loadMap(practiceMap);
        room.setTimeLimit(7);
        // room.startGame();
      } 
    } else if (["!premap"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        room.stopGame();
        loadMap(preMap);
        room.setTimeLimit(0);
        // room.startGame();
      } 
  } else if (["!penmap"].includes(message[0].toLowerCase())) {
    if (player.admin) {
        penKick = true;
        console.log(`penKick = true`);
        room.stopGame();
        loadMap(penMap);
        // room.startGame();
      } else {
        if (room.getScores() == null) {
          loadMap(penMap);
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
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
    return false;
  }

  if (link.includes(message[1])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
    return false;
  }

  if (link.includes(message[2])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
    return false;
  }

  if (link.includes(message[3])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
    return false;
  }

  if (link.includes(message[4])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
    return false;
  }

  if (link.includes(message[5])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
    return false;
  }

  if (link.includes(message[6])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
    return false;
  }

  if (link.includes(message[7])) {
    room.sendAnnouncement("ʏᴏᴜ ᴄᴀɴɴᴏᴛ ꜱᴇɴᴅ ʟɪɴᴋꜱ ʜᴇʀᴇ, " + player.name, player.id, Cor.Warn, "italic", 2);
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
  game.rsTouchTeam = player.team;
  game.updateLastKicker(player.id, player.name, player.team);
  let ball = room.getBallPosition();

if(isShot(player)){
    registerShot(player);
}
  if (lastPlayersTouched[0] == null || player.id != lastPlayersTouched[0].id) {
    !activePlay ? (activePlay = true) : null;
    lastTeamTouched = player.team;
    lastPlayersTouched[1] = lastPlayersTouched[0];
    lastPlayersTouched[0] = player;
  }

  // === DRIBBLE CURVE SHOT ===
	const playerCurveOn = playerCurveToggle.get(player.id) !== false;

// curve hanya untuk open play + corner/gk
const allowCurve =
	!(
		game.outStatus == "redThrow" ||
		game.outStatus == "blueThrow"
	);

if (
	dribbleCurveEnabled &&
	playerCurveOn &&
	allowCurve &&
	dribbleState.playerId === player.id &&
	dribbleState.ready
) {
	let holdTime = Date.now() - dribbleState.startTime;
	let ratio = Math.min((holdTime - DRIBBLE_THRESHOLD) / POWER_THRESHOLD, 1);

	let ball = room.getBallPosition();
	let p = room.getPlayerDiscProperties(player.id);
	let bs = room.getDiscProperties(0);

	let vx = bs.xspeed;
	let vy = bs.yspeed;
	let mag = Math.sqrt(vx * vx + vy * vy) || 1;

	let curveDir = {
		x: (vy / mag),
		y: (-vx / mag)
	};

	let side = Math.sign((ball.x - p.x) * vy - (ball.y - p.y) * vx);
	if (side === 0) side = 1;

	curveDir.x *= side;
	curveDir.y *= side;

	let curveStrength = DRIBBLE_CURVE_MAX * ratio;

curveState.active = true;
curveState.startTime = Date.now();
curveState.ownerId = player.id;

curveState.dir = {
	x: curveDir.x * curveStrength,
	y: curveDir.y * curveStrength
};

	resetDribbleSlider();
}

  if (game.rsReady == true) {
    var players = room.getPlayerList().filter((player) => player.team != 0);
    players.forEach(function (player) {
      if (room.getPlayerDiscProperties(player.id).invMass.toFixed(1) != 0.3) {
        room.setPlayerDiscProperties(player.id, { invMass: 0.3 });
      }
    });
  }

  // ===============================
// APPLY DEADBALL INVMASS
// ===============================


const isDeadBallKick =
	game.rsCorner ||
	game.rsGoalKick ||
	game.outStatus == "redThrow" ||
	game.outStatus == "blueThrow";

   if (isDeadBallKick) {
    resetDribbleSlider();
  }
  
const powerProgress = (
    isDeadBallKick &&
    deadBallPowerState.active &&
    deadBallPowerState.playerId === player.id
) ? deadBallPowerState.progress : 0;

if (
    isDeadBallKick &&
    deadBallPowerState.active &&
    deadBallPowerState.playerId === player.id &&
    (game.outStatus == "redThrow" || game.outStatus == "blueThrow")  // ← hanya throwin
) {
    room.setDiscProperties(0, { invMass: deadBallPowerState.invMass });
}

if (isDeadBallKick) {
    setTimeout(() => {
        const disc = room.getDiscProperties(0);
        if (disc && disc.invMass !== 0.8) {
            room.setDiscProperties(0, { invMass: 0.8 });
        }
    }, 1000);
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
    

      // CORNER
    if (game.rsCorner == true) {
      room.setDiscProperties(0, { xgravity: (room.getPlayerDiscProperties(player.id).xspeed / 16) * -1, ygravity: (room.getPlayerDiscProperties(player.id).yspeed / 16) * -1 });  //default 16
    }
    if (game.rsGoalKick == true) {
      room.setDiscProperties(0, { xgravity: 0, ygravity: (room.getPlayerDiscProperties(player.id).yspeed / 20) * -1 });
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
  resetMatchStats();
  countAFK = true;
  activePlay = false;
  goldenGoal = false;
  endGameVariable = false;
  lastPlayersTouched = [null, null];
  Rposs = 0;
  Bposs = 0;
  GKList = [];
  allReds = [];
  allBlues = [];
  globalChatEnabled = false;
  	lockDribblePlayers();

  //whisper("Global chat disabled", null);

  room.sendAnnouncement(centerText("🥅 KICK OFF 🥅"), null, Cor.White, "bold");
  room.sendAnnouncement(centerText("Game Duration: " + gameTime + " minutes / Half"), null, 0x2ef55d, "bold");
  // room.sendAnnouncement(centerText("RSI League S4"), null, 0x5ee7ff);
  room.startRecording();

  // dribble curve
	setTimeout(() => {
		room.getPlayerList().forEach(p => {
			if (p.team === 0) return;

			const curveOn = playerCurveToggle.get(p.id) !== false;

			if (curveOn) {
				room.sendAnnouncement(
					"🍌 Banana kick is ENABLED. Type !curveoff to disable it.",
					p.id,
					0x5cff8d,
					"small"
				);
			} else {
				room.sendAnnouncement(
					"🍌 Banana kick is DISABLED. Type !curveon to enable it.",
					p.id,
					0xff4d4d,
					"small"
				);
			}
		});
	}, 2000); 
    
  if(freeze.length > 0){
    freeze = [];
  }
};

room.onGameStop = function (byPlayer) {
  isTurneyStarted = false;
  console.log(`isTurneyStarted = false`);
  announcement30sSent = false; 
  announcement20sSent = false; 
  announcement10sSent = false;
  let redGK = getGoalkeeper(Team.RED);
let blueGK = getGoalkeeper(Team.BLUE);
  sendDiscordRecording();
  if(freeze.length > 0){
    freeze = [];
  }
  redPauseCount = 0;
  bluePauseCount = 0;
  globalChatEnabled = true;
  dribblePlayers.clear();
	dribbleLock = false;
  //whisper("Global chat enabled", null);
};

room.onGameUnpause = function (byPlayer) {
  // if ((TeamR.length == 4 && TeamB.length == 4 && inChooseMode) || (TeamR.length == TeamB.length && teamS.length < 2 && inChooseMode)) {
  //   deactivateChooseMode();
  // }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Function to get a new random choice that is not the same as the previous one
function getNewChoice(previous, min, max) {
  let newChoice;
  do {
    newChoice = getRandomInt(min, max);
  } while (newChoice === previous);
  return newChoice;
}

let previousChoice = -1;

room.onTeamGoal = function (team) {
  let goalTime = secondsToMinutes(Math.floor(room.getScores().time));
  shotPendingSave = null;
lastShot = null;

  game.rsActive = false;

  game.outStatus = "";
  game.rsActive = true;
  game.rsReady = false;
  game.rsTimer = 0;

  teamgoaler = team;
  activePlay = false;
  countAFK = false;

  const scores = room.getScores();
  game.scores = scores;

  const scorer = lastPlayersTouched[0];
  const assister = lastPlayersTouched[1];

  const isNormalGoal =
    scorer &&
    scorer.team === team;

  if (isNormalGoal) {

    // ==========================
    // GOAL + ASSIST STATS
    // ==========================

    matchStats.goals[scorer.name] =
      (matchStats.goals[scorer.name] || 0) + 1;

    if (
      assister &&
      assister.team === team &&
      assister.id !== scorer.id
    ) {
      matchStats.assists[assister.name] =
        (matchStats.assists[assister.name] || 0) + 1;
    }

    // ==========================
    // ANNOUNCEMENT
    // ==========================

    if (
      assister &&
      assister.team === team &&
      assister.id !== scorer.id
    ) {

      [
        "──────────────────────────────────────────────────────",
        `${goalTime} | ⚽ ɢᴏᴀʟ sᴄᴏʀᴇᴅ ʙʏ ${scorer.name} | ᴀssɪsᴛ ʙʏ - ${assister.name} | 🟥 ${scores.red} - ${scores.blue} 🟦`,
        "──────────────────────────────────────────────────────"
      ].forEach(line => {
        room.sendAnnouncement(line, null, 0x11DEB3, "small");
      });

      avatarCelebration(scorer.id, "⚽", "🎯");
      avatarCelebration(assister.id, "🤝", "👟");

      sendWebhook(
        goalWebHook,
        `[GOAL] ** Scorer: ** ${scorer.name} ** Assist: ** ${assister.name} ** Menit: ** ${goalTime} ** Scores ** 🟥 ${scores.red} - ${scores.blue} 🟦`
      );

      game.goals.push(
        new Goal(scores.time, team, scorer, assister)
      );

    } else {

      [
        "──────────────────────────────────────────────────────",
        `${goalTime} | ⚽ ɢᴏᴀʟ sᴄᴏʀᴇᴅ ʙʏ ${scorer.name} | 🟥 ${scores.red} - ${scores.blue} 🟦`,
        "──────────────────────────────────────────────────────"
      ].forEach(line => {
        room.sendAnnouncement(line, null, 0x11DEB3, "small");
      });

      avatarCelebration(scorer.id, "⚽", "🎯");

      sendWebhook(
        goalWebHook,
        `[GOAL] ** Scorer: ** ${scorer.name} ** Menit: ** ${goalTime} ** Scores ** 🟥 ${scores.red} - ${scores.blue} 🟦`
      );

      game.goals.push(
        new Goal(scores.time, team, scorer, null)
      );
    }

  } else {

    // ==========================
    // OWN GOAL
    // ==========================

    [
      "──────────────────────────────────────────────────────",
      `${goalTime} | ☠️ ᴏᴡɴ ɢᴏᴀʟ sᴄᴏʀᴇᴅ ʙʏ ${scorer ? scorer.name : "Unknown"} | 🟥 ${scores.red} - ${scores.blue} 🟦`,
      "──────────────────────────────────────────────────────"
    ].forEach(line => {
      room.sendAnnouncement(line, null, 0xFB6B6B, "small");
    });

    sendWebhook(
      goalWebHook,
      `[OWN-GOAL] ** Scorer: ** ${scorer ? scorer.name : "Unknown"} ** Menit: ** ${goalTime} ** Scores ** 🟥 ${scores.red} - ${scores.blue} 🟦`
    );

    game.goals.push(
      new Goal(scores.time, team, null, null)
    );

    if (scorer) {
      avatarCelebration(scorer.id, "🤦‍♂️", "🤡");
    }
  }

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

  if (
    scores.scoreLimit != 0 &&
    (
      scores.red == scores.scoreLimit ||
      (scores.blue == scores.scoreLimit && scores.blue > 0) ||
      goldenGoal
    )
  ) {
    endGame(team);
    goldenGoal = false;

    setTimeout(() => {
      room.stopGame();
    }, 1000);
  }
};

async function avatarCelebration(playerId, avatar1, avatar2) {
  const intervals = [200, 400, 600, 800, 1000, 1200, 1400, 1600];

  for (let i = 0; i < intervals.length; i++) {
    await sleep(intervals[i]);
    if (i % 2 === 0) {
      room.setPlayerAvatar(playerId, avatar1);
    } else {
      room.setPlayerAvatar(playerId, avatar2);
    }
  }
  room.setPlayerAvatar(playerId, null);
}

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

room.onStadiumChange = function (newStadiumName, byPlayer) {};

room.onGameTick = function () {
  const now = Date.now();
  let progress = 0;

  updateGameStatus();
  if (!penKick) {
    handleBallTouch(now);
    realSoccerRef();
  }

  getLastTouchOfTheBall();
  getStats();
  handleInactivity();
  handleFrozenPlayerMoves();

  // === DRIBBLE SLIDER ===
  const playerId = dribbleState.playerId;
  const playerCurveOn = playerCurveToggle.get(playerId) !== false;

  const isDeadBall =
    game.rsCorner ||
    game.rsGoalKick ||
    game.outStatus == "redThrow" ||
    game.outStatus == "blueThrow";

  if (
    (
      (dribbleCurveEnabled && playerCurveOn) ||
      isDeadBall
    ) &&
    dribbleState.active &&
    (
      dribbleState.ready ||
      isDeadBall
    )
  ) {

    const player = room.getPlayer(playerId);

    if (!player || !player.position) {
      resetDribbleSlider();
      return;
    }

    const pDisc = room.getPlayerDiscProperties(playerId);
    const elapsed = Date.now() - dribbleState.startTime;

    // DEAD BALL: progress langsung jalan tanpa hold
    if (isDeadBall) {
      progress = Math.max(0, Math.min(elapsed / POWER_THRESHOLD, 1));
    }
    // OPEN PLAY: tetap perlu hold
    else {
      progress = Math.max(0, Math.min((elapsed - DRIBBLE_THRESHOLD) / POWER_THRESHOLD, 1));
    }

    // ===============================
    // DEADBALL INVMASS UPDATE
    // ===============================
    if (isDeadBall) {
      const currentInvMass = getDeadBallInvMass(progress);

      deadBallPowerState.active = true;
      deadBallPowerState.playerId = playerId;
      deadBallPowerState.invMass = currentInvMass;
      deadBallPowerState.progress = progress;

      const disc = room.getDiscProperties(0);

      if (!disc.invMass || Math.abs(disc.invMass - currentInvMass) > 0.001) {
        room.setDiscProperties(0, { invMass: currentInvMass });
      }
    }
    else {
      deadBallPowerState.active = false;

      const disc = room.getDiscProperties(0);

      if (disc.invMass !== 0.8) {
        room.setDiscProperties(0, { invMass: 0.8 });
      }
    }

    // ===============================
    // HITUNG TARGET POSISI SLIDER
    // ===============================
    let targetBaseX;
    let targetBaseY;

    // DEAD BALL: slider statis di atas bola
    if (isDeadBall) {
      const ballPos = room.getBallPosition();
      targetBaseX = ballPos.x;
      targetBaseY = ballPos.y < 0 ? ballPos.y + 28 : ballPos.y - 28;
    }
    // OPEN PLAY: slider mengikuti player
    else {
      const predictX = player.position.x + (pDisc.xspeed * 3);
      const predictY = player.position.y + (pDisc.yspeed * 3);
      targetBaseX = predictX;
      targetBaseY = predictY - 28;
    }

    const BAR_WIDTH = 50;

    const targetStart = {
      x: targetBaseX - (BAR_WIDTH / 2),
      y: targetBaseY
    };

    const targetPower = {
      x: targetBaseX + (BAR_WIDTH / 2),
      y: targetBaseY
    };

    const targetEnd = {
      x: targetStart.x + (BAR_WIDTH * progress),
      y: targetBaseY
    };

    // ===============================
    // SMOOTH LERP POSISI SLIDER
    // ===============================
    const SLIDER_LERP = 0.15;

    // Inisialisasi langsung ke target jika baru mulai
    if (!sliderInitialized) {
      sliderCurrentPos.start.x = targetStart.x;
      sliderCurrentPos.start.y = targetStart.y;
      sliderCurrentPos.power.x = targetPower.x;
      sliderCurrentPos.power.y = targetPower.y;
      sliderCurrentPos.end.x   = targetEnd.x;
      sliderCurrentPos.end.y   = targetEnd.y;
      sliderInitialized = true;
    }

    // Lerp posisi saat ini menuju target
    sliderCurrentPos.start.x = lerp(sliderCurrentPos.start.x, targetStart.x, SLIDER_LERP);
    sliderCurrentPos.start.y = lerp(sliderCurrentPos.start.y, targetStart.y, SLIDER_LERP);
    sliderCurrentPos.power.x = lerp(sliderCurrentPos.power.x, targetPower.x, SLIDER_LERP);
    sliderCurrentPos.power.y = lerp(sliderCurrentPos.power.y, targetPower.y, SLIDER_LERP);
    sliderCurrentPos.end.x   = lerp(sliderCurrentPos.end.x,   targetEnd.x,   SLIDER_LERP);
    sliderCurrentPos.end.y   = lerp(sliderCurrentPos.end.y,   targetEnd.y,   SLIDER_LERP);

    const sliderXSpeed = isDeadBall ? 0 : pDisc.xspeed;
    const sliderYSpeed = isDeadBall ? 0 : pDisc.yspeed;

    room.setDiscProperties(DRIBBLE_SLIDER_START, {
      x: sliderCurrentPos.start.x,
      y: sliderCurrentPos.start.y,
      xspeed: sliderXSpeed,
      yspeed: sliderYSpeed
    });

    room.setDiscProperties(DRIBBLE_SLIDER_POWER, {
      x: sliderCurrentPos.power.x,
      y: sliderCurrentPos.power.y,
      xspeed: sliderXSpeed,
      yspeed: sliderYSpeed
    });

    room.setDiscProperties(DRIBBLE_SLIDER_END, {
      x: sliderCurrentPos.end.x,
      y: sliderCurrentPos.end.y,
      xspeed: sliderXSpeed,
      yspeed: sliderYSpeed
    });
  }

  // ===============================
  // REALTIME BALL INVMASS DEBUG
  // ===============================
  if (!globalThis.lastInvMassDebugTime) {
    globalThis.lastInvMassDebugTime = 0;
  }

  if (now - globalThis.lastInvMassDebugTime >= 100) {
    globalThis.lastInvMassDebugTime = now;
    const ballDisc = room.getDiscProperties(0);
  }

  // ================= CURVE SYSTEM =================
  if (curveState.active) {
    let now = Date.now();
    let elapsed = now - curveState.startTime;

    if (elapsed > 1500) {
      curveState.active = false;
      room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
      return;
    }

    // throttle 1x tiap 30ms
    if (now - curveState.lastUpdate > 30) {
      curveState.lastUpdate = now;
      room.setDiscProperties(0, {
        xgravity: curveState.dir.x,
        ygravity: curveState.dir.y
      });
    }
    return;
  }

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
  room.sendAnnouncement(centerText("🏆 FULL TIME 🏆"), null, Cor.White, "bold");
  room.sendAnnouncement(centerText(" " + scores.red + " - " + scores.blue), null, Cor.White, "normal");
  room.sendAnnouncement(centerText((Rposs * 100).toPrecision(3).toString() + "% | Ball possession | " + (Bposs * 100).toPrecision(3).toString() + "% "), null, Cor.White, "normal");
  //sendWebhook(goalWebHook, `\`[SECOND-HALF]\`** Scores ** \`🟥 ${scores.red} - ${scores.blue} 🟦\``);
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
  room.sendAnnouncement(centerText("🏆 HALF TIME (1 MIN) 🏆"), null, Cor.White, "bold");
  room.sendAnnouncement(centerText(" " + scores.red + " - " + scores.blue), null, Cor.White, "normal");
  room.sendAnnouncement(centerText((Rposs * 100).toPrecision(3).toString() + "% | Ball Possession | " + (Bposs * 100).toPrecision(3).toString() + "% "), null, Cor.White, "normal");
  //sendWebhook(goalWebHook, `\`[FIRST-HALF]\`** Scores ** \`🟥 ${scores.red} - ${scores.blue} 🟦\``);
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
        // sendWebhook(goalWebHook, `\`𝙆𝙄𝘾𝙆 𝙊𝙁𝙁 - SECOND HALF\` - \`${gameTime} minutes\``);
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
  trackGoalkeepers();
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
      resetCurve();
      if (game.lastPlayAnnounced == true) {
        room.stopGame(true);
        game.lastPlayAnnounced = false;
        announce("⚽ FULL TIME ⚽");
        announce("⚽ FULL TIME ⚽");
        room.setTimeLimit(gameTime);
        // sendDiscordRecording();
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

      if (game.rsTouchTeam == 1) {
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
      resetCurve();
      if (game.lastPlayAnnounced == true) {
        room.stopGame(true);
        game.lastPlayAnnounced = false;
        announce("⚽ FULL TIME ⚽");
        announce("⚽ FULL TIME ⚽");
        room.setTimeLimit(gameTime);
        // sendDiscordRecording();
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
          room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: 1060, y: 0, color: "0x0fbcf9",  xgravity: 0, ygravity: 0 });
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
            room.setDiscProperties(0, { x: 1140, y: -590, xspeed: 0, yspeed: 0, color: "0xff3f34",  xgravity: 0, ygravity: 0 });
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
            room.setDiscProperties(0, { x: 1140, y: 590, xspeed: 0, yspeed: 0, color: "0xff3f34",  xgravity: 0, ygravity: 0 });
            room.setDiscProperties(2, { x: 1150, y: 670, radius: 420 });
            room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          });
        }
      }
    }
    if (room.getBallPosition().x < -1161.45 && (room.getBallPosition().y > 124 || room.getBallPosition().y < -124)) {
      game.rsActive = false;
      resetCurve();
      if (game.lastPlayAnnounced == true) {
        room.stopGame(true);
        game.lastPlayAnnounced = false;
        announce("⚽ FULL TIME ⚽");
        announce("⚽ FULL TIME ⚽");
        room.setTimeLimit(gameTime);
        // sendDiscordRecording();
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
            room.setDiscProperties(0, { x: -1140, y: -590, xspeed: 0, yspeed: 0, color: "0x0fbcf9",  xgravity: 0, ygravity: 0 });
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
            room.setDiscProperties(0, { x: -1140, y: 585, xspeed: 0, yspeed: 0, color: "0x0fbcf9",  xgravity: 0, ygravity: 0 });
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
          room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: -1060, y: 0, color: "0xff3f34",  xgravity: 0, ygravity: 0 });
        });
        sleep(3000).then(() => {
          room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        });
      }
    }
  }
}

function handleBallTouch(now) {
  var players = room.getPlayerList();
  var ballPosition = room.getBallPosition();
  var ballRadius = game.ballRadius;
  var playerRadius = 15;
  var triggerDistance = ballRadius + playerRadius + 0.01;


 const isDeadBall =
	game.rsCorner ||
	game.rsGoalKick ||
	game.outStatus == "redThrow" ||
	game.outStatus == "blueThrow";

  // hanya matikan tracking open play
  if (!dribbleCurveEnabled && !isDeadBall) return;

	const ball = room.getBallPosition();
	const ballProps = room.getDiscProperties(0);

	const triggerDist = ballProps.radius + 15 + 0.5;
	const triggerSq = triggerDist * triggerDist;
	const releaseSq = (triggerDist + 5) * (triggerDist + 5);

	let touched = false;

	// ===============================
	// 1. PRIORITAS: CEK PLAYER TERAKHIR
	// ===============================
	if (dribbleState.playerId !== null) {
		const p = room.getPlayer(dribbleState.playerId);

		if (p && p.position && p.team !== 0) {
			const dx = p.position.x - ball.x;
			const dy = p.position.y - ball.y;
			const distSq = dx * dx + dy * dy;

			if (distSq < triggerSq) {
				touched = true;

				// update ready state
				if (!dribbleState.ready && (now - dribbleState.startTime > DRIBBLE_THRESHOLD)) {
					dribbleState.ready = true;
				}

				return; // ⛔ STOP TOTAL → tidak perlu loop player lain
			}
		}
	}

	// ===============================
	// 2. LOOP PLAYER (TANPA SPECTATOR)
	// ===============================

		for (let id of dribblePlayers) {
		const player = room.getPlayer(id);
		if (!player || player.team === 0) continue;

		const pos = player.position;
		if (!pos) continue;

		const dx = pos.x - ball.x;
		const dy = pos.y - ball.y;
		const distSq = dx * dx + dy * dy;

		// ===== TOUCH =====
		// ===== TOUCH =====
if (distSq < triggerSq) {
	touched = true;

	// player baru menyentuh bola
	if (dribbleState.playerId !== player.id) {
		dribbleState.playerId = player.id;
		dribbleState.startTime = now;
		dribbleState.active = true;

		sliderState.active = true;
		sliderState.init = false;

		// DEAD BALL:
		// slider langsung muncul tanpa hold
		// tapi curve tetap OFF
		if (isDeadBall) {
			dribbleState.ready = false;
		}
		// OPEN PLAY:
		// tetap perlu hold
		else {
			dribbleState.ready = false;
		}
	}
	else {
		// hanya OPEN PLAY yang bisa ready curve
		if (
			!isDeadBall &&
			!dribbleState.ready &&
			(now - dribbleState.startTime > DRIBBLE_THRESHOLD)
		) {
			dribbleState.ready = true;
		}
	}

	break;
}
	}

	// ===============================
	// 3. LEPAS BOLA
	// ===============================
	if (!touched && dribbleState.playerId !== null) {
		const p = room.getPlayer(dribbleState.playerId);

		if (p && p.position) {
			const dx = p.position.x - ball.x;
			const dy = p.position.y - ball.y;
			const distSq = dx * dx + dy * dy;

			if (distSq > releaseSq) {
				resetDribbleSlider();
			}
		} else {
			resetDribbleSlider();
		}
	}

  for (var i = 0; i < players.length; i++) {
    // Iterate over all the players
    var player = players[i];
    if (player.position == null) continue;
    var distanceToBall = pointDistance(player.position, ballPosition);
    if (distanceToBall < triggerDistance) {

      if(shotPendingSave){

    let gk =
        getGoalkeeper(player.team);

    if(
        gk &&
        player.id == gk.id &&
        player.team != shotPendingSave.shooterTeam
    ){

        matchStats.savesByPlayer[player.name] =
            (matchStats.savesByPlayer[player.name] || 0) + 1;

        if(player.team == Team.RED){
            matchStats.red.saves++;
        }

        if(player.team == Team.BLUE){
            matchStats.blue.saves++;
        }

        shotPendingSave = null;
    }
}

	if (
		curveState.active &&
		curveState.ownerId !== null &&
		player.id !== curveState.ownerId
	) {
		resetCurve();
	}

	game.rsTouchTeam = player.team;
	game.throwinKicked = false;

	if (
		game.rsCorner == false &&
		room.getDiscProperties(0).xgravity != 0
	) {
		room.setDiscProperties(0, {
			xgravity: 0,
			ygravity: 0
		});

		game.rsSwingTimer = 10000;
	}
}
  }
}

function resetDribbleSlider() {
    dribbleState.active = false;
    dribbleState.startTime = 0;
    dribbleState.playerId = null;
    dribbleState.ready = false;

    deadBallPowerState.active = false;
    deadBallPowerState.playerId = null;
    deadBallPowerState.invMass = 0.8;

    sliderState.active = false;
    sliderState.init = false;
    sliderInitialized = false;

    for (let i = 62; i <= 64; i++) {
        room.setDiscProperties(i, { x: 0, y: 0 });
    }
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

function isAdminPresent() {
  var players = room.getPlayerList();
  if (players.find((player) => player.admin) != null) {
    return true;
  } else {
    return false;
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
  const disc = room.getDiscProperties(line);

  if (!disc) return; // abaikan jika disc tidak ada

  if (disc.x !== redLineX && disc.x !== blueLineX) {
    room.setDiscProperties(line, { x: redLineX });
  }
});
  }
}

function getDate() {
  let data = new Date(Date.now() - 432000000),
    dia = data.getDate().toString().padStart(2, "0"),
    mes = (data.getMonth() + 1).toString().padStart(2, "0"),
    ano = data.getFullYear(),
    horas = data.getHours().toString().padStart(2, "0"),
    minutos = data.getMinutes().toString().padStart(2, "0");
  return `${dia}-${mes}-${ano}-${horas}h${minutos}m`;
}

function generateMatchReport(){

    const scores = game.scores || room.getScores();

    let redPlayers = room
        .getPlayerList()
        .filter(p => p.team == Team.RED)
        .map((p,i) => `${i+1}. ${p.name}`)
        .join("\n");

    let bluePlayers = room
        .getPlayerList()
        .filter(p => p.team == Team.BLUE)
        .map((p,i) => `${i+1}. ${p.name}`)
        .join("\n");

    let goals = Object.entries(matchStats.goals)
        .map(([name,count]) => `${name} (${count})`)
        .join("\n") || "-";

    let assists = Object.entries(matchStats.assists)
        .map(([name,count]) => `${name} (${count})`)
        .join("\n") || "-";

    let redGK = getGoalkeeper(Team.RED);
    let blueGK = getGoalkeeper(Team.BLUE);

    let cleanSheet = [];

    if(scores.blue == 0 && redGK)
        cleanSheet.push(redGK.name);

    if(scores.red == 0 && blueGK)
        cleanSheet.push(blueGK.name);

    return `
RED TEAM ${scores.red} - ${scores.blue} BLUE TEAM

RED PLAYERS
${redPlayers}

BLUE PLAYERS
${bluePlayers}

GOALS
${goals}

ASSISTS
${assists}

CLEAN SHEETS
${cleanSheet.join("\n") || "-"}

SHOTS ON TARGET
RED ${matchStats.red.shotsOnTarget} - ${matchStats.blue.shotsOnTarget} BLUE 

SHOTS OFF TARGET
RED ${matchStats.red.shotsOffTarget} - ${matchStats.blue.shotsOffTarget} BLUE 

XG
RED ${matchStats.red.xG.toFixed(2)} - ${matchStats.blue.xG.toFixed(2)} BLUE 

SAVES
RED ${matchStats.red.saves} -  ${matchStats.blue.saves} BLUE

`;
}

function sendDiscordRecording() {

  const report = generateMatchReport();

  const form = new FormData();

  form.append(
    "content",
    "```" + report + "```"
  );

  form.append(
    "file",
    new File(
      [room.stopRecording()],
      "RSILEAGUES6.hbr2",
      { type: "text/plain" }
    )
  );

  var request = new XMLHttpRequest();
  request.open("POST", replayWebHook);
  request.send(form);
}
// setInterval(function () {
//   room.sendAnnouncement("🔊 Join our Discord. https://discord.gg/pm55tVsQMX ", null, 0x5ee7ff, "small", 0);
   // setTimeout(function () {
   //   room.sendAnnouncement("⚽ RSI League Season 3", null, 0x61ddff, "normal", 0);
   // }, 50000); // Wait 40 seconds after the first announcement
// }, 220000);

// msg1 = setInterval(function () {
//   room.sendAnnouncement("🏆 Searching For The Champions", null, 0xff8a4a, "small");
// }, msg1Time);




function getPlayerById(id) {
  let player = playersElo[id];

  if (player && !player.username) {
      // Jika username belum ada, ambil dari server menggunakan auth
      fetchUsernameFromServer(player.auth, (username) => {
          player.username = username;
          console.log(`✅ Username berhasil diperbarui untuk ID ${id}: ${username}`);
      });
  }

  return player;
}


function isBannedNickname(name) {
  return bannedPatterns.some(pattern => pattern.test(name));
}

let redTeamPlayers = [];
let blueTeamPlayers = [];
