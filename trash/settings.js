"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const actions_1 = require("../store/actions");
class Settings extends React.Component {
    render() {
        const resetHiddenQuotes = (e) => {
            e.preventDefault();
            this.props.resetHiddenQuotes();
        };
        return (React.createElement("form", { className: "nfe-settings" },
            React.createElement("fieldset", null,
                React.createElement("legend", null,
                    React.createElement("label", null,
                        React.createElement("input", { type: "checkbox", checked: this.props.quotesVisible, onChange: this.props.toggleShowQuotes }),
                        "Show Quotes")),
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", disabled: !this.props.quotesVisible, checked: this.props.builtinQuotesEnabled, onChange: this.props.toggleBuiltinQuotes }),
                    "Enable Built-in Quotes"),
                this.props.hiddenQuoteCount > 0 &&
                    React.createElement("span", { className: "nfe-settings-hidden-quote-count" },
                        "\u00A0(",
                        this.props.hiddenQuoteCount,
                        " hidden" + " " + "- ",
                        React.createElement("a", { href: "#", onClick: resetHiddenQuotes }, "Reset"),
                        ")"),
                React.createElement("p", null, this.props.customQuoteCount > 0 ?
                    React.createElement("label", null,
                        this.props.customQuoteCount,
                        " custom quotes")
                    : React.createElement("label", null, "You can now add your own custom quotes! Just click" + " " + "the arrow menu beside the quote text.")))));
    }
}
const mapStateToProps = (state) => ({
    quotesVisible: state.showQuotes,
    builtinQuotesEnabled: state.builtinQuotesEnabled,
    hiddenQuoteCount: state.hiddenBuiltinQuotes.length,
    customQuoteCount: state.customQuotes.length,
});
const mapDispatchToProps = (dispatch) => ({
    toggleShowQuotes: () => dispatch(actions_1.toggleShowQuotes()),
    toggleBuiltinQuotes: () => dispatch(actions_1.toggleBuiltinQuotes()),
    resetHiddenQuotes: () => dispatch(actions_1.resetHiddenQuotes()),
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Settings);
