--User stats
DEALLOCATE user_stats;

PREPARE user_stats(TIMESTAMP, BOOLEAN) AS
SELECT 
    usr.email, 
    usr.name,
    usr."countryOfOrigin", 
    usr."dateOfBirth", 
    usr.gender,
    COUNT(vote.id) AS "numVotes", 
    SUM(CASE WHEN "winnerUsr".gender = 'Male' THEN 1 ELSE 0 END) AS "numMaleVotes",
    SUM(CASE WHEN "winnerUsr".gender = 'Female' THEN 1 ELSE 0 END) AS "numFemaleVotes",
    SUM(CASE WHEN pic.id IS NULL THEN 1 ELSE 0 END) AS "numSkips",
    usr_pics.num_pics,
    usr."createdAt"
FROM 
    "User" AS usr
LEFT JOIN (
    SELECT 
        usr.id,
        SUM(CASE WHEN ($2 AND pic.id IS NOT NULL) OR pic."createdAt" >= $1 THEN 1 ELSE 0 END) num_pics
    FROM 
        "User" AS usr
    LEFT JOIN 
        "Picture" AS pic ON pic."userId" = usr.id
    GROUP BY 
        usr.id
) AS usr_pics ON usr.id = usr_pics.id
INNER JOIN 
    "Vote" AS vote ON usr.id = vote."voterId"
LEFT JOIN 
    "Picture" AS pic ON vote."winnerPictureId" = pic.id
LEFT JOIN 
    "User" AS "winnerUsr" ON pic."userId" = "winnerUsr".id
WHERE
    $2 OR vote."createdAt" >= $1
GROUP BY 
    usr.email, usr.name, usr."createdAt", usr_pics.num_pics, usr."countryOfOrigin", usr."dateOfBirth", usr.gender
ORDER BY 
    usr."createdAt" DESC;

EXECUTE user_stats('2023-09-15 12:00:00', true);

--Count num pics by user
SELECT 
    usr.email, 
    usr.name, 
    SUM(CASE WHEN pic.id IS NOT NULL THEN 1 ELSE 0 END) AS "numPics",
    usr."createdAt"
FROM 
    "User" AS usr
LEFT JOIN 
    "Picture" AS pic ON pic."userId" = usr.id
GROUP BY 
    usr.email, usr.name, usr."createdAt"
ORDER BY 
    usr."createdAt" DESC;

--Show pics by user
SELECT 
    pic.id,
    pic."numVotes",
    pic.filepath,
    pic."createdAt"
FROM 
    "User" AS usr
LEFT JOIN 
    "Picture" AS pic ON pic."userId" = usr.id
WHERE 
    usr.email = 'eduardo_tinti@hotmail.com'
ORDER BY
    pic."createdAt" DESC;

--Get last created users
SELECT 
    email, name, "countryOfOrigin", "dateOfBirth", gender, "createdAt"
FROM 
    "User"
ORDER BY 
    "createdAt" DESC;

--Get last match pics and winner
SELECT 
    match.id as match_id, 
    voter.name, 
    voter.email, 
    pic1.filepath as pic1_path, 
    pic2.filepath as pic2_path, 
    (CASE WHEN vote."winnerPictureId" = pic1.id THEN 'pic1' WHEN vote."winnerPictureId" = pic2.id THEN 'pic2' ELSE 'SKIP' END) as winner,
    match."createdAt"
FROM "_MatchToPicture" m1
INNER JOIN "_MatchToPicture" m2 ON m1."A" = m2."A" AND m1."B" < m2."B"
INNER JOIN "Picture" pic1 ON m1."B" = pic1.id
INNER JOIN "Picture" pic2 ON m2."B" = pic2.id
INNER JOIN "Match" match ON m1."A" = match.id
INNER JOIN "Vote" vote ON vote."matchId" = match.id
INNER JOIN "User" voter ON vote."voterId" = voter.id
ORDER BY match."createdAt" DESC;