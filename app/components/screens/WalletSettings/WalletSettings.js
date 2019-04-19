import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Platform, Switch } from "react-native";

import testUtil from '../../../utils/test-util'
import * as appActions from '../../../redux/actions'
// import WalletSettingsStyle from "./WalletSettings.styles";
import RegularLayout from '../../layouts/RegularLayout/RegularLayout'
import Separator from '../../atoms/Separator/Separator'
import IconButton from '../../organisms/IconButton/IconButton'
import STYLES from '../../../constants/STYLES'
import apiUtil from "../../../utils/api-util";
import API from "../../../constants/API";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Spinner from "../../atoms/Spinner/Spinner";

@connect(
  state => ({
    appSettings: state.user.appSettings,
    formData: state.forms.formData,
    callsInProgress: state.api.callsInProgress,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class WalletSettings extends Component {
  static propTypes = {
    // text: PropTypes.string
  }
  static defaultProps = {}

  static navigationOptions = () => ({
    title: 'Wallet'
  })

  componentDidMount () {
    const { actions } = this.props
    actions.getUserAppSettings()
  }

  changeInterestEarn = () => {
    const { actions, appSettings } = this.props
    actions.setUserAppSettings({ interest_in_cel: !appSettings.interest_in_cel })
  }

  rightSwitch = () => {
    const { appSettings, callsInProgress } = this.props
    const isIos = Platform.OS === 'ios'
    const falseColor = isIos ? "transparent" : STYLES.COLORS.DARK_GRAY3;
    const loading = apiUtil.areCallsInProgress([API.SET_APP_SETTINGS], callsInProgress);
    return loading ? (
      <Spinner size={30} />
    ) : (
      <Switch
        value={appSettings.interest_in_cel}
        disabled
        thumbColor={STYLES.COLORS.WHITE}
        ios_backgroundColor={STYLES.COLORS.DARK_GRAY3}
        trackColor={{ false: falseColor, true: STYLES.COLORS.GREEN }}
      />
    )
  }

  render () {
    const { callsInProgress } = this.props

    const loading = apiUtil.areCallsInProgress([API.GET_APP_SETTINGS], callsInProgress);
    if (loading) return <LoadingScreen />

    return (
      <RegularLayout>
        {/* <IconButton right={<CelText>USD</CelText>}>Default currency</IconButton>
        <IconButton margin='0 0 20 0'>Default view</IconButton> */}
        <Separator text='INTEREST' />

        <IconButton
          margin={"20 0 20 0"}
          right={this.rightSwitch()}
          hideIconRight
          onPress={() => this.changeInterestEarn()}
        >
          Earn interest in CEL
        </IconButton>
      </RegularLayout>
    )
  }
}

export default testUtil.hookComponent(WalletSettings)