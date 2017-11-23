import React, { Component } from 'react'

class TextInput extends Component {
  render() {
      return (
        <div className='form-group'>
          <label htmlFor={this.props.name}>{this.props.label}</label>
          <input
          type={this.props.type}
          className={this.props.class}
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange}
          />
        </div>
      )
  }
}

export default TextInput;
