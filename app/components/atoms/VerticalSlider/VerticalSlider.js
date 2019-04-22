import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Slider } from 'react-native';

import testUtil from "../../../utils/test-util";

import VerticalSliderStyle from "./VerticalSlider.styles";
import STYLES from '../../../constants/STYLES';

class VerticalSlider extends Component {
  static propTypes = {
    items: PropTypes.instanceOf(Array),
    field: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    updateFormField: PropTypes.func,
  };
  static defaultProps = {}

  handleChangeSlideValue = (value) => {
    const { onChange, updateFormField, field } = this.props

    if (onChange) {
      onChange(field, value)
    } else {
      updateFormField(field, value)
    }
  }

  render() {
    const { items, value } = this.props;
    const style = VerticalSliderStyle();

    const height = (items.length - 1) * 56
    const values = items.map(i => i.value);

    return (
      <View style={style.container}>
        <View style={{ height, width: 40, paddingVertical: 10 }}>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <Slider
              minimumTrackTintColor={STYLES.COLORS.CELSIUS_BLUE}
              maximumTrackTintColor={STYLES.COLORS.DARK_GRAY_OPACITY}
              style={{ width: height, height: 40 }}
              orientation="vertical"
              minimumValue={0}
              maximumValue={items.length - 1}
              step={1}
              value={values.indexOf(value)}
              onValueChange={this.handleChangeSlideValue}
            />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {items.map((item) => (
            <TouchableOpacity
              key={`value-${item}`}
              style={{ height: 50, justifyContent: 'center' }}
              onPress={() => this.handleChangeSlideValue(item.value)}
            >
              { item.label }
            </TouchableOpacity>
          ))}
        </View>
      </View >
    );
  }
}

export default testUtil.hookComponent(VerticalSlider);
