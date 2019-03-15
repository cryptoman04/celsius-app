// TODO(fj): init segment in app actions (removed from App.v2.js)
// TODO(fj): move handle app state change to app action (removed logic from App.v2.js)
// TODO(fj): move app loading assets to app action (removed logic from App.v2.js)
// TODO(fj): merge App and MainLayout?

// TODO(fj): create offline and no internet screens or a static screen with type?

import React, { Component } from 'react';
import { AppLoading } from 'expo';
import { Provider } from 'react-redux';
import { AppState, BackHandler } from "react-native";

import store from './redux/store';
import * as actions from './redux/actions';
import appUtil from './utils/app-util';
import AppNavigation from './navigator/Navigator';
import FabMenu from './components/organisms/FabMenu/FabMenu';
import Message from "./components/molecules/Message/Message";
import logger from './utils/logger-util';

appUtil.initializeThirdPartyServices()

export default class App extends Component {
  constructor() {
    super();
    this.state = { isReady: false };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => store.dispatch(actions.navigateBack()));
    AppState.addEventListener('change', actions.handleAppStateChange);
  }
  componentWillUnmount() {
    this.backHandler.remove();
    AppState.removeEventListener('change');
  }

  initApp = async () => await store.dispatch(await actions.loadCelsiusAssets());

  render() {
    const { isReady } = this.state;

    return !isReady ? (
      <AppLoading
        startAsync={async () => await this.initApp()}
        onFinish={() => this.setState({ isReady: true })}
        onError={error => logger.log(error)}
      />
    ) : (
        <CelsiusApplication />
      )
  }
}

const CelsiusApplication = () => (
  <Provider store={store}>
    <React.Fragment>
      <Message />
      <AppNavigation
        ref={navigatorRef => actions.setTopLevelNavigator(navigatorRef)}
      />
      <FabMenu />
    </React.Fragment>
  </Provider>
)
