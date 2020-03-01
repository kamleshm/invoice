import React,{Component} from "react"
import SearchHeader from './search/SearchHeader'
import SearchHere from './search/SearchHere'
import ShowSearchResults from './search/ShowSearchResults'
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom'

export default class SearchPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchString : '',
            searchresults : [],
            itemadded: null
        }
        this.timer = null;
        this.proxy = 'https://cors-anywhere.herokuapp.com/'
        this.url = 'http://shuttrbiilingsystem-env.fmp2fauppm.ap-south-1.elasticbeanstalk.com/'
    }
    handleSearchStringChange = (event) => {
        this.setState({
            searchString : event.target.value
        })
        if (this.timer != null){
            this.timer = clearTimeout(this.timer)
        }
        this.timer = setTimeout(()=>{this.handleInventorySearch()}, 1000);
    }

    handleInventorySearch = async() => {
        let results = []
        let apistring = this.url + 'inventory/name/' + this.state.searchString
        if(this.state.searchString.length > 2){
            await axios.get(this.proxy + apistring)
                    .then((response) => {
                        console.log("response",response)
                        if(response.status === 200){
                            this.setState({
                                searchresults : response.data
                            })
                        }
                    },
                    (error) => {console.log(error)})
        }
        else{
            this.setState({
                searchresults : []
            })
        }
    }

    handleItemSelection = (item) => {
        this.setState({
            itemadded : item
        })
    }
    
    render () {
        console.log("props.name",this.props.location)
        if(this.state.itemadded != null){
            return <Redirect push to={{
                pathname:"/",
                 state : {
                    mobile: this.props.location.state.mobile,
                    name: this.props.location.state.name,
                    address: this.props.location.state.address,
                    customerExists: this.props.location.state.customerExists,
                    invoicedirectory: this.props.location.state.invoicedirectory,
                    invoiceprice: this.props.location.state.invoiceprice,
                    itemadded: this.state.itemadded
                 }
            }}/>
        }
        return (
         <div className="search-page">
             <SearchHeader />
             <div className="search-body"> 
             <Link to={{
                 pathname:"/",
                 state : {
                    mobile: this.props.location.state.mobile,
                    name: this.props.location.state.name,
                    address: this.props.location.state.address,
                    customerExists: this.props.location.state.customerExists,
                    invoicedirectory: this.props.location.state.invoicedirectory,
                    invoiceprice: this.props.location.state.invoiceprice,
                    itemadded: this.state.itemadded
                 }
             }}><p id="searchpage-invoice-button">Invoice</p></Link>
             <SearchHere value = {this.state.searchString} onValueChange = {this.handleSearchStringChange} onSearchString = {this.handleInventorySearch}/> 
             <ShowSearchResults results = {this.state.searchresults} onItemSelection = {this.handleItemSelection}/>
             </div>
         </div>
    )
    }
}