import React, { Component } from 'react';
import Message from './Message';
import io from 'socket.io-client';

const apiURI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3030/'
    : 'https://anonymous-texts.herokuapp.com/';
const socket = io(apiURI);

type State = {
  messages: Array<mixed>,
};
export default class MessageFeed extends Component<State> {
  state = {
    // eslint-disable-line no-named-as-default
    messages: [],
    loaded: 'hide',
  };

  componentDidMount() {
    socket.on('message-feed', (data) => {
      if (data !== undefined && data !== null) {
      const json = JSON.parse(data);
        const { messages } = json;
        console.log(messages);
        this.setState({ messages, loaded: 'show' });
      }
    });
  }

  render() {
    return (
      <div>
        <h2 className="text-center">Recent Activity</h2>
        <div className={`message-feed ${this.state.loaded}`}>
          {this.state.messages.map(message => {
            const { body, sid } = message;
            return (
              <Message
                loaded={this.state.loaded}
                body={body}
                key={sid}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
