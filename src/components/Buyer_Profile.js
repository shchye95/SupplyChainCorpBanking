import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import {
  Redirect
} from 'react-router-dom'
import Web3 from "web3"
import SmartCredit from "../abis/SmartCredit.json"

// navbar
import Navbar from './Navbar.js';
import PendingInvoiceListBuyer from "./PendingInvoiceListBuyer";
import { get_pending_invoice_buyer } from './UserFunctions' 

class Buyer_Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_name: '',
      acct_type: '',
      wal_addr: '',
      coy_name: '',
      approver: '',
      credit_limit: 60,
      created_on: '',
      pending_invoices: [],
      db_detail: {},
      errors: {}
    }
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
      // credit_limit: decoded.identity.credit_limit,
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
    console.log(this.state.user_name)
    let temp = await get_pending_invoice_buyer(this.state.user_name)
    console.log(temp)
    if (temp.length > 0) {
      this.setState({
        pending_invoices: [{"id": temp[0][0], "seller_name":temp[0][2], "total_price":temp[0][4], "status":temp[0][5], "created_on":temp[0][6]}]
      })
    }
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
          </div>
          <PendingInvoiceListBuyer
          pending_invoices={this.state.pending_invoices}
          wall_addr={this.state.wall_addr}/>

          
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

export default Buyer_Profile