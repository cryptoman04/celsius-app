import React, { Component } from 'react';

import testUtil from "../../../utils/test-util";
import CelText from '../../atoms/CelText/CelText';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import ProgressBar from '../../atoms/ProgressBar/ProgressBar';


class CreatePin extends Component {

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
    const header = {
      left: "back",
      children: <ProgressBar steps={5} currentStep={4} />
    }
    return (
      <AuthLayout header={header}>
        <CelText margin="0 0 14 0" type="H1" align="center">Create a PIN</CelText>
        <CelText margin="0 0 30 0" type="H4" align="center">We have sent you an SMS with a code.</CelText>
      </AuthLayout>
    );
  }
}

export default testUtil.hookComponent(CreatePin);