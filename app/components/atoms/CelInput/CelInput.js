import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import CelInputStyle from "./CelInput.styles";
import CelInputPassword from "./CelInputPassword";
import CelInputText from "./CelInputText";
import { getMargins } from "../../../utils/styles-util";
import CelSelect from "../../molecules/CelSelect/CelSelect";
import CelTextArea from "../CelTextArea/CelTextArea";
import CelText from "../CelText/CelText";
import { THEMES } from "../../../constants/UI";

class CelInput extends Component {
  static propTypes = {
    type: PropTypes.oneOf([
      "text",
      "password",
      "phone",
      "checkbox",
      "pin",
      "tfa",
      "number",
      "text-area",
    ]),
    autoFocus: PropTypes.bool,
    // autoComplete: // android only
    disabled: PropTypes.bool,
    maxLenght: PropTypes.number,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.oneOf([
      "default",
      "number-pad",
      "decimal-pad",
      "numeric",
      "email-address",
      "phone-pad",
    ]),
    returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
    style: PropTypes.oneOfType([
      PropTypes.instanceOf(Object),
      PropTypes.number,
    ]),
    autoCapitalize: PropTypes.oneOf([
      "none",
      "sentences",
      "words",
      "characters",
    ]),
    onChange: PropTypes.func, //
    autoCorrect: PropTypes.bool, //
    value: PropTypes.oneOfType([
      PropTypes.instanceOf(Object),
      PropTypes.string,
      PropTypes.number,
    ]), //
    field: PropTypes.string.isRequired, //
    error: PropTypes.string, //
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    margin: PropTypes.string,
    basic: PropTypes.bool,
    helperButton: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    large: PropTypes.bool,
    debounce: PropTypes.bool,
    border: PropTypes.bool,
    rightText: PropTypes.string,
    theme: PropTypes.oneOf(Object.values(THEMES)),
    showPasswordTooltip: PropTypes.bool,
    toolTipPositionTop: PropTypes.bool,
    showPassMeter: PropTypes.bool,
  };

  static defaultProps = {
    type: "text",
    keyboardType: "default",
    autoFocus: false,
    disabled: false,
    maxLenght: 100,
    autoCapitalize: "none",
    value: "",
    margin: "0 0 20 0",
    basic: false,
    large: true,
    debounce: false,
    border: false,
    rightText: null,
    showPasswordTooltip: false,
    toolTipPositionTop: true,
    showPassMeter: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };
  }

  onChangeText = text => {
    const { field, onChange, actions } = this.props;
    if (onChange) {
      onChange(field, text);
    } else {
      actions.updateFormField(field, text);
    }
  };

  onInputFocus = () => {
    const { onFocus } = this.props;
    if (onFocus) onFocus();
    this.setState({ active: true });
  };

  onInputBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) onBlur();
    this.setState({ active: false });
  };

  getInputStyle = () => {
    if (this.props.basic) return [];
    const { disabled, border, theme } = this.props;
    const cmpStyle = theme ? CelInputStyle(theme) : CelInputStyle();
    const { active } = this.state;
    const style = [cmpStyle.inputWrapper];
    if (active) style.push(cmpStyle.activeInput);
    if (disabled) style.push(cmpStyle.disabledInput);
    if (border) style.push(cmpStyle.borderView);

    return style;
  };

  renderInputByType = () => {
    const {
      type,
      value,
      helperButton,
      rightText,
      showPasswordTooltip,
      toolTipPositionTop,
      showPassMeter
    } = this.props;
    const inputStyle = this.getInputStyle();

    const borderBottom = value && showPassMeter && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }

    switch (type) {
      case "password":
        return (
          <View style={[inputStyle, borderBottom]}>
            <CelInputPassword
              {...this.props}
              showPasswordTooltip={showPasswordTooltip}
              toolTipPositionTop={toolTipPositionTop}
              showPassMeter={showPassMeter}
            />
          </View>
        );
      case "phone":
        return (
          <View
            style={[inputStyle, { flexDirection: "row", alignItems: "center" }]}
          >
            <CelSelect style={{ width: "auto" }} {...this.props} />
            <CelInputText
              style={{ flex: 1 }}
              {...this.props}
              field={`${this.props.field}.text`}
              value={typeof value === "string" ? value : ""}
              keyboardType={"phone-pad"}
            />
          </View>
        );
      case "text-area":
        return (
          <View style={[inputStyle, { height: "auto" }]}>
            <CelTextArea {...this.props} />
          </View>
        );
      case "text":
      default: {
        const helperButtonContainerStyle = helperButton
          ? { alignItems: "center", flexDirection: "row" }
          : {};
        const helperButtonInputStyle = helperButton ? { flex: 1 } : {};
        return (
          <View style={[inputStyle, helperButtonContainerStyle]}>
            <CelInputText {...this.props} style={helperButtonInputStyle} />
            {helperButton && helperButton()}
            {!!rightText && (
              <CelText style={CelInputStyle().rightText}>{rightText}</CelText>
            )}
          </View>
        );
      }
    }
  };

  render() {
    const { error, margin, large, theme } = this.props;
    const cmpStyle = theme ? CelInputStyle(theme) : CelInputStyle();
    const styleWrapper = [
      getMargins(margin),
      cmpStyle.container,
      cmpStyle.trans,
      large ? cmpStyle.fullScreen : {},
    ];
    const Input = this.renderInputByType;

    return (
      <View style={styleWrapper}>
        <Input />
        {!!error && (
          <CelText
            margin="5 0 0 0"
            color="red"
            align={"left"}
            type={"H6"}
            style={{
              flexWrap: "wrap",
              alignSelf: "flex-start",
              justifyContent: "center",
              paddingLeft: 5,
            }}
          >
            {error}
          </CelText>
        )}
      </View>
    );
  }
}

export default CelInput;
