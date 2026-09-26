const fs = require("fs");
const path = require("path");

const snapshotDir = path.join(__dirname, "../snapshots");

const MAX_AGE_DAYS = 30;

function cleanupOldSnapshots() {

    if (!fs.existsSync(snapshotDir)) {
        console.log("Snapshot directory does not exist.");
        return;
    }

    const files = fs.readdirSync(snapshotDir);

    const now = Date.now();

    files.forEach(file => {

        if (!file.endsWith(".csv")) {
            return;
        }

        const filePath = path.join(
            snapshotDir,
            file
        );

        const stats = fs.statSync(filePath);

        const fileAge =
            now - stats.mtimeMs;

        const ageInDays =
            fileAge / (1000 * 60 * 60 * 24);

        if (ageInDays > MAX_AGE_DAYS) {

            fs.unlinkSync(filePath);

            console.log(
                `Deleted old snapshot: ${file}`
            );
        }
    });

    console.log("Cleanup completed.");
}

cleanupOldSnapshots();