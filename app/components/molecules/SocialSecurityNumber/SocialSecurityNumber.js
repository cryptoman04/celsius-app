import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import SocialSecurityNumberStyle from "./SocialSecurityNumber.styles";
import CelText from '../../atoms/CelText/CelText';
import CelInput from '../../atoms/CelInput/CelInputText';
import CelButton from '../../atoms/CelButton/CelButton';

let focused = 0;

@connect(
  state => ({
    user: state.user.profile,
    formData: state.forms.formData,
    formErrors: state.forms.formErrors
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class SocialSecurityNumber extends Component {

  static propTypes = {
    submitTaxpayerInfo: PropTypes.string,
  };
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

 

  componentDidMount() {
    const { actions, user } = this.props;
    actions.profileTaxpayerInfo();
    this.setState({ isLoading: false });
    this.initForm(user);
  }
   componentDidUpdate() {
    const { formData } = this.props;
    if (formData.ssn2 && formData.ssn2.length === 2 && focused < 2) { this.ssn3.focus(); focused = 2 }
    if (formData.ssn1 && formData.ssn1.length === 3 && focused < 1) { this.ssn2.focus(); focused = 1 }
  };

  initForm = (user) => {
    const { actions } = this.props;
    if (user) {
      if (this.isFromUS()) {
        actions.updateFormFields({ ssn: user.ssn });
      } else {
        actions.updateFormFields({
          itin: user.itin,
          national_id: user.national_id
        });
      }
    }
  };

  isFromUS = () => {
    const { formData, user } = this.props;

    let usCitizen = false;
    if (formData.citizenship.name === "United States" || formData.country.name === "United States") usCitizen = true;
    if (user.citizenship === 'United States' || user.country === 'United States') usCitizen = true
    return usCitizen;
  };

  submitTaxpayerInfo = async () => {
    const { actions, formData } = this.props;
    let updateTaxInfo;
    const errors = {};
    if (this.isFromUS()) {
      // TODO(ns): this if statement does nothing and is unnecessary, should be removed
      if ((!formData.ssn1 || formData.ssn1.length < 3) || (!formData.ssn2 || formData.ssn2.length < 2) || (!formData.ssn3 || formData.ssn3.length < 4)) {
        errors.ssn = "Please enter valid SSN."
        actions.setFormErrors(errors);
        return
      }

      updateTaxInfo = {
        ssn: formData.ssn1 + formData.ssn2 + formData.ssn3
      };


    } else {
      updateTaxInfo = {
        national_id: formData.national_id,
        itin: formData.itin
      };
    }
    this.setState({ updatingTaxInfo: true });
    const response = await actions.updateTaxpayerInfo(updateTaxInfo);

    if (response.success) {
      actions.navigateTo("KYCVerifyID");
    }

    this.setState({ updatingTaxInfo: false });
    // { console.log(updateTaxInfo, 'updateTaxInfo') }
  };

  render() {
    const { formData, formErrors } = this.props;
    const { updatingTaxInfo } = this.state;

    const style = SocialSecurityNumberStyle();
    // console.log(formData.ssn2)

    return (
      <View>
        {(this.isFromUS()) ?
          <View>
            <View style={style.ssnInput}>
              {/* <View style={{ flex: 1 }}> */}
                <CelInput
                  onFocus={this.ssnField}
                  large={false}
                  style={style.inputCel}
                  maxLenght={3}
                  keyboardType={'phone-pad'}
                  type={'number'}
                  margin="0 10 0 10"
                  field="ssn1"
                  placeholder="XXX"
                  value={formData.ssn1}
                  error={formErrors.ssn1}
                  refs={(input) => { this.ssn1 = input }}
                  onSubmitEditing={() => { this.ssn2.focus() }}
                  returnKeyType={"next"}
                />
              {/* </View> */}
              <CelText style={{ flex: 0.1 }}>
                {'-'}
              </CelText>
              <CelInput
                large={false}
                maxLenght={2}
                style={style.inputCel}
                keyboardType={'phone-pad'}
                type={'number'}
                margin="0 10 0 10"
                field="ssn2"
                placeholder="XX"
                value={formData.ssn2}
                error={formErrors.ssn2}
                refs={(input) => { this.ssn2 = input }}
                onSubmitEditing={() => { this.ssn3.focus() }}
                returnKeyType={"next"}
              />
              <CelText style={{ flex: 0.1 }}>
                {'-'}
              </CelText>
              <CelInput
                large={false}
                maxLenght={4}
                style={style.inputCel}
                keyboardType={'phone-pad'}
                type={'number'}
                margin="0 10 0 10"
                field="ssn3"
                placeholder="XXXX"
                value={formData.ssn3}
                error={formErrors.ssn3}
                refs={(input) => { this.ssn3 = input }}
              />
            </View>
            <View style={{ height: 40, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
              <CelText color='red' >{formErrors.ssn}</CelText>
            </View>
          </View>
          :
          <React.Fragment>
            <CelInput margin="20 0 20 0" type="text" field="itin" placeholder="E-International Tax ID Number (optional)"
              value={formData.itin} error={formErrors.itin} />
            <CelInput margin="0 0 30 0" type="text" field="national_id" placeholder="E-National ID Number (optional)"
              value={formData.national_id} error={formErrors.national_id} />
          </React.Fragment>
        }
        <View style={{ flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' }}>
          <CelButton
            onPress={() => this.submitTaxpayerInfo()}
            iconRight={"IconArrowRight"}
            iconRightHeight={"20"}
            iconRightWidth={"20"}
            loading={updatingTaxInfo}
          >
            {(this.isFromUS()) ?
              'Submit SSN' : 'Continue'}

          </CelButton>
        </View>
      </View>

    );
  }
}

export default SocialSecurityNumber
