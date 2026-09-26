const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

// Temporary storage (in-memory)
const usageRecords = [];

// Home endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Subscriber Usage API is running"
    });
});

// POST /usage
// Menyimpan data penggunaan subscriber
app.post("/usage", (req, res) => {
    console.log("Data yang diterima:", req.body);
    
    const {
        subscriberId,
        callMinutes,
        smsCount,
        dataUsageMB
    } = req.body;

    // Validasi data
    if (
        !subscriberId ||
        callMinutes === undefined ||
        smsCount === undefined ||
        dataUsageMB === undefined
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Membuat record baru
    const usageRecord = {
        subscriberId,
        callMinutes,
        smsCount,
        dataUsageMB,
        timestamp: new Date().toISOString()
    };

    // Simpan ke array
    usageRecords.push(usageRecord);

    // Kirim response
    res.status(201).json({
        message: "Usage record created successfully",
        data: usageRecord
    });
});

// GET /usage
// Mengambil seluruh data penggunaan
app.get("/usage", (req, res) => {
    res.json({
        data: usageRecords
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});