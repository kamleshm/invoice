import React, { Component } from "react"

export default class ShowSearchResults extends Component {
    constructor(props) {
        super(props)
    }
    handleDisplayResults = () => {
        let a = this.props.results.map((item, index) => {
                return (<tr key={index} onClick={() => {this.props.onItemSelection(item)}}>
                    <td>{index}</td>
                    <td>{item.barcode}</td>
                    <td>{item.name}</td>
                    <td>{item.pack}</td>
                    <td>{item.expirydate}</td>
                    <td>{item.batch}</td>
                    <td>{item.price}</td>
                    <td>{item.brand}</td>
                    <td>{item.shelf}</td>
                </tr>)
            })
        return a
    }

    renderTableHeader = () => {
        let header = ['id','barcode','itemname','specs','expdate','batchno','price','brand','shelf']
        const headermap = {
            id: "Serial No.", barcode: 'Barcode', itemname: 'Item Name', specs: 'Pack',
            expdate: 'Expiry Date', batchno: 'Batch', price: 'Price', brand: 'Brand', shelf: 'Shelf'
        }
        return header.map((key, index) => {
            return <th key={index}> {headermap[key]}</th>
        })
    }

    render() {
        return (
            <div id="results-list">
                <table id="results-item-list">
                    <tbody>
                    <tr>
                        {this.renderTableHeader()}
                    </tr>
                    {this.handleDisplayResults()}
                    </tbody>
                </table>        
            </div>
        )
    }
}