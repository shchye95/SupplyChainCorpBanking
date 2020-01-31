import React, { Component } from 'react';
import Web3 from "web3" 
import SmartCredit from "../abis/SmartCredit.json"

import { register } from './UserFunctions'


class ApplicantList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            // id: '',
            // coy_name: '',
            // acct_type: '',
            // wal_addr: '',
            credit_limit: '',
            loading: true,
            approver_acct: '',
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this)
        this.approve_credit = this.approve_credit.bind(this)
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
        this.setState({ approver_acct: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = SmartCredit.networks[networkId]
        if (networkData) {
            const smart_credit = web3.eth.Contract(SmartCredit.abi, networkData.address)
            this.setState({ smart_credit })
            
            // const status = {0:"Pending", 1:"Rejected", 2:"Approve"}
            // load applications
        
            this.setState({ loading: false })
        } else {
            window.alert('SmartCredit contract not deployed to detected network.')
        }
    }

    handleChange(e){
        const credit_limit = e.target.value
        this.setState({
            credit_limit: credit_limit
        })
    }

    // onSubmit(e) {
    //     e.preventDefault()
    
    //     const newUser = {
    //         id: this.state.id,
    //         acct_type: this.state.acct_type,
    //         wal_addr: this.state.wal_addr,
    //         coy_name: this.state.coy_name,
    //         credit_limit: this.state.credit_limit
    //     }
    //     this.approve_credit(newUser.id, newUser.credit_limit)
    
    //     register(newUser).then(res => {
    //         this.props.history.push('/profile')
    //     })
    //   }

    approve_credit(appId, creditLimit) {
        this.setState({ loading: true })
        this.state.smart_credit.methods.approve_credit(appId, creditLimit).send({ from: this.state.approver_acct })
        .once('receipt', (receipt) => {
            this.setState({ loading: false })
        }) 
    }


    render() {
        return(
            <div className="jumbotron mt-5">
                <center><h2>Applicant List</h2></center>
                <table className="table">
                    <thead>
                        <td>App ID</td>
                        <td>Company Name</td>
                        <td>Account Type</td>
                        <td>Wallet Address</td>
                        <td>Submitted On</td>
                        <td>Status</td>
                        <td>Assigned Credit (Eth)</td>
                        <td></td>
                    </thead>
                    <tbody>
                        { this.props.applicants.map((app_detail, key) => {
                            return(
                                <tr key={key}>
                                    <td scope="row">{app_detail.id.toString()}</td>
                                    <td>{app_detail.coy_name}</td>
                                    <td>{app_detail.acct_type}</td>
                                    <td>{app_detail.walletAddress}</td>
                                    <td>{app_detail.submitted_on}</td>
                                    <td>{app_detail.status}</td>
                                    <td>
                                        {
                                            !(app_detail.acct_type != "Buyer")
                                            ? 100
                                            : "NA"
                                        }
                                    </td>
                                    <td>
                                        {                      
                                            <button

                                                onClick = {(event) => {
                                                    event.preventDefault()
                                                    let credit_limit = 0
                                                    
                                                    if (app_detail.acct_type == "Buyer") {
                                                        credit_limit = 100
                                                    }

                                                    const newUser = {
                                                        id: app_detail.id,
                                                        acct_type: app_detail.acct_type,
                                                        wal_addr: app_detail.walletAddress,
                                                        coy_name: app_detail.coy_name,
                                                        credit_limit: credit_limit
                                                    }

                                                    this.approve_credit(app_detail.id, window.web3.utils.toWei(credit_limit.toString(), 'Ether'))
                                                    
                                                    register(newUser).then(res => {
                                                        if(!res.error){
                                                            const username = newUser.coy_name + "_2019"
                                                            const password = newUser.coy_name + "123"
                                                            alert("Approved and registered user\n" +
                                                            "Username: " + username + "\n" +
                                                            "Password: " + password)
                                                            window.location.reload()
                                                        }
                                                    })
                                                }}
                                            >
                                                Approve
                                            </button>
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ApplicantList