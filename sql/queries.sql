-- ============================================
-- SUBSCRIBER USAGE API - SQL
-- ============================================


-- ============================================
-- 1. CREATE SUBSCRIBERS TABLE
-- ============================================

CREATE TABLE subscribers (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    activation_date DATE NOT NULL
);


-- ============================================
-- 2. INSERT INITIAL SUBSCRIBER DATA
-- ============================================

INSERT INTO subscribers
    (id, name, plan, activation_date)
VALUES
    ('SUB01', 'Amir', 'Basic', '2023-01-12'),
    ('SUB02', 'Sari', 'Premium', '2022-05-03'),
    ('SUB03', 'Budi', 'Basic', '2024-09-20'),
    ('SUB04', 'Dewi', 'Family', '2021-02-15'),
    ('SUB05', 'Rian', 'Premium', '2023-08-08'),
    ('SUB06', 'Nia', 'Basic', '2024-11-30');


-- ============================================
-- 3. CREATE USAGE TABLE
-- ============================================

CREATE TABLE subscriber_usage (
    subscriberId VARCHAR(10) NOT NULL,
    callMinutes INT NOT NULL,
    smsCount INT NOT NULL,
    dataUsageMB DECIMAL(10,2) NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (subscriberId)
        REFERENCES subscribers(id)
);


-- ============================================
-- 4. INSERT USAGE DATA
-- ============================================

INSERT INTO subscriber_usage 
    (subscriberId, callMinutes, smsCount, dataUsageMB, timestamp)
VALUES
    ('SUB01', 40, 10, 1500, '2025-08-01 08:00:00'),
    ('SUB01', 35, 8, 1200, '2025-08-01 12:00:00'),
    ('SUB02', 90, 20, 6000, '2025-08-01 08:00:00'),
    ('SUB02', 85, 18, 5800, '2025-08-01 12:00:00'),
    ('SUB03', 20, 5, 500, '2025-08-01 08:00:00'),
    ('SUB04', 150, 30, 9000, '2025-08-01 08:00:00'),
    ('SUB05', 70, 15, 5000, '2025-08-01 08:00:00'),
    ('SUB06', 25, 6, 700, '2025-08-01 08:00:00');


-- ============================================
-- Q3.1 INSERT FAJAR
-- ============================================

INSERT INTO subscribers
    (id, name, plan, activation_date)
VALUES
    ('SUB07', 'Fajar', 'Basic', '2024-01-24');


-- ============================================
-- Q3.2 UPDATE FAJAR TO PREMIUM
-- ============================================

UPDATE subscribers
SET plan = 'Premium'
WHERE id = 'SUB07';


-- ============================================
-- Q3.3 TOTAL DATA USAGE FOR PREMIUM
-- ============================================

SELECT
    SUM(u.dataUsageMB) AS total_data_usage_mb
FROM subscriber_usage u
JOIN subscribers s
    ON u.subscriberId = s.id
WHERE s.plan = 'Premium';


-- ============================================
-- Q3.4 TOP 3 SUBSCRIBERS BY DATA USAGE
-- ============================================

SELECT
    s.id,
    s.name,
    s.plan,
    SUM(u.dataUsageMB) AS total_data_usage_mb
FROM subscribers s
JOIN subscriber_usage u
    ON s.id = u.subscriberId
GROUP BY
    s.id,
    s.name,
    s.plan
ORDER BY
    total_data_usage_mb DESC
LIMIT 3;


-- ============================================
-- Q3.5 SUBQUERY
-- Average call minutes <= 30
-- ============================================

SELECT
    s.id,
    s.name,
    s.plan
FROM subscribers s
WHERE s.id IN (
    SELECT u.subscriberId
    FROM subscriber_usage u
    GROUP BY u.subscriberId
    HAVING AVG(u.callMinutes) <= 30
);