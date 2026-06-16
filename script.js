const room = HBInit({
    roomName:"✴️ [ɢᴀʟᴢᴍᴏᴅꜱ] Galz Bunker",
    token: "thr1.AAAAAGoxMWjuKORzpJ--ow.JuHyP1mE-WQ",
    maxPlayers: 20,
    public: true,
    noPlayer: false,
    geo: {
        code: "id",
        lat: -6.2088,
        lon: 106.8456
    }
});

room.setDefaultStadium("Big");
room.setScoreLimit(5);
room.setTimeLimit(5);

const ADMINS = new Set();
const SUPER_ADMINS = new Set();

const MAX_ADMINS = 2;
const SUPER_PASSWORD = "GALIH";

room.onPlayerJoin = function(player) {

    console.log("========== PLAYER JOIN ==========");
    console.log("Name :", player.name);
    console.log("ID   :", player.id);
    console.log("Auth :", player.auth);
    console.log("Conn :", player.conn);
    console.log("=================================");

    room.sendAnnouncement(
        "Welcome! Use !admin to become admin.",
        player.id,
        0x00FF00,
        "normal"
    );
};

room.onPlayerLeave = function(player) {
    ADMINS.delete(player.id);
    SUPER_ADMINS.delete(player.id);
};

room.onPlayerChat = function(player, msg) {

    if (msg === "!admin") {

        if (SUPER_ADMINS.has(player.id))
            return false;

        if (ADMINS.has(player.id))
            return false;

        if (ADMINS.size >= MAX_ADMINS) {

            room.sendAnnouncement(
                "L Admin slots are full (2/2).",
                player.id,
                0xFF0000
            );

            return false;
        }

        ADMINS.add(player.id);
        room.setPlayerAdmin(player.id, true);

        room.sendAnnouncement(
            `=á ${player.name} became Admin.`,
            null,
            0x00FF00,
            "bold"
        );

        return false;
    }

    if (msg === `!supadmin ${SUPER_PASSWORD}`) {

        SUPER_ADMINS.add(player.id);
        room.setPlayerAdmin(player.id, true);

        room.sendAnnouncement(
            `=Q ${player.name} became Super Admin.`,
            null,
            0xFFD700,
            "bold"
        );

        return false;
    }
};

room.onPlayerKicked = function(
    kickedPlayer,
    reason,
    ban,
    byPlayer
) {

    if (!byPlayer) return;

    if (SUPER_ADMINS.has(byPlayer.id))
        return;

    if (ban && ADMINS.has(byPlayer.id)) {

        room.clearBans();

        room.sendAnnouncement(
            `=« ${byPlayer.name} attempted to ban a player and lost admin privileges.`,
            null,
            0xFF0000,
            "bold"
        );

        ADMINS.delete(byPlayer.id);

        room.kickPlayer(
            byPlayer.id,
            "Admins are not allowed to ban players.",
            false
        );
    }
};

console.log(" Jakarta Public Room started.");
