import React, { Component } from "react"
import DropDown from './DropDown'
import PackDropDown from './PackDropDown'
import UseAnimations from 'react-useanimations';

export default class InvoiceRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            identity: this.props.identity,
            quantity: this.props.quantity,
            totprice: this.props.item.price[this.props.identity]*1,
            focus: false,
            partial: this.props.partial,
        };

    }

    handleChangeIdentity = (id) => {
        this.setState({
            identity:id
        })
        let sum = this.props.item.price[id] * this.state.quantity + this.state.partial * (this.props.item.price[id]/this.props.item.pack[id])
        this.setState({
            totprice : sum
        })
        this.props.onChangePrice(this.props.srno, sum, this.props.item.id[id],
            this.getquantity(this.state.quantity, this.state.partial), this.state.identity, this.getpartial(this.state.partial),
            this.state.partial, parseInt(this.state.quantity))
        
    }
    handleExpChange = (event) => {
        let id = this.props.item.expdate.indexOf(event.target.value)
        this.handleChangeIdentity(id)
    }

    handleBatchChange = (event) => {
        let id = this.props.item.batchno.indexOf(event.target.value)
        this.handleChangeIdentity(id)
    }

    handlePriceChange = (event) => { 
        console.log("value",event.target.value)
        let id = this.props.item.price.indexOf(parseFloat(event.target.value))
        console.log("id",id)
        this.handleChangeIdentity(id)   
    }

    getquantity = (quantity,partial) => {
        if(partial <= this.props.item.partial[this.state.identity]){
            return parseInt(quantity)
        }
        else {
            return quantity+1
        }
    }

    getpartial = (partial) => {
        if(partial <= this.props.item.partial[this.state.identity]){
            return this.props.item.partial[this.state.identity] - partial;
        }
        else{
            const a = this.props.item.pack[this.state.identity] + this.props.item.partial[this.state.identity]
            return a - partial;
        }
    }
    handleQuantityChange = (event) => {
        if(parseInt(event.target.value) > this.props.item.quantity[this.state.identity]){
            let outstr = `${event.target.value} ${this.props.item.itemname} are NOT available in stock!! \n Availability : ${this.props.item.quantity[this.state.identity]}`;
            alert(outstr)
            this.setState({
                quantity: 0,
                totprice: 0
            })
            this.props.onChangePrice(this.props.srno, 0, this.props.item.id[this.state.identity],0)
            return
        }
        let sum = (this.props.item.price[this.state.identity] * parseInt(event.target.value)) + 
                  (this.state.partial * (this.props.item.price[this.state.identity]/this.props.item.pack[this.state.identity]))
        this.setState({
            quantity: event.target.value,
            totprice: sum
        })
        this.props.onChangePrice(this.props.srno, sum, this.props.item.id[this.state.identity], 
            this.getquantity(parseInt(event.target.value),this.state.partial),this.state.identity, this.getpartial(this.state.partial),
            this.state.partial,parseInt(event.target.value))
    }

    handlePartialChange = (event) => {
        console.log("partial",event.target.value)
        console.log("here",this.state.quantity)
        this.setState({
            partial: parseInt(event.target.value)
        })
        let sum = (this.props.item.price[this.state.identity] * parseInt(this.state.quantity)) + (parseInt(event.target.value) * (this.props.item.price[this.state.identity]/this.props.item.pack[this.state.identity]))
        this.setState({
            totprice: sum
        })
        this.props.onChangePrice(this.props.srno, sum, this.props.item.id[this.state.identity], 
            this.getquantity(parseInt(this.state.quantity),parseInt(event.target.value)), this.state.identity,
            this.getpartial(parseInt(event.target.value)), parseInt(event.target.value), parseInt(this.state.quantity))
        
    }

    getTotalPrice = () => {
        let totalPrice = this.state.price * this.state.quantity
        return totalPrice
    }

    handleOnMouseEnter = () => {
        this.setState({
            focus:true
        })
    }

    handleOnMouseLeave = () => {
        this.setState({
            focus:false
        })
    }

    showSerialData = () => {
        if(!this.state.focus){
            return this.props.counter;
        }
        else{
            return <div id="trash-box" onClick={() => {this.props.onItemTrash(this.props.srno)}}>
                <UseAnimations animationKey="trash2" size={30}/>
                </div>
        }
    }

    render() {
        return (
            <tr>
                <td onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave} id="bill-delete-box">{this.showSerialData()}</td>
                <td>{this.props.item.barcode}</td>
                <td>{this.props.item.itemname}</td>
                <td>{this.props.item.specs}</td>
                <PackDropDown pack={this.props.item.pack[this.state.identity]} value={this.state.partial} onChangeValue={this.handlePartialChange} />
                <DropDown property={this.props.item.expdate} value={this.props.item.expdate[this.state.identity]} onChangeValue={this.handleExpChange} />
                <DropDown property={this.props.item.batchno} value={this.props.item.batchno[this.state.identity]} onChangeValue={this.handleBatchChange} />
                <DropDown property={this.props.item.price} value={this.props.item.price[this.state.identity]} onChangeValue={this.handlePriceChange} />
                <td>{this.props.item.brand}</td>
                <td>
                    <input className="bill-input-field" type="text" value={this.state.quantity} onChange={this.handleQuantityChange}>
                    </input>
                </td>
                <td>{this.state.totprice.toFixed(2)}</td>
            </tr>
        )
    }
}
