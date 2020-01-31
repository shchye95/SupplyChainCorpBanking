import React, {Component} from 'react'
import Navbar from './Navbar.js'
import jwt_decode from 'jwt-decode'

import { create_invoice } from './UserFunctions' 

class InvoiceEntries extends Component {

    constructor(props){
        super(props)
        this.state = {
            buyer_username: '',
            product_name: '',
            product_price: '',
            product_quantity: '',
            error: {}
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()
        
        const decoded = jwt_decode(localStorage.usertoken)

        const supplier_name = decoded.identity.user_name
        const invoice_details = [
            {
                product_name: this.state.product_name,
                product_price: this.state.product_price,
                product_quantity: this.state.product_quantity
            }
        ]

        const newInvoice = {
          buyer_name: this.state.buyer_username,
          supplier_name: supplier_name,
          invoice_details: invoice_details,
          total_amount: this.state.product_price
        }
        console.log(newInvoice)
        create_invoice(newInvoice).then(res => {
          alert("Invoice submitted successful. Buyer will be notified to review it.")
          this.props.history.push(`/seller_profile`)
        })
    }

    render(){
        return (
            <div className="container">
                <Navbar />
                <div className="jumbotron mt-5">   
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Create Invoice</h1>
                    </div>
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="row">
                            <div className="col-sm"><center><b>Username of Buyer</b></center></div>
                            <div className="col-sm">
                                <center>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="buyer_username"
                                        value={this.state.buyer_username}
                                        onChange={this.onChange}
                                    />
                                </center>
                            </div>
                            <div className="col-sm"><center><button>Add Row</button></center></div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col-sm"><center><b>Product/Service Name</b></center></div>
                            <div className="col-sm"><center><b>Unit Price (Eth)</b></center></div>
                            <div className="col-sm"><center><b>Quantity</b></center></div>
                        </div>
                        
                        <div className="row">
                            <div class="col-sm">
                                <center>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="product_name"
                                        value={this.state.product_name}
                                        onChange={this.onChange}
                                    />
                                </center>
                            </div>
                            <div className="col-sm">
                                <center>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="product_price"
                                        value={this.state.product_price}
                                        onChange={this.onChange}
                                    />
                                </center>
                            </div>
                            
                            <div className="col-sm">
                                <center>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="product_quantity"
                                        value={this.state.product_quantity}
                                        onChange={this.onChange}
                                    />
                                </center>
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col-sm"><center><b></b></center></div>
                            <div className="col-sm"><center><b>Grand Total:</b></center></div>
                            <div className="col-sm"><center><b>{this.state.product_price}</b></center></div>
                        </div>

                        <br></br>
                        <div className="row">
                            <div className="col-sm"><center><b></b></center></div>
                            <div className="col-sm">
                                <center>
                                    <button type="submit">Submit</button>
                                </center>
                            </div>
                            <div className="col-sm"><center></center></div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default InvoiceEntries