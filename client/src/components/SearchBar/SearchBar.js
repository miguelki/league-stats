import PropTypes from 'prop-types';
import React, { Component } from 'react';

class SearchBar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    summonerName: ''
  };

  onChange = event => {
    this.setState({ summonerName: `${event.target.value}` });
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state.summonerName);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label>
          Summoner Name:
          <input
            type='text'
            name='summoner'
            value={this.state.summonerName}
            onChange={this.onChange}
            id='summoner'
          />
        </label>
        <input type='submit' value='Submit' />
      </form>
    );
  }
}

export default SearchBar;
