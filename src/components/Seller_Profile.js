import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import {
  Redirect
} from 'react-router-dom'
import Web3 from "web3"
import SmartCredit from "../abis/SmartCredit.json"

// navbar
import Navbar from './Navbar.js';
import InvoiceListSeller from "./InvoiceListSeller";
import { get_invoice_supplier } from './UserFunctions' 

class Seller_Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_name: '',
      acct_type: '',
      wal_addr: '',
      coy_name: '',
      approver: '',
      credit_limit: '',
      created_on: '',
      invoices: [],
      errors: {}
    }
    this.routeChange = this.routeChange.bind(this)
  }

  componentDidMount() {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    this.setState({
      user_name: decoded.identity.user_name,
      acct_type: decoded.identity.acct_type,
      wal_addr: decoded.identity.wal_addr,
      coy_name: decoded.identity.coy_name,
      approver: decoded.identity.approver,
      credit_limit: decoded.identity.credit_limit,
      created_on: decoded.identity.created_on
    })
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadDBData()
  } 

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum broswer detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // load account
    const accounts = await web3.eth.getAccounts()
    // console.log(accounts)
    this.setState({ eth_acct: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = SmartCredit.networks[networkId]
    if (networkData) {
      const smart_credit = web3.eth.Contract(SmartCredit.abi, networkData.address)
      this.setState({ smart_credit })

      this.setState({ loading: false })
    } else {
      window.alert('SmartCredit contract not deployed to detected network.')
    }
  }

  async loadDBData() {
    let temp = await get_invoice_supplier(this.state.user_name)
    if (temp.length > 0) {
      this.setState({
        invoices: [{"id": temp[0][0], "buyer_name":temp[0][1], "total_price":temp[0][4], "status":temp[0][5], "created_on":temp[0][6]}]
      })
    }
    

  }

  routeChange() {
    let path = '/create_invoice'
    this.props.history.push(path)
  }

  render() {
    if (localStorage.usertoken){
      return (
        <div className="container">
          <Navbar />
          <div className="jumbotron mt-5">
            <div className="col-sm-8 mx-auto">
              <h1 className="text-center">Profile</h1>
            </div>
            <table className="table col-md-6 mx-auto">
              <tbody>
                <tr>
                  <td>Username</td>
                  <td>{this.state.user_name}</td>
                </tr>
                <tr>
                  <td>Account Type</td>
                  <td>{this.state.acct_type}</td>
                </tr>
                <tr>
                  <td>Company Name</td>
                  <td>{this.state.coy_name}</td>
                </tr>
                <tr>
                  <td>Wallet Address</td>
                  <td>{this.state.wal_addr}</td>
                </tr>
                <tr>
                  <td>Credit Limit</td>
                  <td>{this.state.credit_limit}</td>
                </tr>
                <tr>
                  <td>Approver</td>
                  <td>{this.state.approver}</td>
                </tr>
                <tr>
                  <td>Created On</td>
                  <td>{this.state.created_on}</td>
                </tr>
              </tbody>
            </table>
            <div className="col-sm-8 mx-auto">
              <center>
                <button onClick={this.routeChange}>
                  Create Invoice
                </button>
              </center>
            </div>
          </div>
          
          <InvoiceListSeller
          invoices={this.state.invoices}/>
          
        </div>
      )
    }
    else {
      return(
        <Redirect to='/login'/>
      )
    }
    
  }
}

export default Seller_Profile