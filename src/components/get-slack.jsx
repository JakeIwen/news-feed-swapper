var React = require( 'react' );
var TextSelect = require('react-textselect');
var moment = require('moment');
const async = require('async');
const request = require('request');


import { IState } from '../store/reducer';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';


module.exports = SlackFeed;
