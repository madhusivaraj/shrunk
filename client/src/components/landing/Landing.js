import React, { Component } from "react";
import "./Landing.css";
import { createShortUrl } from "../../APIHelper";
import constants from "../../config/constants";
class Landing extends Component {
  constructor() {
    super();
    this.state = {
      showShortenUrl: false,
      shortenUrl: "",
      originalUrl: "",
      baseUrl: "",
      clickSubmit: true,
      showError: false,
      apiError: "",
      showApiError: false,
      showLoading: false
    };
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }
  handleSubmit() {
    this.setState({ clickSubmit: true, showApiError: false });
    if (this.state.clickSubmit && this.state.originalUrl) {
      this.setState({ showLoading: true, showShortenUrl: false });
      let reqObj = {
        originalUrl: this.state.originalUrl,
        shortBaseUrl: constants.baseUrl
      };
      createShortUrl(reqObj)
        .then(json => {
          setTimeout(() => {
            this.setState({
              showError:false,
              showLoading: false,
              showShortenUrl: true,
              shortenUrl: constants.baseUrl + json.data.urlCode
            });
          }, 0);
        })
        .catch(error => {
          this.setState({
            showLoading: false,
            showApiError: true,
            apiError: "Error: The URL must have a valid scheme and host."
          });
        });
    } else {
      this.setState({ showShortenUrl: false, showError: true });
    }
  }
  renderButton() {
    if (!this.state.showLoading) {
      return (
        <button
          className="submit-btn"
          name="action"
          onClick={this.handleSubmit}
          bgColor= 'red'>
        Create ></button>
      );
    } else {
      return (
        <div className="loader">
          <div className="preloader-wrapper small active">
          
              <div className="circle-clipper left">
                <div className="circle" />
              </div>
              <div className="gap-patch">
                <div className="circle" />
              </div>
              <div className="circle-clipper right">
                <div className="circle" />
              </div>
            </div>
         
        </div>
      );
    }
  }
  render() {
    return (
   <div className="landing">
        <div>
          <h4>SHRUNK</h4>
          <h5>A URL shortener.</h5>
        </div>
        <input
          disableUnderline={true}
          id="originalUrl"
          class="originalUrl"
          name="originalUrl"
          type="text"
          value={this.state.originalUrl}
          onChange={this.handleUserInput.bind(this)}
          placeholder="Your link here..."
          autocomplete="off" />

        {this.renderButton()}
        {this.state.showApiError && (
          <div className="shorten-error">{this.state.apiError}</div>
        )}
        
        {this.state.showShortenUrl && (
          <div className="shorten-title">
            Success! Your new URL is {` `}
            <a target="_blank" href={this.state.shortenUrl}>
              {this.state.shortenUrl}
            </a>
          </div>
        )}
      </div>
    );
  
  }
}

export default Landing;
