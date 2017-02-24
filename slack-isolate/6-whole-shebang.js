/*
Whole Shebang

This example shows most of the commonly used React functionality including:

- Component lifecycle events
- Mixins
- Default props
- Prop validation
- Looping
- DOM refs
- Browser events

See more here lifecycle events here:
http://facebook.github.io/react/docs/component-specs.html

This is by no means how you should write React components, it is just meant to illustrate various features of React.
*/

/*
Mixins are just objects with properties that are merged with the compoent
they are included in. 

See: http://facebook.github.io/react/docs/reusable-components.html#mixins
*/
var MyMixin = {
  queryAPIorSomething: function (url, options, successCallback) {
    // Do some API magic here...
  },
  
  // This does not overwrite the components 
  // `componentWillUnmount` method but will
  // be called along side it.
  componetWillUnmount: function () {
    // Abor XHR request or something else...
  }
};


var WholeShebang = React.createClass({
  mixins: [MyMixin],
  
  propTypes: {
    // This will log a message on the console if 
    // items is not defined or if the wrong type
    // is supplied.
    items: React.PropTypes.array.isRequired,
    
    // This will only log if the type is wrong.
    prefix: React.PropTypes.string,
  },
  
  // Sane defaults for your component...
  getDefaultProps: function () {
    return {
      prefix: 'Hello'
    }
  },

  getInitialState: function () {
    return {
      showDefault: false,
    }
  },

  componentWillMount: function () {
    // Here you could setState, fetch data from a server or something else...
    this.queryAPIorSomething('path/to/api.json', {} , function (data) {
      this.setState({ data: data });
    }.bind(this));
  },
  
  componentDidMount: function () {
    // You now have access to the DOM:
    console.log(ReactDOM.findDOMNode(this).innerHTML);
    
    // ... or to component references:
    console.log(this.refs.foobar.innerHTML);
  },
  
  componentWillUpdate: function () {
    console.log('component about to update!');
  },
  
  componentDidUpdate: function () {
    console.log('component updated!');
    // DOM is available here...
  },
  
  componentWillUnmount: function () {
    // Use this to tear down any event listeners
    // or do other cleanup before the compoennt is
    // destroyed.
    console.log('component will unmount!');
  },
  
  shouldComponentUpdate: function () {
    // This is called when state/props changed and is 
    // an opportunity where you can return false if
    // you don't want the component to update for
    // some reason.
    return true;
  },
  
  toggle: function (e) {
    // Prevent following the link.
    e.preventDefault();
    
    // Invert the chosen default.
    // This will trigger an intelligent re-render of the component.
    this.setState({ showDefault: !this.state.showDefault })
  },
  
  render: function () {
    var items = this.props.items.map(function (item, index) {
      // Any time you construct a list of elements or components,
      // you need to set the `key` so React can more easily work
      // with the DOM.
      return <li key={index}>{item}</li>;
    });
    
    return (
      <div>
        <span ref="foobar">
          Show default: {this.state.showDefault ? 'True' : 'False'}
        </span>
        <ul>
          {items}
        </ul>
        <a href="" onClick={this.toggle}>Toggle</a>
    </div>
    );
  }
});

ReactDOM.render(
  <WholeShebang items={['Bob', 'Mary', 'Sally']} />,
  document.querySelector('.some-tag') // use other selectors, jQuery or something else to find your target on the page if you want
);