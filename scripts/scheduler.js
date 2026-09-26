const cron = require("node-cron");
const { createSnapshot } = require("./snapshot");

// Snapshot setiap hari pukul 08:00 WIB
cron.schedule("0 8 * * *", () => {
    console.log("Running 08:00 WIB snapshot...");
    createSnapshot();
}, {
    timezone: "Asia/Jakarta"
});

// Snapshot setiap hari pukul 12:00 WIB
cron.schedule("0 12 * * *", () => {
    console.log("Running 12:00 WIB snapshot...");
    createSnapshot();
}, {
    timezone: "Asia/Jakarta"
});

// Snapshot setiap hari pukul 15:00 WIB
cron.schedule("0 15 * * *", () => {
    console.log("Running 15:00 WIB snapshot...");
    createSnapshot();
}, {
    timezone: "Asia/Jakarta"
});

console.log("Snapshot scheduler is running.");
console.log("Schedule: 08:00, 12:00, 15:00 WIB");