import React, { Component } from 'react';
import { View, Image } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
import RegularLayout from '../../layouts/RegularLayout/RegularLayout';
import CelButton from '../../atoms/CelButton/CelButton';
import Separator from '../../atoms/Separator/Separator';
import STYLES from '../../../constants/STYLES';

@connect(
  state => ({
    profilePicture: state.user.profile.profile_picture
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class ChangeAvatar extends Component {

  static propTypes = {
    // text: PropTypes.string
  };
  static defaultProps = {
  }

  static navigationOptions = () => ({
    title: "Change Avatar",
    right: "settings"
  });

  saveProfileImage = (photo) => {
    const { actions } = this.props;

    actions.updateProfilePicture(photo);
    actions.updateFormField('profileImage', photo);
    actions.navigateTo('Profile');
  }

  goToCamera = () => {
    const { actions } = this.props;

    actions.activateCamera({
      cameraField: 'profileImage',
      cameraHeading: 'Profile photo',
      cameraCopy: 'Please center your face in the circle and take a selfie, to use as your profile photo.',
      cameraType: 'front',
      mask: 'circle',
      onSave: this.saveProfileImage,
    })
  }

  render() {
    const { profilePicture } = this.props;

    return (
      <RegularLayout>
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Image
            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 5, borderColor: STYLES.COLORS.WHITE }}
            source={profilePicture ? { uri: profilePicture } : require('../../../../assets/images/empty-profile/empty-profile.png')}
            resizeMethod="resize"
          />
          <CelButton onPress={this.goToCamera} basic>Take a picture</CelButton>
        </View>
        <Separator text="OR CHOOSE ONE BELOW" />
      </RegularLayout>
    );
  }
}

export default testUtil.hookComponent(ChangeAvatar);