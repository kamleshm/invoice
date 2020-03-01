import React, { Component } from "react"
import Invoice from "./components/maincontent/Invoice";


class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Invoice />
      </div>
    )
  }
}

export default App;
