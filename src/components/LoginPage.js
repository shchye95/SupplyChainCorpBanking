import React, { Component } from 'react'
import {
  Redirect
} from 'react-router-dom'
import { login } from './UserFunctions'
import jwt_decode from 'jwt-decode'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_name: '',
      password: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  
  onSubmit(e) {
    e.preventDefault()

    const user = {
      user_name: this.state.user_name,
      password: this.state.password
    }

    login(user).then(res => {

      console.log(res)
      if (!res.error) {
        const decoded = jwt_decode(res)

        if (decoded.identity.acct_type === "Financier") {
          this.props.history.push('/financier_profile')
        } else if (decoded.identity.acct_type === "Buyer") {
          this.props.history.push('/buyer_profile')
        } else {
          this.props.history.push('/seller_profile')
        }

      }
    })
  }

  render() {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit}>
                <center><h1 className="h3 mb-3 font-weight-normal">SupplyChain</h1></center>
                <div className="form-group">
                  <label htmlFor="userail">Username</label>
                  <input
                    type="username"
                    className="form-control"
                    name="user_name"
                    placeholder="Enter username"
                    value={this.state.user_name}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-block"
                >
                  Sign in
                </button>
              </form>
              <br />
              <center><a href="/signup">Sign Up</a></center>
            </div>
          </div>
        </div>
      )
    
  }
}

export default Login