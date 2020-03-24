import React, { Component } from "react";
import { ScrollView, SafeAreaView, RefreshControl, View, Platform } from "react-native";
import PropTypes from "prop-types";
import { withNavigationFocus } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";

import RegularLayoutStyle from "./RegularLayout.styles";
import { getPadding } from "../../../utils/styles-util";
import { FAB_TYPE } from "../../../constants/UI";
import KeyboardShift from "../../atoms/KeyboardShift/KeyboardShift";
import OfflineMode from "../../atoms/OfflineMode/OfflineMode";
import Spinner from "../../atoms/Spinner/Spinner";

@connect(
  state => ({
    internetConnected: state.app.internetConnected,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class RegularLayout extends Component {
  static propTypes = {
    padding: PropTypes.string,
    enableParentScroll: PropTypes.bool,
    fabType: PropTypes.oneOf(FAB_TYPE),
    refreshing: PropTypes.bool,
    pullToRefresh: PropTypes.func,
  };

  static defaultProps = {
    padding: "20 20 100 20",
    enableParentScroll: true,
    fabType: "main",
  };
  componentDidMount = () => this.setFabType();
  componentDidUpdate = () => this.setFabType();

  setFabType = () => {
    const { isFocused, fabType, actions } = this.props;
    if (isFocused === true) {
      actions.setFabType(fabType);
    }
  };

  render() {
    const {
      theme,
      children,
      padding,
      enableParentScroll,
      internetConnected,
      refreshing,
      pullToRefresh,
    } = this.props;
    const style = RegularLayoutStyle(theme);
    const paddings = getPadding(padding);

    return (
      <React.Fragment>
        {refreshing && (
          <View style={style.loaderView}>
            {Platform.OS === "ios" && <Spinner />}
          </View>
        )}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          scrollEnabled={enableParentScroll}
          style={style.container}
          contentContainerStyle={[{ flexGrow: 1 }, paddings]}
          refreshControl={
            pullToRefresh && (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={pullToRefresh}
                tintColor="transparent"
                colors={["transparent"]}
                style={{ backgroundColor: "transparent" }}
              />
            )
          }
        >
          <SafeAreaView style={{ flex: 1 }}>
            {!internetConnected ? (
              <OfflineMode />
            ) : (
              <KeyboardShift>
                <>{children}</>
              </KeyboardShift>
            )}
          </SafeAreaView>
        </ScrollView>
      </React.Fragment>
    );
  }
}

export default withNavigationFocus(RegularLayout);
