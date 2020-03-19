import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as appActions from "../../../redux/actions";

import EmptyStateStyle from "./EmptyState.styles";
import CelText from "../CelText/CelText";
import CelButton from "../CelButton/CelButton";
import { EMPTY_STATES, MODALS } from "../../../constants/UI";
import ContactSupport from "../ContactSupport/ContactSupport";
import emptyStateUtil from "../../../utils/empty-state-util";
import STYLES from "../../../constants/STYLES";

@connect(
  state => ({
    user: state.user.profile,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class EmptyState extends Component {
  static propTypes = {
    purpose: PropTypes.oneOf(Object.keys(EMPTY_STATES)),
    aboveHeadingSection: PropTypes.element,
    heading: PropTypes.string,
    paragraphs: PropTypes.instanceOf(Array),
    button: PropTypes.string,
    onPress: PropTypes.func,
    support: PropTypes.bool,
    modal: PropTypes.element,
    secondaryButton: PropTypes.string,
    secondaryOnPress: PropTypes.func,
    image: PropTypes.string,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = emptyStateUtil.getProps(props.purpose, props);
  }

  renderAboveHeadingSection() {
    const { actions } = this.props;
    const emptyStateProps = {
      ...this.state,
      ...this.props,
    };
    const { aboveHeadingSection } = emptyStateProps;

    switch (aboveHeadingSection) {
      case "kyc-rejected":
        return (
          <CelButton
            onPress={() =>
              actions.openModal(MODALS.KYC_REJECTION_REASONS_MODAL)
            }
            basic
            textColor={STYLES.COLORS.RED}
            iconRight={"IconChevronRight"}
            iconRightHeight={"13"}
            iconRightWidth={"12"}
            iconRightColor={STYLES.COLORS.RED}
          >
            Identity verification failed
          </CelButton>
        );
      case "kyc-pending":
        return (
          <CelText
            margin="0 0 0 0"
            align="center"
            type="H3"
            weight={"500"}
            color={STYLES.COLORS.ORANGE}
          >
            Identity Confirmation in Progress
          </CelText>
        );
      default:
        return null;
    }
  }

  render() {
    const emptyStateProps = {
      ...this.state,
      ...this.props,
    };
    const {
      heading,
      paragraphs,
      onPress,
      button,
      support,
      secondaryButton,
      secondaryOnPress,
      image,
    } = emptyStateProps;
    const style = EmptyStateStyle();

    return (
      <View style={style.container}>
        {this.renderAboveHeadingSection()}

        {image && (
          <View style={[style.circle]}>
            <Image source={image} style={style.image} />
          </View>
        )}

        <CelText margin="20 0 15 0" align="center" type="H2" weight={"bold"}>
          {heading}
        </CelText>

        {paragraphs &&
          paragraphs.map(paragraph => (
            <CelText
              margin="5 0 15 0"
              align="center"
              type="H4"
              weight={"300"}
              key={paragraph}
            >
              {paragraph}
            </CelText>
          ))}

        {button && onPress ? (
          <CelButton margin="10 0 10 0" onPress={onPress}>
            {button}
          </CelButton>
        ) : null}

        {secondaryButton && secondaryOnPress ? (
          <CelButton basic margin="10 0 10 0" onPress={secondaryOnPress}>
            {secondaryButton}
          </CelButton>
        ) : null}

        {support ? <ContactSupport /> : null}
      </View>
    );
  }
}

export default EmptyState;
