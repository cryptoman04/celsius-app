import React, { Component } from 'react';
// import { View, Text } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
import SupportStyle from "./Support.styles";
import RegularLayout from '../../layouts/RegularLayout/RegularLayout';

@connect(
  state => ({
    style: SupportStyle(state.ui.theme),
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class Support extends Component {

  static propTypes = {
    // text: PropTypes.string
  };
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const { style } = this.props
    return (
      <RegularLayout header={{
        title: "Chat with support",
        right: "close"
      }} />
    );
  }
}

export default testUtil.hookComponent(Support);