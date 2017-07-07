import 'react-select/dist/react-select.css';
import { formatMessages, updateStorage, getToken, teamSelector } from './helper-functions';
import { connect } from 'react-redux';
import { fetchMessages, fetchRtm } from '../store/actions';

import MessageList from './message-list';
import PostMessage from './post-message';
import ChannelInfo from './channel-info';
import TeamSite from './team-site';

const React = require('react');

let token_info = require('../info');
token_info = token_info.default;

export class SlackFeed extends React.Component {
  componentDidMount() {
      const accessCode = window.location.href.match(/(\d{12}\.){2}.*(?=&)/g);
      getToken(token_info, accessCode, this.props.fetchRtm);
  }

	render() {
    console.log('slackfeed refresh - this.props', this.props);
    const pr = this.props;
    const signIn =
      <a href= { "https://slack.com/oauth/authorize?client_id=148278991843.147671805249&scope=client" }>
        <img src="https://api.slack.com/img/sign_in_with_slack.png" />
      </a>;
    return (pr.messages[0] && pr.rtm.ok) ?
      ( <section>
          <TeamSite />
          <ChannelInfo
            teamName={ pr.rtm.team.name }
            chanList={ pr.rtm.channels }
            imList={ pr.rtm.ims }
            viewId={ pr.channelId }
            usersById={ pr.usersById }
            onChange={ pr.fetchMessages } />
          <PostMessage
            channelId={ pr.channelId } />
          <MessageList
            messageList={ pr.messages } />
        </section> ) :
      ( <section>{ signIn }</section> );
  }
}

const mapStateToProps = (state) => ({
  rtm: state.rtm,
  usersById: state.usersById,
  channelId: state.channelId,
  messages: state.messages,
});

const mapDispatchToProps = {
  fetchMessages,
  fetchRtm,
};

export default connect(mapStateToProps, mapDispatchToProps)(SlackFeed);
