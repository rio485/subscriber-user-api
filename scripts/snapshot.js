const fs = require("fs");
const path = require("path");

const API_URL = "http://localhost:3000/usage";

// Folder tempat menyimpan snapshot
const snapshotDir = path.join(__dirname, "../snapshots");

// Buat folder snapshots jika belum ada
if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
}

async function createSnapshot() {
    try {
        // Mengambil data dari API
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        const records = result.data;

        // Jika tidak ada data
        if (records.length === 0) {
            console.log("No usage data available.");
            return;
        }

        // Header CSV
        const headers = [
            "subscriberId",
            "callMinutes",
            "smsCount",
            "dataUsageMB",
            "timestamp"
        ];

        // Membuat isi CSV
        const csvRows = records.map(record => {
            return [
                record.subscriberId,
                record.callMinutes,
                record.smsCount,
                record.dataUsageMB,
                record.timestamp
            ].join(",");
        });

        const csvContent = [
            headers.join(","),
            ...csvRows
        ].join("\n");

        // Nama file
        const now = new Date();

        const date = now.toISOString()
            .slice(0, 10);

        const time = now.toTimeString()
            .slice(0, 8)
            .replace(/:/g, "");

        const fileName =
            `usage_snapshot_${date}_${time}.csv`;

        const filePath =
            path.join(snapshotDir, fileName);

        // Simpan CSV
        fs.writeFileSync(
            filePath,
            csvContent,
            "utf8"
        );

        console.log(
            `Snapshot created: ${filePath}`
        );

    } catch (error) {
        console.error(
            "Failed to create snapshot:",
            error.message
        );
    }
}

if (require.main === module) {
    createSnapshot();
}

module.exports = {
    createSnapshot
};