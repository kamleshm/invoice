import React, { Component } from "react"

export default class PackDropDown extends Component {
    constructor(props) {
        super(props)
    }

    renderDropDowns = () => {
        const packarray = Array(this.props.pack).fill(0)
        return packarray.map((item,index) => {
            return (
                <option key = {index} value={index} >
                    {index}
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