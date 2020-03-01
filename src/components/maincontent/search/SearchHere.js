import React, { Component } from "react"

export default class SearchHere extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="search-string">
                <form onSubmit={this.handleSubmit}>
                    <label >
                        <div id="search-box">
                        <input id="search-input-string" type="text" placeholder="Enter item name" value={this.props.value} onChange={this.props.onValueChange} />
                        <div id="search-button" onClick={this.props.onSearchString}>Search</div>
                        </div>
                    </label>
                </form>
            </div>
        )
    }
}