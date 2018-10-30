import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import {bindActionCreators} from "redux";
import { lookup } from "country-data";

import * as appActions from "../../../redux/actions";
import { GLOBAL_STYLE_DEFINITIONS as globalStyles } from "../../../config/constants/style";
import { GENDER, PERSON_TITLE } from "../../../config/constants/common";
import Icon from "../../atoms/Icon/Icon";
import SelectCountryModal from "../../organisms/SelectCountryModal/SelectCountryModal";
import InputErrorWrapper from "../../atoms/InputErrorWrapper/InputErrorWrapper";
import testUtil from "../../../utils/test-util";

@connect(
  () => ({}),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class CelSelect extends Component {
  static propTypes = {
    theme: PropTypes.oneOf(['blue', 'white']),
    type: PropTypes.oneOf(['gender', 'title', 'country', 'native']),
    // array of { label, value } objects
    items: PropTypes.instanceOf(Array),
    value: PropTypes.oneOfType([
      PropTypes.instanceOf(Object),
      PropTypes.string,
    ]),
    field: PropTypes.string,
    testSelector: PropTypes.string,
    error: PropTypes.string,
    labelText: PropTypes.string,
    margin: PropTypes.string,
  }
  static defaultProps = {
    type: 'native',
    value: '',
    field: '',
    items: [],
    labelText: '',
    theme: 'blue',
    margin: '0 0 15 0',
  }

  constructor(props) {
    super(props);

    let items;

    switch (props.type) {
      case 'title':
        items = PERSON_TITLE;
        break;
      case 'gender':
        items = GENDER;
        break;
      default:
        items = props.items;
    }

    this.state = {
      visible: false,
      items,
      value: undefined,
    };
  }

  // lifecycle methods
  componentWillReceiveProps(nextProps) {
    const { value, type } = this.props;
    const { items } = this.state;

    if (nextProps.value && value !== nextProps.value) {
      let item;
      if (type === 'country') {
        item = lookup.countries({name: nextProps.value})[0]
      } else {
        item = items.filter(i => i.value === nextProps.value)[0];
      }

      this.setState({ value: item });
    }
  }

  // event hanlders
  selectValue = (item) => {
    const { actions, field, type } = this.props;
    if (item) {
      if (type === 'country') {
        actions.updateFormField(field, item.name);
      } else {
        actions.updateFormField(field, item.value);
      }
    }
    this.setState({ visible: false });
  };

  handlePickerSelect = (value) => {
    const { actions, field } = this.props;
    if (value) {
      actions.updateFormField(field, value);
    }
  };

  renderSelect() {
    const { theme, labelText, error, margin } = this.props;
    const { visible, value } = this.state;

    const label = value && labelText ? labelText.toUpperCase() : labelText;
    const labelStyles = value ? [globalStyles.selectLabelActive] : [globalStyles.selectLabelInactive];
    labelStyles.push(globalStyles[`${theme}InputTextColor`]);

    const inputBackground = value ? globalStyles[`${theme}InputWrapperActive`] : globalStyles[`${theme}InputWrapper`];
    
    return (
      <InputErrorWrapper
        theme={theme}
        error={error}
        margin={margin}
      >
        <TouchableOpacity
         ref={testUtil.generateTestHook(this, 'CelSelect.fillName')}
          onPress={() => this.setState({ visible: !visible })}
          style={[globalStyles.inputWrapper, globalStyles[`${theme}InputWrapper`], inputBackground]}>
          <Text style={labelStyles}>{label}</Text>
          <Text style={[globalStyles.input, globalStyles.nonPasswordInputStyle, globalStyles[`${theme}InputTextColor`]]}>
            {value && (value.label || value.name)}
          </Text>
          <View style={ globalStyles.inputIconRight }>
            <Icon name='CaretDown' height='9' width='15' fill={globalStyles[`${theme}InputTextColor`].color} />
          </View>
        </TouchableOpacity>
      </InputErrorWrapper>
    );
  }

  // rendering methods
  render() {
    const { type } = this.props;
    const { visible, items, value } = this.state;

    return (
      <View>
        { type !== 'country' ?
          <RNPickerSelect
            items={items}
            onValueChange={this.handlePickerSelect}
            value={value ? value.value : null}>
            {this.renderSelect()}
          </RNPickerSelect> :
          this.renderSelect()
        }
        { type === 'country' &&
        <SelectCountryModal
          visible={ visible }
          onClose={ this.selectValue }
        />
        }
      </View>
    );
  }
}

export default testUtil.hookComponent(CelSelect);


