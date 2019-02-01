import React from 'react';

export const MatchInfo = ({
  champion,
  championLevel,
  createdAt,
  gameDuration,
  gameId,
  gameMode,
  items,
  kda,
  summonerSpells,
  win
}) => {
  const outcome = win ? 'Victory' : 'Defeat';
  const date = new Date(createdAt);
  const durationDate = new Date(null);
  durationDate.setSeconds(gameDuration);
  const duration = durationDate.toISOString().substr(11, 8);

  return (
    <div>
      <h2>Game info</h2>
      <p>
        Game id: {gameId} <br />
        Game mode: {gameMode} <br />
        Created on: {date.toLocaleDateString()} at {date.toLocaleTimeString()}
        <br />
        Duration: {duration} <br />
        Outcome: {outcome}
      </p>
      <h2>Champion stats</h2>
      <p>
        Champion played: {champion} (level {championLevel}) <br />
        K/D/A: {kda} <br />
        Items: {items.join(', ')} <br />
        Summoner spells: {summonerSpells.join('& ')} <br />
      </p>
      <hr />
    </div>
  );
};

/*
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
      stats.item1,
      stats.item2,
      stats.item3,
      stats.item4,
      stats.item5,
      stats.item6
    ])
  };
  */
