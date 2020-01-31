import React, { Component } from 'react';
import Web3 from "web3" 
import SmartCredit from "../abis/SmartCredit.json"
import SmartInvoice from "../abis/SmartInvoice.json"
import jwt_decode from 'jwt-decode'

import { approve_invoice_buyer, get_wallet_address } from './UserFunctions'


class AdvanceInvList extends Component {
    


    render() {
        return(
            <div className="jumbotron mt-5">
                <center><h2>Request Advance Invoice List</h2></center>
                <table className="table">
                    <thead>
                        <td>Invoice ID</td>
                        <td>Buyer Username</td>
                        <td>Seller Username</td>
                        <td>Total Amount (Eth)</td>
                        <td>Advance Status</td>
                        <td>Calculated Discount Rate</td>
                        <td></td>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Zenya_2019</td>
                            <td>Akira_2019</td>
                            <td>40</td>
                            <td>Approved</td>
                            <td>5%</td>
                            <td><button>Grant Advance</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default AdvanceInvList