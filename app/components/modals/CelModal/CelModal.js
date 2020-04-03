import React, { Component } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BlurView } from "@react-native-community/blur";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import { MODALS, THEMES } from "../../../constants/UI";
import CelModalStyle from "./CelModal.styles";
import Icon from "../../atoms/Icon/Icon";
import STYLES from "../../../constants/STYLES";
import ThemedImage from "../../atoms/ThemedImage/ThemedImage";

@connect(
  state => ({
    openedModal: state.ui.openedModal,
    theme: state.user.appSettings.theme,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class CelModal extends Component {
  static propTypes = {
    name: PropTypes.oneOf(Object.keys(MODALS)).isRequired,
    hasCloseButton: PropTypes.bool,
    picture: PropTypes.oneOfType([
      PropTypes.instanceOf(Object),
      PropTypes.number,
    ]),
    darkPicture: PropTypes.oneOfType([
      PropTypes.instanceOf(Object),
      PropTypes.number,
    ]),
    pictureDimensions: PropTypes.instanceOf(Object),
    onClose: PropTypes.func,
  };
  static defaultProps = {
    hasCloseButton: true,
    picture: null,
    pictureDimensions: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      modalPosition: { justifyContent: "flex-end" },
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({
      modalPosition: { justifyContent: "flex-start" },
    });
  };

  keyboardDidHide = () => {
    this.setState({
      modalPosition: { justifyContent: "flex-end" },
    });
  };

  getTintColor = () => {
    const { theme } = this.props;

    switch (theme) {
      case THEMES.DARK:
      case THEMES.CELSIUS:
        return {
          color: STYLES.COLORS.DARK_MODAL_OUTSIDE_BACKGROUND_COLOR,
          blur: 15,
        };
      case THEMES.LIGHT:
      default:
        return {
          color: STYLES.COLORS.LIGHT_MODAL_OUTSIDE_BACKGROUND_COLOR,
          blur: 12,
        };
    }
  };

  renderPicture = () => {
    const { picture, darkPicture, pictureDimensions } = this.props;
    const style = CelModalStyle();
    const pictureStyle = [style.pictureStyle, pictureDimensions];

    return (
      <View style={style.pictureWrapper}>
        <ThemedImage
          lightSource={picture}
          style={pictureStyle}
          resizeMode="contain"
          darkSource={darkPicture}
        />
      </View>
    );
  };

  renderClose = () => {
    const { actions, onClose } = this.props;
    const style = CelModalStyle();

    return (
      <TouchableOpacity
        style={style.closeBtn}
        onPress={() => {
          if (onClose) onClose();
          actions.closeModal();
        }}
      >
        <Icon
          name="Close"
          height="15"
          width="15"
          viewBox="0 0 1000 1000"
          fill={"#3D4853"}
          marginTop={20}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const {
      openedModal,
      name,
      actions,
      children,
      picture,
      hasCloseButton,
      onClose,
    } = this.props;
    const { modalPosition } = this.state;
    const style = CelModalStyle();
    const tintColor = this.getTintColor();

    return (
      <Modal
        animationType="fade"
        transparent
        onRequestClose={() => actions.closeModal()}
        visible={openedModal === name}
      >
        <View style={[style.wrapper, modalPosition]}>
          <View style={style.modal}>
            <View style={{ height: picture || hasCloseButton ? 50 : 0 }}>
              {!!hasCloseButton && this.renderClose()}
              {!!picture && this.renderPicture()}
            </View>
            {children}
          </View>
          {Platform.OS === "ios" && (
            <BlurView
              blurType={tintColor.color}
              blurAmount={tintColor.blur}
              style={[StyleSheet.absoluteFill]}
            />
          )}
          <TouchableOpacity
            style={style.outsideCloseModal}
            onPress={() => {
              if (!hasCloseButton) return;
              if (onClose) {
                onClose();
              }
              actions.closeModal();
            }}
          />
        </View>
      </Modal>
    );
  }
}

export default CelModal;
