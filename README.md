# Subscriber Usage API

Backend service untuk mencatat dan mengambil data penggunaan subscriber, membuat snapshot usage dalam format CSV secara otomatis, melakukan cleanup terhadap snapshot lama, serta menyediakan SQL queries untuk analisis subscriber dan usage.

## 1. Project Overview

Project ini dibuat untuk memenuhi coding assessment Junior dengan empat bagian utama:

* **Q1 — Subscriber Usage API**
* **Q2 — Usage Snapshot Automation**
* **Q3 — Subscriber & Usage SQL**
* **Q4 — Troubleshoot & Explain**

Teknologi yang digunakan:

* Node.js
* Express.js
* node-cron
* JavaScript
* SQL
* CSV
* In-memory storage

---

# 2. Requirements

Pastikan sudah ter-install:

* Node.js 18 atau lebih baru
* npm

Cek versi Node.js:

```bash
node --version
```

Cek npm:

```bash
npm --version
```

---

# 3. Project Structure

```text
subscriber-user-api/
│
├── src/
│   └── server.js
│
├── scripts/
│   ├── snapshot.js
│   ├── cleanup.js
│   └── scheduler.js
│
├── snapshots/
│
├── sql/
│   └── queries.sql
│
├── q4/
│   └── troubleshoot.js
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# 4. Installation

Clone repository:

```bash
git clone <repository-url>
```

Masuk ke project:

```bash
cd subscriber-user-api
```

Install dependencies:

```bash
npm install
```

Dependencies utama:

* Express
* node-cron

---

# 5. Q1 — Subscriber Usage API

## Start Backend

Jalankan:

```bash
npm start
```

Server akan berjalan pada:

```text
http://localhost:3000
```

Jika berhasil, response dari:

```text
GET /
```

adalah:

```json
{
    "message": "Subscriber Usage API is running"
}
```

---

## API Endpoints

### GET `/`

Menampilkan status API.

**Method:**

```text
GET
```

**URL:**

```text
http://localhost:3000/
```

**Response:**

```json
{
    "message": "Subscriber Usage API is running"
}
```

---

### POST `/usage`

Menyimpan usage record baru.

**Method:**

```text
POST
```

**URL:**

```text
http://localhost:3000/usage
```

**Request Body:**

```json
{
    "subscriberId": "SUB01",
    "callMinutes": 40,
    "smsCount": 10,
    "dataUsageMB": 1500
}
```

**Response:**

```json
{
    "message": "Usage record created successfully",
    "data": {
        "subscriberId": "SUB01",
        "callMinutes": 40,
        "smsCount": 10,
        "dataUsageMB": 1500,
        "timestamp": "2026-09-26T..."
    }
}
```

HTTP status:

```text
201 Created
```

---

### GET `/usage`

Mengambil seluruh usage record yang telah disimpan.

**Method:**

```text
GET
```

**URL:**

```text
http://localhost:3000/usage
```

**Response:**

```json
{
    "data": [
        {
            "subscriberId": "SUB01",
            "callMinutes": 40,
            "smsCount": 10,
            "dataUsageMB": 1500,
            "timestamp": "2026-09-26T..."
        }
    ]
}
```

### Storage

Untuk Q1, data disimpan menggunakan **in-memory storage** berupa JavaScript array.

Data akan hilang apabila server dihentikan atau di-restart.

---

# 6. Q2 — Usage Snapshot Automation

Snapshot mengambil data dari endpoint:

```text
GET /usage
```

Kemudian menyimpannya dalam format CSV.

## Manual Snapshot

Jalankan:

```bash
npm run snapshot
```

File akan disimpan di:

```text
snapshots/
```

## File Naming Convention

Format nama file:

```text
usage_snapshot_YYYY-MM-DD_HHMMSS.csv
```

Contoh:

```text
usage_snapshot_2026-09-26_150000.csv
```

Format tersebut digunakan agar tanggal dan waktu snapshot dapat diketahui langsung dari nama file.

---

# 7. Scheduler

Scheduler menjalankan snapshot secara otomatis pada:

```text
08:00 WIB
12:00 WIB
15:00 WIB
```

Jalankan scheduler:

```bash
npm run scheduler
```

Scheduler menggunakan timezone:

```text
Asia/Jakarta
```

Jadwal cron:

```text
08:00 WIB → 0 8 * * *
12:00 WIB → 0 12 * * *
15:00 WIB → 0 15 * * *
```

API server harus tetap berjalan ketika scheduler melakukan request ke endpoint `/usage`.

Karena itu, saat menjalankan sistem secara lokal, gunakan dua terminal.

Terminal 1:

```bash
npm start
```

Terminal 2:

```bash
npm run scheduler
```

---

# 8. Cleanup Old Snapshots

Script cleanup digunakan untuk menghapus file CSV yang berusia lebih dari 30 hari.

Jalankan:

```bash
npm run cleanup
```

Aturan:

```text
<= 30 hari → tetap disimpan
> 30 hari  → dihapus
```

Cleanup dibuat sebagai script terpisah sesuai requirement assessment.

---

# 9. Q3 — Subscriber & Usage SQL

SQL queries tersedia di:

```text
sql/queries.sql
```

File tersebut mencakup:

1. Membuat tabel `subscribers`
2. Memasukkan data subscriber
3. Membuat tabel `usage`
4. Memasukkan usage data
5. Insert subscriber Fajar
6. Update plan Fajar menjadi Premium
7. Menghitung total data usage subscriber Premium
8. Menampilkan Top 3 subscriber berdasarkan total data usage
9. Subquery untuk mencari subscriber dengan rata-rata call minutes <= 30

Database schema:

### subscribers

```text
id
name
plan
activation_date
```

### usage

```text
subscriberId
callMinutes
smsCount
dataUsageMB
timestamp
```

---

# 10. Q4 — Troubleshoot & Explain

File implementasi Q4:

```text
q4/troubleshoot.js
```

Masalah pada kode awal adalah callback `reduce()` tidak mengembalikan accumulator `total`.

Kode awal:

```javascript
function getTotalUsageMB(records) {
    return records.reduce((total, record) => {
        total += record.dataUsageMB;
    });
}
```

Masalah:

```javascript
return total;
```

tidak terdapat di dalam callback.

## Fixed Version

```javascript
function getTotalUsageMB(records) {
    return records.reduce((total, record) => {
        total += record.dataUsageMB;
        return total;
    }, 0);
}
```

`0` digunakan sebagai initial value untuk accumulator.

## Test Q4

Jalankan:

```bash
npm run q4
```

Expected output:

```text
Total data usage: 8000 MB
```

---

# 11. Available Commands

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm start`         | Menjalankan backend API            |
| `npm run snapshot`  | Membuat CSV snapshot secara manual |
| `npm run scheduler` | Menjalankan scheduler otomatis     |
| `npm run cleanup`   | Menghapus CSV lebih dari 30 hari   |
| `npm run q4`        | Menjalankan test Q4                |

---

# 12. Testing Flow

Urutan testing yang direkomendasikan:

### Step 1 — Start API

```bash
npm start
```

### Step 2 — Test POST `/usage`

Gunakan Postman atau Thunder Client:

```text
POST http://localhost:3000/usage
```

Body:

```json
{
    "subscriberId": "SUB01",
    "callMinutes": 40,
    "smsCount": 10,
    "dataUsageMB": 1500
}
```

### Step 3 — Test GET `/usage`

```text
GET http://localhost:3000/usage
```

Pastikan data yang dimasukkan muncul.

### Step 4 — Test Snapshot

```bash
npm run snapshot
```

Pastikan file CSV muncul di:

```text
snapshots/
```

### Step 5 — Test Cleanup

```bash
npm run cleanup
```

### Step 6 — Test Q4

```bash
npm run q4
```

Expected:

```text
Total data usage: 8000 MB
```

---

# 13. Notes

The API uses in-memory storage as permitted by the assessment. Therefore, usage records are not persistent and will be cleared when the backend server restarts.

CSV snapshots provide a historical record of the usage data retrieved from the API.

The scheduler uses the `Asia/Jakarta` timezone to ensure the configured execution times follow WIB.
