# React "Hello World" Examples

Below are a small collection of React examples to get anyone started using React. They progress from simpler to more complex/full featured.

They will hopefully get you over the initial learning curve of the hard parts of React (JSX, props vs. state, lifecycle events, etc).

## Usage

You will want to create an `index.html` file and copy/paste the contents of `1-base.html` and then create a `scripts.js` file and copy/paste the contents of one of the examples into it.


### Serving the examples

You will need to serve these examples using HTTP. You cannot just open the HTML files in a web browser. The easiest way to do this on Linux/OSX is the Python web server:

```bash
python -m SimpleHTTPServer 8000
```

As I don't use windows, I can't really help but check out [this article on StackOverflow](http://stackoverflow.com/questions/5050851/best-lightweight-web-server-only-static-content-for-windows).

## Going Further

- [React documentation](http://facebook.github.io/react/docs/getting-started.html)
- Flux architecture using [Reflux](https://github.com/spoike/refluxjs) (see [this blog post for more](http://spoike.ghost.io/deconstructing-reactjss-flux/))
- React routing with [react-router](https://github.com/rackt/react-router)
- I'd recommend checking out [Babel](https://babeljs.io/) and [WebPack](https://webpack.github.io/) for your build tooling setup.
- My other Gist on using [React + Reflux + WebSockets](https://gist.github.com/danawoodman/fa6145ee35caae3cd0a2)
- [Redux](https://github.com/reactjs/redux) is a great library for FLUX as well and seems to becoming the defacto standard in React-land.

## Contribute

See things that should be added, improved or clarified? Let me know in the comments!

## Updates

April 24, 2016:

- Updating to use `ReactDOM`
- Fixing various typos (thanks commenters for pointing them out!)
- Update to use newest React
- Use Babel instead of JSXTranformer
