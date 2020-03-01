import React, { Component } from "react"
import InvoiceRow from './bill/InvoiceRow'
import axios from 'axios'
import Billing from "./bill/Billing"
import { Link } from 'react-router-dom'
export default class Invoice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            mobile: "",
            inputcode: "",
            grandtotal: 0,
            address: "",
            customerExists: false,
            itemadded: null
        }
        this.invoiceprice = []
        this.invoicedirectory = {}
        this.proxy = 'https://cors-anywhere.herokuapp.com/'
        this.url = 'http://shuttrbiilingsystem-env.fmp2fauppm.ap-south-1.elasticbeanstalk.com/'
        this.timer = null;
    }

    handleNameChange = (event) => {
        this.setState({ name: event.target.value });
    }

    handleMobileNumberChange = (event) => {
        console.log("handlemobilechange")
        this.setState({
            mobile: event.target.value,
            customerExists: false
        });
        if (this.timer != null) {
            this.timer = clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => { this.handleMobileSearch() }, 1000);
    }

    handleMobileSearch = () => {
        let apistring = this.url + 'customer/mobile/' + this.state.mobile
        axios.get(this.proxy + apistring)
            .then(response => {
                if (response.status === 200 && response.data.length > 0) {
                    this.setState({
                        name: response.data[0].name,
                        address: response.data[0].address,
                        customerExists: true
                    })
                }
            }
                , (error) => {
                    console.log(error)
                }
            );
    }

    handleAddressChange = (event) => {
        this.setState({ address: event.target.value });
    }

    handlerowchange = (event) => {
        this.setState({ inputcode: event.target.value });
    }

    handlekeypress = async (e) => {
        if (e.key === 'Enter') {
            if (this.state.inputcode.length === 0) {
                alert("Empty Field!!")
                this.setState({ inputcode: '' })
                return
            }
            let srno = this.invoiceprice.length
            var status = await this.fillInvoiceInventory(this.state.inputcode, srno)
            if (!status) {
                alert("Item Not Found!!")
                this.setState({ inputcode: '' })
                return
            }
            let details = {
                price: this.invoicedirectory[srno].price[0],
                id: this.invoicedirectory[srno].id[0],
                quantity: 1,
                identity: 0,
                partial: this.invoicedirectory[srno].partial[0],
                billpartial: 0,
                billquantity: 1
            }

            this.invoiceprice.push(details)
            let sum = 0
            for (let i = 0; i < this.invoiceprice.length; i++) {
                if (this.invoiceprice[i] != null) {
                    sum = sum + this.invoiceprice[i].price
                }
            }
            this.setState({
                grandtotal: sum
            })
            this.setState({ inputcode: '' })
        }
    }

    request = async (code) => {
        let apistring = this.url + 'inventory/barcode/' + code
        const json = await fetch(this.proxy + apistring)
            .then(response => response.json());
        return json;
    }

    fillInvoiceInventory = async (eancode, srno) => {
        var itemlist = []
        itemlist = await this.request(eancode)
        if (itemlist.length === 0) {
            return false
        }
        let item = {
            id: [],
            barcode: itemlist[0].barcode,
            itemname: itemlist[0].name,
            specs: itemlist[0].specification,
            pack: [],
            expdate: [],
            batchno: [],
            price: [],
            quantity: [],
            partial: [],
            brand: itemlist[0].brand
        }
        itemlist.map((prd, index) => {
            item.id.push(prd.id)
            item.pack.push(prd.pack)
            item.expdate.push(prd.expirydate)
            item.batchno.push(prd.batch)
            item.price.push(prd.price)
            item.quantity.push(prd.quantity)
            item.partial.push(prd.partial)
            return null
        })
        this.invoicedirectory[srno] = item
        return true
    }

    renderTableHeader = () => {
        let header = ['id', 'barcode', 'itemname', 'specs', 'pack', 'expdate', 'batchno', 'price', 'brand', 'quantity', 'totprice']
        const headermap = {
            id: "Serial No.", barcode: 'Barcode', itemname: 'Item Name', specs: 'Specification', pack: 'Pack', brand: 'Brand',
            expdate: 'Expiry Date', batchno: 'Batch', price: 'Price', quantity: 'Quantity', totprice: 'Total Price'
        }
        return header.map((key, index) => {
            return <th key={index}> {headermap[key]}</th>
        })
    }

    handlePriceChange = (index, price, id, quantity, identity, partial, billpartial, billquantity) => {
        let details = {
            price: price,
            id: id,
            quantity: quantity,
            identity: identity,
            partial: partial,
            billpartial: billpartial,
            billquantity: billquantity
        }
        this.invoiceprice[index] = details
        let sum = 0
        for (let i = 0; i < this.invoiceprice.length; i++) {
            if (this.invoiceprice[i] != null) {
                sum = sum + this.invoiceprice[i].price
            }
        }
        this.setState({
            grandtotal: sum
        })
    }

    renderInvoiceData = () => {
        let renderdata = []
        let counter = 1
        Object.keys(this.invoicedirectory).forEach((index) => {
            renderdata.push(
                <InvoiceRow key={index} counter={counter} onItemTrash={this.handleTrashItem}
                    identity={this.invoiceprice[index].identity} item={this.invoicedirectory[index]}
                    srno={index} onChangePrice={this.handlePriceChange} quantity={this.invoiceprice[index].billquantity}
                    partial={this.invoiceprice[index].billpartial} />
            )
            counter = counter + 1
        })
        return renderdata
    }

    handleTrashItem = (srno) => {
        delete this.invoicedirectory[srno]
        this.invoiceprice[srno] = null
        let sum = 0
        for (let i = 0; i < this.invoiceprice.length; i++) {
            if (this.invoiceprice[i] != null) {
                sum = sum + this.invoiceprice[i].price
            }
        }
        this.setState({
            grandtotal: sum
        })
    }

    handleItemAdd = async (item) => {
        let srno = this.invoiceprice.length
        var status = await this.fillInvoiceInventory(item.barcode, srno)
        if (!status) {
            alert("Item Not Found!!")
            return
        }
        let id = this.invoicedirectory[srno].batchno.indexOf(item.batch)
        let details = {
            price: this.invoicedirectory[srno].price[id],
            id: this.invoicedirectory[srno].id[id],
            quantity: 1,
            identity: id,
            partial: this.invoicedirectory[srno].partial[id],
            billpartial: 0,
            billquantity: 1,
        }
        this.invoiceprice.push(details)
    }

    async componentDidMount() {
        if (this.props.location.state != undefined) {
            this.setState({
                mobile: this.props.location.state.mobile,
                name: this.props.location.state.name,
                address: this.props.location.state.address,
                customerExists: this.props.location.state.customerExists,
            })
            this.invoiceprice = this.props.location.state.invoiceprice
            this.invoicedirectory = this.props.location.state.invoicedirectory
            if (this.props.location.state.itemadded != null) {
                await this.handleItemAdd(this.props.location.state.itemadded)
            }
        }

        let sum = 0
        for (let i = 0; i < this.invoiceprice.length; i++) {
            if (this.invoiceprice[i] != null) {
                sum = sum + this.invoiceprice[i].price
            }
        }
        this.setState({
            grandtotal: sum
        })
    }

    fillBill = async () => {
        for (let i = 0; i < this.invoiceprice.length; i++) {
            await axios.post(this.proxy + this.url + 'bill', {
                billid: 1234,
                id: this.invoiceprice[i].id,
                quantity: this.invoiceprice[i].billquantity,
                partial: this.invoiceprice[i].billpartial,
                price: this.invoiceprice[i].price,
                mobile: this.state.mobile
            })
                .then(
                    async (response) => {
                        if (response.status === 200) {
                            axios.post(this.proxy + this.url + 'inventory/quantity', {
                                quantity: this.invoiceprice[i].quantity,
                                id: this.invoiceprice[i].id
                            })
                            axios.post(this.proxy + this.url + 'inventory/partial', {
                                partial: this.invoiceprice[i].partial,
                                id: this.invoiceprice[i].id
                            })

                        }
                        else {
                            alert("Something went wrong while editing inventory")
                        }
                    },
                    (error) => {
                        alert("Server Problem while editing inventory")
                    }
                )
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.state.customerExists === false) {
            await axios.post(this.proxy + this.url + 'customer', {
                mobile: this.state.mobile,
                name: this.state.name,
                address: this.state.address
            })
                .then(
                    async (response) => {
                        if (response.status === 200) {
                            await this.fillBill()
                            alert("Billing Completed!!")
                            window.location.reload();
                            return;
                        }
                    }
                )
                .catch(
                    (error) => { console.log(error) }
                )
            return;
        }
        await this.fillBill()
        alert("Billing Completed!!")
        window.location.reload();
        return
    }

    handleSubmitKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    handleItemAddtion = (item) => {
        if (this.state.itemadded != null) {
            alert("Please Wait for last request!!")
            return
        }
        this.setState({
            itemadded: item
        })
    }

    handleClearItem = () => {
        this.setState({
            itemadded: null
        })
    }


    render() {
        return (
            <div>
                <Billing />
                <div className="invoice">
                    <Link to={{
                        pathname: "/search",
                        state: {
                            mobile: this.state.mobile,
                            name: this.state.name,
                            address: this.state.address,
                            customerExists: this.state.customerExists,
                            invoicedirectory: this.invoicedirectory,
                            invoiceprice: this.invoiceprice
                        }
                    }}><p id="bill-search-item">Search Item</p></Link>
                    <form onSubmit={this.handleSubmit} onKeyPress={this.handleSubmitKeyPress}>
                        <label className="customer-detail">
                            <p>Name:</p>
                            <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                        </label>
                        <label className="customer-detail">
                            <p>Mobile:</p>
                            <input type="text" value={this.state.mobile} onChange={this.handleMobileNumberChange} />
                        </label>
                        <label className="customer-detail">
                            <p>Address:</p>
                            <input type="text" value={this.state.address} onChange={this.handleAddressChange} />
                        </label>
                        <table id="invoice-item-list">
                            <tbody>
                                <tr>
                                    {this.renderTableHeader()}
                                </tr>
                                {this.renderInvoiceData()}
                                <tr>
                                    <td>{Object.keys(this.invoicedirectory).length + 1}</td>
                                    <td><input className="bill-input-field" type="text" value={this.state.inputcode} onChange={this.handlerowchange} onKeyPress={this.handlekeypress}></input></td>
                                    <td></td><td></td>
                                    <td></td><td></td>
                                    <td></td><td></td>
                                    <td></td><td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <p>Grand Total:</p>
                            <p>{this.state.grandtotal.toFixed(2)}</p>
                        </div>
                        <input className="submit-button" type="submit" value="Submit" />
                    </form>
                </div>

            </div>
        )
    }
}