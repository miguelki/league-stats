## How to run it

- Add Riot API key to `server/.env` file
- Install dependencies in both `client` and `server` sub-folders
- Launch server-side first: `node app.js`
- Launch client-side: `npm run start`

## What I could improve

### Client-side

- Use something like TypeScript for type safety and interface definitions
- Input sanitizing/error handling (invalid summoner name, no recent matches)
- Styling, responsive design
- Display other info (other participants, highest rank, timeline)
- Snapshot tests

### Server-side

- Runes, total creeps & creep score (missing)
- Remove debug logs (or at least use debug/warn/error instead of console.log())
- Network error handling
- Use async/await instead of nested promises
- Split up the monolithic `app.js` (one file for Riot API calls, one for the routing)
- Use a more user-friendly Riot API library or write it myself (issues with Kayn and LeagueJS + V4 APIs)
- Cache Riot data (summoner info, match history, match details) in a database
- Deploy the server-side code on Heroku
- Fetch static data from Data Dragon directly instead of loading JSON files
- Unit tests
- Features: per-lane analysis, sort champions played and gather/display relevant stats, LP history graph, etc
