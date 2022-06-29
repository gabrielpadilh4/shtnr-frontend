import React from 'react';
import './App.scss';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      uglyLink: "",
      shtnr: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getApiUrl() {
    return process.env.API_URL || 'https://url-shtnr-dev.herokuapp.com/'
  }

  handleChange(event) {
    this.setState({ uglyLink: event.target.value });
  }

  async handleSubmit(event) {

    event.preventDefault();

    const uglyLink = { "url": this.state.uglyLink };

    const data = await fetch(this.getApiUrl() + '/generate', {
      headers: { 'Content-type': 'application/json' },
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(uglyLink)
    });

    const shtnr = await data.json();

    this.setState({ shtnr: shtnr, uglyLink: '' })

    navigator.clipboard.writeText(this.getApiUrl() + '/shtnr/' + this.state.shtnr.shortLink);

    alert('Shortened link copied to clipboard :)');

  }

  render() {
    return (
      <div className="shtnr">
        <form
          id="main-login"
          onSubmit={this.handleSubmit}>
          <h2>Shtnr</h2>
          <span>A url shortener...</span>
          <label>
            <input type="text" placeholder="Paste your ugly link..." value={this.state.uglyLink} onChange={this.handleChange} />
          </label>
          <div className="align-right">
            <button>Submit</button>
          </div>
        </form>

        <br />

        {this.state.shtnr ?
          <div>
            <div className="shtnrLink">
              <p>
                <h5>Original:</h5>
                <a href={this.state.shtnr.originalUrl}>{this.state.shtnr.originalUrl}</a>
              </p>
              <br></br>
            </div>
            <div className="shtnrLink">
              <p>
                <h5>Shortened:</h5>
                <p>{this.state.shtnr.expirtationDate}</p>
                <a href={this.getApiUrl() + '/shtnr/' + this.state.shtnr.shortLink}>{this.getApiUrl() + '/shtnr/' + this.state.shtnr.shortLink}</a>
              </p>
            </div>
          </div>
          :
          ''
        }
      </div>
    );
  }
}