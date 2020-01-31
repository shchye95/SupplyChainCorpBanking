import Web3 from "web3"
import SmartCredit from "../abis/SmartCredit.json"
import React, { Component } from 'react'
import { apply } from './UserFunctions'


class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eth_acct: '',
      coy_name: '',
      acct_type: '',
      wal_addr: '',
      loading: true,
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.apply_credit = this.apply_credit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const newApplicant = {
      coy_name: this.state.coy_name,
      acct_type: this.state.acct_type,
      wal_addr: this.state.wal_addr
    }
    this.apply_credit()

    apply(newApplicant).then(res => {
      alert("Application submitted successful. Our staff will contact you shortly.")
      this.props.history.push(`/login`)
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
    console.log(accounts)
    this.setState({ eth_acct: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = SmartCredit.networks[networkId]
    if (networkData) {
      const smart_credit = web3.eth.Contract(SmartCredit.abi, networkData.address)
      this.setState({ smart_credit })
      console.log(this.state.smart_credit)
      this.setState({ loading: false })
    } else {
      window.alert('SmartCredit contract not deployed to detected network.')
    }
  }

  apply_credit() {
    this.setState({ loading: true })
    this.state.smart_credit.methods.apply_credit().send({ from: this.state.wal_addr })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                <label htmlFor="email">Company Name</label>
                <input
                  type="coy_name"
                  className="form-control"
                  name="coy_name"
                  placeholder="Enter email"
                  value={this.state.coy_name}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Account Type</label>
                <br/>
                <select name="acct_type" placeholder="Indicate account type" value={this.state.acct_type} onChange={this.onChange}>
                  <option value=""></option>
                  <option value="Buyer">Buyer</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="name">Eth Wallet Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="wal_addr"
                  placeholder="Enter your Eth Wallet Address"
                  value={this.state.wal_addr}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Register!
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Register