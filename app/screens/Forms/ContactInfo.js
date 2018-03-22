import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {Container, Content, Form, View} from 'native-base';
import {bindActionCreators} from 'redux';

import {MainHeader} from '../../components/Headers/MainHeader/MainHeader';
import {AnimatedHeading} from '../../components/Headings/AnimatedHeading/AnimatedHeading';
import {Message} from '../../components/Message/Message';
import Styles from "./styles";
import * as actions from "../../redux/actions";
import {STYLES} from "../../config/constants/style";
import PrimaryInput from "../../components/Inputs/PrimaryInput/PrimaryInput";
import {KEYBOARD_TYPE} from "../../config/constants/common";
import {PrimaryButton} from "../../components/Buttons/Button/Button";

@connect(
  state => ({
    nav: state.nav,
  }),
  dispatch => bindActionCreators(actions, dispatch),
)

class ContactInfoScreen extends Component {
  constructor() {
    super();

    this.state = {
      cellPhone: '',
      otherPhones: '',
      email: '',
      isLoading: false
    };
  }

  onScroll = event => {
    this.heading.animateHeading(event);
  };

  onSubmit = () => {
    console.log(this.state)
  };

  render() {
    const {
      cellPhone,
      otherPhones,
      email,
      isLoading
    } = this.state;

    return (
      <Container>
        <StatusBar barStyle="dark-content"/>
        <MainHeader {...this.props} backButton customStyle={{backgroundColor: STYLES.PRIMARY_BLUE}}/>
        <AnimatedHeading
          containerCustomStyles={{backgroundColor: STYLES.PRIMARY_BLUE}}
          ref={(heading) => {
            this.heading = heading;
          }}
          text={'Contact Info'}/>

        <Message/>

        <Content
          bounces={false}
          style={Styles.content}
          onScroll={this.onScroll}>
          <View>
            <Form>
              <PrimaryInput
                labelText={'Cell Phone'}
                keyboardType={KEYBOARD_TYPE.NUMERIC}
                value={cellPhone}
                onChange={(text) => this.setState({cellPhone: text})}/>

              <PrimaryInput
                labelText={'Other phones'}
                keyboardType={KEYBOARD_TYPE.DEFAULT}
                value={otherPhones}
                autoCapitalize={'words'}
                onChange={(text) => this.setState({otherPhones: text})}/>

              <PrimaryInput
                labelText={'Email'}
                keyboardType={KEYBOARD_TYPE.EMAIL}
                value={email}
                autoCapitalize={'words'}
                onChange={(text) => this.setState({email: text})}/>

              <View style={Styles.buttonWrapper}>
                <PrimaryButton
                  loading={isLoading}
                  onPress={() => this.onSubmit()}
                  title={'Next'}/>
              </View>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}

export default ContactInfoScreen;
