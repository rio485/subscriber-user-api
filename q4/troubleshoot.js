function getTotalUsageMB(records) {
    return records.reduce((total, record) => {
        total += record.dataUsageMB;
        return total;
    }, 0);
}

const records = [
    {
        subscriberId: "SUB01",
        dataUsageMB: 1500
    },
    {
        subscriberId: "SUB02",
        dataUsageMB: 6000
    },
    {
        subscriberId: "SUB03",
        dataUsageMB: 500
    }
];

const total = getTotalUsageMB(records);

console.log(`Total data usage: ${total} MB`);