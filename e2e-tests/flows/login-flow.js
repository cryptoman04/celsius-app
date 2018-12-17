import store from '../../app/redux/store';
import * as actions from '../../app/redux/actions';
import { resetTests, callToComplete, containsText, findComponent} from "../helpers";
import constants from "../constants";
import ACTIONS from "../../app/config/constants/ACTIONS";
import API from "../../app/config/constants/API";


const { dispatch, getState } = store;

export default {
  successfulFlow,

  // Welcome screen
  initFlow,
  
  // Login screen
  forgottenPassword,
  disableWhenNoLoginData,
  disableWhenNoEmail,
  disableWhenNoPassword,
  errWhenWrongCredentials,
  errUserDoesNotExists,
  loginSuccess,

  // LoginPasscode screen

  // ForgottenPassword screen
  forgottenPasswordErrWrongEmail,
  forgottenPasswordErrWrongEmailFormat,
  forgottenPasswordSuccessMsg,
}

function successfulFlow(spec) {
  return async () => {
    await resetTests(spec);
    // loginSetup();

    await spec.press('Welcome.skipButton')
    dispatch(actions.navigateTo('Login'))

    await spec.fillIn('CelTextInput.email', 'filip.jovakaric+wlt@mvpworkshop.co')
    await spec.fillIn('CelTextInput.pass','filip123')
		await spec.press('LoginForm.button')

    // await spec.pause(5000)
    await callToComplete(API.LOGIN_BORROWER)

    // await spec.exists('WalletLayout.home')
    await spec.exists('WalletBalance.screen')
    
    // await spec.press('TodayRatesModal.popUP')
  }
}

function initFlow(spec) {
  return async () => {
    await resetTests(spec);

    await spec.press('Welcome.skipButton')
    await spec.exists('SignupOne.screen')

    await spec.press('SignupOne.loginButton')
    await spec.exists('Login.screen')
    // dispatch(actions.navigateTo('Login'))
  }
}

function forgottenPassword(spec) {
  return async () => {
    await resetTests(spec);
    loginSetup();

    await spec.press('LoginScreen.forgotPassword')
    await spec.exists('ForgottenPassword.getResetLink')  
  }
}

export function loginSetup() {
  dispatch(actions.navigateTo('Login'))
}

function disableWhenNoLoginData(spec) {
  return async () => {	
    await resetTests(spec);
    await loginSetup()

		const btn = await spec.findComponent('LoginForm.button')
    if (!btn.props.disabled) {
      throw new Error(`Login Button enabled`);
    }
	}
}

function disableWhenNoEmail(spec) {
	return async () => {
    await resetTests(spec);		
    await loginSetup() 

		// await spec.pause(3000)
    await spec.fillIn('CelTextInput.pass','filip123')

		const btn = await spec.findComponent('LoginForm.button')
    if (!btn.props.disabled) {
      throw new Error(`Login Button enabled`);
    }
	}
}

function disableWhenNoPassword(spec) {
	return async () => {
    await resetTests(spec);
		loginSetup() 

		await spec.fillIn('CelTextInput.email', 'filip.jovakaric+wlt@mvpworkshop.co')

		// await spec.pause(2000)
		const btn = await spec.findComponent('LoginForm.button')
    if (!btn.props.disabled) {
      throw new Error(`Login Button enabled`);
    }
	}
}

function errWhenWrongCredentials(spec) {
	return async () => {
    await resetTests(spec); 
		loginSetup() 

		// await spec.pause(9000)
    await spec.fillIn('CelTextInput.pass','filip1234')
		await spec.fillIn('CelTextInput.email', 'filip.jovakaric+wlt@mvpworkshop.co')
		await spec.press('LoginForm.button')

    const text = await spec.findComponent('Message.msg');
    await containsText(text, `Uhoh, looks like your username or password don't match.`);

    // await spec.notExists('WalletLayout.home')
    await spec.notExists('WalletBalance.screen')
	}
}

function errUserDoesNotExists(spec) {
	return async () => {
    await resetTests(spec);
		loginSetup() 

		await spec.fillIn('CelTextInput.email', 'filip.jovakaric+wlt11122313@mvpworkshop.co')
    await spec.fillIn('CelTextInput.pass','filip1234')
    await spec.press('LoginForm.button')

    const text = await spec.findComponent('Message.msg');
    await containsText(text, `Uhoh, looks like your username or password don't match.`);

    // await spec.notExists('WalletLayout.home')
    await spec.notExists('WalletBalance.screen')
	}
}

function loginSuccess(spec) { 
	return async () => {
    await resetTests(spec);
		loginSetup() 

		await spec.fillIn('CelTextInput.email', 'filip.jovakaric+wlt@mvpworkshop.co')
    await spec.fillIn('CelTextInput.pass','filip123')
		await spec.press('LoginForm.button')

		// await spec.pause(5000)
    // await spec.exists('WalletLayout.home')
    await callToComplete(API.LOGIN_BORROWER)
    await spec.notExists('WalletBalance.screen')
	}
}

// ForgottenPassword screen tests
function forgottenPasswordSetup() {
  dispatch(actions.navigateTo('ForgottenPassword'))
}

function forgottenPasswordErrWrongEmail(spec) {
  return async () => {
    await resetTests(spec);
    forgottenPasswordSetup()

    dispatch(actions.updateFormField('email','filip.jovakaric+wl111t@mvpworkshop.co'))
    await spec.press('ForgottenPassword.getResetLink')

    const text = await spec.findComponent('Message.msg');
    await containsText(text, `Sorry, but it looks like this user doesn't exist.`);
  }
}

function forgottenPasswordErrWrongEmailFormat(spec) {
  return async () => {
    await resetTests(spec);
    forgottenPasswordSetup();
    // await spec.press('Welcome.skipButton')
    // dispatch(actions.navigateTo('Login'))
    // await spec.press('LoginScreen.forgotPassword')

    dispatch(actions.updateFormField('email','filip.jovakap.co'))
    await spec.press('ForgottenPassword.getResetLink')

    const text = await spec.findComponent('Message.msg');
    await containsText(text, `Oops, looks like you didn't enter something right.`);
  }
}

function forgottenPasswordSuccessMsg(spec) {
  return async () => {
    await resetTests(spec);
    forgottenPasswordSetup();

    // await spec.press('Welcome.skipButton')
    // dispatch(actions.navigateTo('Login'))
    // await spec.press('LoginScreen.forgotPassword')

    dispatch(actions.updateFormField('email','filip.jovakaric+wlt@mvpworkshop.co'))
    await spec.press('ForgottenPassword.getResetLink')

    const text2 = await spec.findComponent('Message.msg');
      await containsText(text2, `Email sent!`);
  }
}