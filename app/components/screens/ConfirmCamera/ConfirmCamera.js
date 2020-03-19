import React, { Component } from "react";
import { View, SafeAreaView, Image } from "react-native";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import store from "../../../redux/store";

import * as appActions from "../../../redux/actions";
import CelText from "../../atoms/CelText/CelText";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import STYLES from "../../../constants/STYLES";
import Spinner from "../../atoms/Spinner/Spinner";
import CelButton from "../../atoms/CelButton/CelButton";
import apiUtil from "../../../utils/api-util";
import API from "../../../constants/API";
import { navigateTo } from "../../../redux/nav/navActions";

@connect(
  state => ({
    mask: state.camera.mask,
    photo: state.camera.photo,
    cameraField: state.camera.cameraField,
    cameraHeading: state.camera.cameraHeading,
    cameraCopy: state.camera.cameraCopy,
    callsInProgress: state.api.callsInProgress,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ConfirmCamera extends Component {
  static navigationOptions = () => ({
    transparent: true,
    customBack: () => {
      store.dispatch(navigateTo("KYCVerifyIdentity"));
    },
    gesturesEnabled: false,
  });

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  savePhoto = () => {
    const { actions, cameraField, photo, navigation } = this.props;

    const onSave = navigation.getParam("onSave");

    if (onSave) {
      onSave(photo);
    } else {
      actions.updateFormField(cameraField, photo);
      actions.navigateBack();
    }
    this.setState({
      isLoading: true,
    });
  };

  render() {
    const {
      mask,
      cameraHeading,
      photo,
      actions,
      callsInProgress,
      cameraCopy,
    } = this.props;
    const { isLoading } = this.state;

    const loading = apiUtil.areCallsInProgress(
      [API.TAKE_CAMERA_PHOTO],
      callsInProgress
    );

    const maskType = mask || "utility";

    return (
      <RegularLayout fabType="hide">
        <View
          style={{
            alignSelf: "center",
            flex: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View style={{ flex: 1, marginBottom: 20 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <CelText
                type="H3"
                weight="700"
                align="center"
                margin="15 0 20 0"
                style={{ paddingHorizontal: 20 }}
              >
                {cameraHeading}
              </CelText>
              <CelText
                type="H5"
                align="center"
                style={{ paddingHorizontal: 20 }}
              >
                {cameraCopy}
              </CelText>
            </SafeAreaView>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }} />
            {photo && !loading ? (
              <View
                style={{
                  width: STYLES.CAMERA_MASK_SIZES[maskType].width,
                  height: STYLES.CAMERA_MASK_SIZES[maskType].height,
                  borderWidth: 5,
                  borderColor: STYLES.COLORS.WHITE,
                  borderRadius:
                    maskType === "circle"
                      ? STYLES.CAMERA_MASK_SIZES[maskType].width / 2
                      : 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="contain"
                  source={photo}
                  style={{
                    width: STYLES.CAMERA_MASK_SIZES[maskType].width - 5,
                    height: STYLES.CAMERA_MASK_SIZES[maskType].height - 5,
                    overflow: "hidden",
                    borderRadius:
                      maskType === "circle"
                        ? STYLES.CAMERA_MASK_SIZES[maskType].width / 2
                        : 0,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  width: STYLES.CAMERA_MASK_SIZES[maskType].width,
                  height: STYLES.CAMERA_MASK_SIZES[maskType].height,
                  borderWidth: 5,
                  borderColor: STYLES.COLORS.WHITE,
                  borderRadius:
                    maskType === "circle"
                      ? STYLES.CAMERA_MASK_SIZES[maskType].width / 2
                      : 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spinner />
              </View>
            )}
            <View style={{ flex: 1 }} />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                width: STYLES.CAMERA_MASK_SIZES[maskType].width,
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <CelButton
                onPress={() => {
                  actions.navigateBack();
                  actions.retakePhoto();
                }}
                white
                inverse
                ghost
              >
                Retake Photo
              </CelButton>
              <CelButton
                onPress={this.savePhoto}
                white
                margin="20 0 20 0"
                loading={isLoading}
                disabled={isLoading}
              >
                Use Photo
              </CelButton>
            </View>
          </View>
        </View>
      </RegularLayout>
    );
  }
}

export default ConfirmCamera;
