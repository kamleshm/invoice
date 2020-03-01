import React, { Component } from "react"

export default class DropDown extends Component {
    constructor(props) {
        super(props)
    }

    renderDropDowns = () => {
        return this.props.property.map((item,index) => {
            return (
                <option key = {index} value={item} >
                    {item}
                </option>
            )
        })
    }
    render() {
        return (
            <td>
                <select className="bill-drop-down" value={this.props.value} onChange = {this.props.onChangeValue}>
                    {this.renderDropDowns()}
                </select>
            </td>
        )
    }
}