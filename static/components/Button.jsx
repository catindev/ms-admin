import React, {Component} from 'react'

export default class Button extends Component {
    render () {
        return (
            <button type={this.props.type} className={"btn " + this.props.btnClass}>
                {this.props.title}
            </button>
        )
    }
}