CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY,
    latitude REAL,
    longitude REAL,
    speed INTEGER,
    batteryLevel REAL,
    wifi TEXT,
    verticalAccuracy INTEGER,
    horizontalAccuracy INTEGER,
    timestamp TEXT,
    altitude INTEGER,
    batteryState TEXT
);
