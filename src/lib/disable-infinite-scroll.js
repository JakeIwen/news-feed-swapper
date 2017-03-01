"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isConversation = (target) => {
    if (!target || !target.matches) {
        return false;
    }
    if (target.matches('.conversation') || target.matches('#ChatTabsPagelet')) {
        return true;
    }
    if (!target.parentNode) {
        return false;
    }
    return isConversation(target.parentElement);
};
const maybeBlock = (event) => {
    if (isConversation(event.target)) {
        return false;
    }
    event.stopImmediatePropagation();
    return true;
};
function default_1() {
    window.addEventListener('scroll', maybeBlock, true);
    window.addEventListener('mousewheel', maybeBlock, true);
}
exports.default = default_1;
