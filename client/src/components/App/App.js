import React, { Component } from 'react';
import MatchInfo from '../MatchInfo';
import { SearchBar } from '../SearchBar';
import { getMatches } from '../../requests';
import './App.css';

class App extends Component {
  state = {
    matchHistory: null
  };

  onSummonerNameSubmit = name => {
    console.log(`summoner name: ${name}`);
    this.setState({ matchHistory: null });
    getMatches(name).then(matchHistory => {
      this.setState({ matchHistory });
    });
  };

  renderMatchHistory = () =>
    this.state.matchHistory.map(match => (
      <MatchInfo {...match} key={match.gameId} />
    ));

  render() {
    return (
      <div className='App'>
        <SearchBar onSubmit={this.onSummonerNameSubmit} />
        {this.state.matchHistory && this.renderMatchHistory()}
      </div>
    );
  }
}

export default App;
