// Loads the Riot API key in the Node environment
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TeemoJS = require('teemojs');

/* ********** LEAGUE DATA READ ********** */

const championsData = require('./static/champion.json').data;
const champions = Object.values(championsData);
//const itemsData = require('./static/item.json').data;
const items = require('./static/item.json').data; //Object.values(itemsData);
const summonersData = require('./static/summoner.json').data;
const summonerSpells = Object.values(summonersData);

/* ********** LEAGUE API SETUP ********** */

const api = TeemoJS(process.env.RIOT_LOL_API_KEY);
const region = 'na1';
const HISTORY_LENGTH = 10;

// @todo Store that info elsewhere
let summonerInfo = {};
let matchDetails = [];

/* ********** SERVER SETUP ********** */

const app = express();
const port = 5000;

// Enable CORS because the React front-end runs on a different port
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware used to parse request bodies
app.use(bodyParser.json());

/* ********** LEAGUE API CALLS ********** */

const getSummonerInfo = name => {
  return api.get(region, 'summoner.getBySummonerName', name);
};

// REMEMBER TO UP TO 20
const getMatchHistory = encryptedAccountId => {
  return api.get(region, 'match.getMatchlist', encryptedAccountId, {
    endIndex: HISTORY_LENGTH
  });
};

const getMatchDetails = matchId => {
  return api.get(region, 'match.getMatch', matchId);
};

/* ********** LEAGUE INFO PARSING ********** */

const sanitizeMatchHistory = apiMatchesArray => {
  const getSummonerObject = data => {
    const participantId = data.participantIdentities.find(
      pi => pi.player.accountId === summonerInfo.accountId
    ).participantId;
    return data.participants.find(p => p.participantId === participantId);
  };

  const championFromId = championId =>
    champions.find(c => c.key === `${championId}`).name;

  const summonerSpellsFromIds = spellIds =>
    spellIds.map(id => summonerSpells.find(s => s.key === `${id}`).name);

  const itemsFromIds = itemIds =>
    itemIds.reduce((acc, id) => {
      if (id !== 0) {
        acc.push(items[id].name);
      }
      return acc;
    }, []);

  const kdaString = (kills, deaths, assists) => `${kills}/${deaths}/${assists}`;

  matchHistory = apiMatchesArray.map(match => {
    const summoner = getSummonerObject(match);
    const stats = summoner.stats;

    return {
      win: stats.win,
      gameMode: match.gameMode,
      gameId: match.gameId,
      gameDuration: match.gameDuration,
      createdAt: match.gameCreation,
      summonerSpells: summonerSpellsFromIds([
        summoner.spell1Id,
        summoner.spell2Id
      ]),
      champion: championFromId(summoner.championId),
      championLevel: stats.champLevel,
      kda: kdaString(stats.kills, stats.deaths, stats.assists),
      items: itemsFromIds([
        stats.item0,
        stats.item1,
        stats.item2,
        stats.item3,
        stats.item4,
        stats.item5
      ])
    };
  });

  // sort by creation timestamp in case we didn't retrieve the match details in order
  return matchHistory.sort((a, b) => a.createdAt - b.createdAt);
};

/* ********** ROUTES ********** */

// Get match history
app.post('/api/matchlist', async (req, res) => {
  const summonerName = req.body.summonerName;

  // Clear existing data on new summoner info request
  matchDetails = [];

  // Get summoner info
  console.log(`Requesting summoner info for ${summonerName}`);
  getSummonerInfo(summonerName).then(data => {
    summonerInfo = data;

    // Get match history + match details for each game
    getMatchHistory(summonerInfo.accountId).then(data => {
      const matchHistory = data.matches;

      const promises = matchHistory.map(match =>
        getMatchDetails(match.gameId).then(details => {
          console.log(`match details retrieved for match id ${match.gameId}`);
          matchDetails.push(details);
        })
      );

      Promise.all(promises).then(() => {
        console.log('all promises resolved, sanitizing match history');

        // Return & send ready-for-display match history
        console.log(`Sending match history data for ${summonerName}`);
        res.send(sanitizeMatchHistory(matchDetails));
      });
    });
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
