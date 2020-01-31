import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import {
  Redirect
} from 'react-router-dom'
import Web3 from "web3"
import SmartCredit from "../abis/SmartCredit.json"

// navbar
import Navbar from './Navbar.js';
import ApplicantList from "./ApplicantList.js";
import AdvanceInvList from "./AdvanceInvList.js";
import { getApplicantDetails } from './UserFunctions'

class Financier_Profile extends Component {
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
      applicantCount: 0,
      applicants: [],
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
      credit_limit: decoded.identity.credit_limit,
      created_on: decoded.identity.created_on
    })
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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
      const applicantCount = await smart_credit.methods.applicantCount().call()
      this.setState({ applicantCount })
      const status = {0:"Pending", 1:"Rejected", 2:"Approve"}
      // load applications
      for (var i = 1; i <= applicantCount; i++) {
        const applicant = await smart_credit.methods.applicants(i).call()
        let temp = await getApplicantDetails(applicant.id)
        if (applicant.status === 0) {
          const app_detail = {"id": applicant.id, "coy_name": temp.result.coy_name, "acct_type": temp.result.acct_type, "walletAddress": applicant.walletAddress, "submitted_on": temp.result.submitted_on, "status":status[applicant.status]}
          this.setState({
            applicants: [...this.state.applicants, app_detail]
          })
        }

      }

      this.setState({ loading: false })
    } else {
      window.alert('SmartCredit contract not deployed to detected network.')
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

            {/* <ApplicantList 
            applicants={this.state.applicants}/> */}

            <AdvanceInvList />
          
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

export default Financier_Profile