/*
Creating a component

The most simple component has a `render` method that returns some
JSX. `props` are attributes that are passed into the component
when you instantiate it.

One caveat is that `render` must return a single parent element;
you can't return multiple adjacent JSX tags but must wrap them
in one parent element.
*/

var MessageItem = React.createClass({
  render: function() {
    return (
      <div>
        <p>{timeConverter(this.props.ts)}</p>
        <p>{this.props.user}</p>
        <p>{this.props.text}</p>
      </div>
    )
  }
});

var MessageList = React.createClass({
  getInitialState: function(){
    //so .map doesnt throw error initially
    return {
      msgData: [{}]
    }
  },
  componentDidMount: function() {
    const self = this;
    //get list of 100 messages from a slack channel
    var req = buildQuery('users.list');
    var usersById = {};
    $.getJSON(req, function(userList) {
      console.log('userList', userList.members);
      //create hash key
      for (var i = 0; i < userList.members.length; i++) {
        usersById[userList.members[i].id] = userList.members[i];
      }
    }).then(function() {
      req = buildQuery('channels.history', '&channel=C0PK0SZDW');
      //get message list
      $.getJSON(req, function(data) {
        //append user info to each message
        for (var i = 0; i < data.messages.length; i++) {
          data.messages[i].userData = usersById[data.messages[i].user];
        }
        console.log('messages', data.messages);
        self.setState({
          msgData: data.messages.sort(dynamicSort("-ts"))
        });
      }.bind(this));
    });

 		function buildQuery (method, arg) {
 			arg = arg || '';
 			console.log('arg', arg);
 			var token = '?token=xoxp-23646916496-23649242352-143236957938-e948672ba71d8389d3485803d2a07a15';
 			var query = 'https://slack.com/api/';
 			query += method + token + arg + '&pretty=1';
 			return encodeURI(query);
 		}
  },
  render: function () {
    var messages = this.state.msgData.map(function (item, index) {
      console.log('item', item.userData.);
      return (
        <MessageItem
          key={index}
          ts={item.ts}
          user={item.user}
          text={item.text}
        />
      );
    });
    return (
      <section>
        {messages}
      </section>
    );
  }

});


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}


ReactDOM.render(<MessageList />, document.getElementById('root'));
