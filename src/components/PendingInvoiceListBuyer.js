import React, { Component } from 'react';
import Web3 from "web3" 
import SmartCredit from "../abis/SmartCredit.json"
import SmartInvoice from "../abis/SmartInvoice.json"
import jwt_decode from 'jwt-decode'

import { approve_invoice_buyer, get_wallet_address } from './UserFunctions'


class PendingInvoiceListBuyer extends Component {
    
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
        this.add_invoice = this.add_invoice.bind(this)
        // this.add_invoice_smart_credit = this.add_invoice_smart_credit.bind(this)
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
            console.log(this.state.smart_credit)
            const smart_invoice = web3.eth.Contract(SmartInvoice.abi, networkData.address)
            this.setState({ smart_invoice })
            
            // const status = {0:"Pending", 1:"Rejected", 2:"Approve"}
            // load applications
        
            this.setState({ loading: false })
        } else {
            window.alert('SmartCredit contract not deployed to detected network.')
        }
    }

    // approve invoice on smart_invoice
    add_invoice() {
        this.setState({ loading: true })

        this.state.smart_invoice.methods.add_invoice(1, '0x4702272be179aA94DF1a65360aBE37B95b4c8D98').send({ from: '0xAaec700A3e763E51eB99f3E9411244695E093321' })
        .once('receipt', (receipt) => {
            console.log(receipt)
            this.setState({ loading:false })
        })
    }

    // // add invoice id to buyer on smart_credit
    // add_invoice_smart_credit(buyerId, invoiceId, invoiceAmount) {
    //     this.setState({ loading: true })
    //     const token = jwt_decode(localStorage.usertoken)
    //     const buyer_wallAddr = token.identity.wal_addr
    //     this.state.smart_credit.methods.add_invoice(buyerId, invoiceId, invoiceAmount).send({ from: buyer_wallAddr })
    //     .once('receipt', (receipt) => {
    //         console.log(receipt)
    //         this.setState({ loading:false })
    //     })
    // }
    

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


    render() {
        return(
            <div className="jumbotron mt-5">
                <center><h2>Live Invoice List</h2></center>
                <table className="table">
                    <thead>
                        <td>Invoice ID</td>
                        <td>Seller Username</td>
                        <td>Total Amount (Eth)</td>
                        <td>Status</td>
                        <td>Advance Status</td>
                        <td>Created On</td>
                        <td></td>
                    </thead>
                    <tbody>
                        { this.props.pending_invoices.map((invoice, key) => {
                            return(
                                <tr key={key}>
                                    <td scope="row">{invoice.id.toString()}</td>
                                    <td>{invoice.seller_name}</td>
                                    <td>{invoice.total_price}</td>
                                    <td>Approved</td>
                                    <td>Requested</td>
                                    <td>{invoice.created_on}</td>
                                    <td>
                                        {/* {
                                            <button
                                                onClick = {(event) => {
                                                    event.preventDefault()
                                                    
                                                    this.add_invoice()
                                                    // this.add_invoice_smart_credit(1, invoice.id, invoice.total_price)

                                                    alert("Invoice has been approved.")
                                                    
                                                    window.location.reload()
                                                }}
                                            >
                                                Approve
                                            </button>
                                        } */}
                                        <button>Approve</button>
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

export default PendingInvoiceListBuyer