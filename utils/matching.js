//matching users artists using js intersection method and calculates similarity
function findSimilarity(artists1, artists2) {
    if (artists1.length == 0 || artists2.length == 0) { return 0; }

    let set = new Set(artists2.map(a => a.name.trim()));
    let xSet = artists1.filter(el => set.has(el.name.trim()));

    return { similarity: 2 * xSet.length / (artists1.length + artists2.length), matchArtists: xSet };
}

//matching users using similarity
function findMatch(curUser, allUsers) {
    for (let user of allUsers) {
        let { similarity, matchArtists } = findSimilarity(curUser.artists, user.artists);
        user.similarity = similarity;
        user.matchArtists = matchArtists;
    }
    allUsers.sort((u1, u2) => {
        if (u1.similarity > u2.similarity) {
            return -1;
        } else if (u1.similarity < u2.similarity) {
            return 1;
        } else { return 0; }
    });

    //return 3 most similar users
    return allUsers.slice(0, 3);
}

module.exports = { findMatch };

// read more about intersection
//https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848 
//https://stackoverflow.com/questions/31930894/javascript-set-data-structure-intersect