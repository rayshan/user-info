import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import TimeAgo from 'react-timeago'

// =================================================================================================

class Results extends React.Component {
    render() {
        return (
            <section id="results">
                <img
                    id="avatar"
                    src={this.props.avatarUrl}
                    alt="user avatar"
                    title={this.props.name}
                />
                <div>
                    <span>Last active </span>
                    <TimeAgo date={this.props.lastActiveAt} />
                </div>
                <div>
                    <span>Possible email: </span>
                    <a id="email" href={`mailto:${this.props.email}`}>{this.props.email}</a>
                </div>
            </section>
        )
    }
}

class App extends React.Component {
    fetchDataForUsername(username) {
        return fetch(`https://api.github.com/users/${username}/events`)
            .then((response) => {
                let error;
                switch (response.status) {
                    case 200:
                        return response.json().then((data) => {
                            if (data.length) {
                                this.setState({data: this.processData(data)});
                            } else {
                                // Usernames that begin with "test" seem to return 200 with empty []
                                error = new Error("This user has no data.");
                                this.setState({error: error});
                            }
                        });
                    case 403:
                        error = new Error("You've hit your rate limit. Please try again later.");
                        break;
                    case 404:
                        error = new Error("Cannot find this user.");
                        break;
                    default:
                        error = new Error(`Something went wrong. Status Code: ${response.status}.`);
                        break;
                }
                this.setState({error: error});
            });
    }
    processData(data) {
        const result = {};
        for (let i = 0, datum; i < data.length; i++) {
            datum = data[i];
            result.lastActiveAt = datum.created_at;
            if (datum.type === "PushEvent") {
                result.avatarUrl = datum.actor.avatar_url;
                result.name = datum.payload.commits[0].author.name;
                result.email = datum.payload.commits[0].author.email;
                break;
            }
        }
        return result;
    }
    // =============================================================================================
    // Event Handlers
    // =============================================================================================
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.error) {
            this.setState({error: null});
        }
        if (this.state.previousInput && this.state.previousInput === this.usernameInput.value) {
            this.setState({error: new Error("Please try another username.")});
        } else {
            this.setState({previousInput: this.usernameInput.value});
            this.fetchDataForUsername(this.usernameInput.value);
        }
    }
    // =============================================================================================
    // Life Cycle Hooks
    // =============================================================================================
    constructor() {
        super();
        this.state = {
            previousInput: undefined,
            data: undefined,
            error: undefined
        };
    }
    render() {
        return (
            <div id="app-container">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input
                        id="text-input"
                        type="text"
                        placeholder="Enter Username"
                        autoFocus="true"
                        required="true"
                        ref={(component) => this.usernameInput = component}
                    />
                    <input id="submit" type="submit" value="Search" />
                    <span id="error-message">
                        {this.state.error ? this.state.error.message : null}
                    </span>
                </form>
                {this.state.data && !this.state.error ? <Results {...this.state.data} /> : null}
            </div>
        )
    }
}

// =================================================================================================

ReactDOM.render(
    <App />,
    document.getElementById("app-root")
);
