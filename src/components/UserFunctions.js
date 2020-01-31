import axios from 'axios'

const server_url = "http://localhost:5000/"

export const apply = newApplicant => {
  return axios
    .post(server_url + 'users/apply', {
      coy_name: newApplicant.coy_name,
      acct_type: newApplicant.acct_type,
      wal_addr: newApplicant.wal_addr,
    })
    .then(response => {
      console.log('Registered')
    })
}

export const register = newUser => {
  return axios
    .post(server_url + 'users/register', {
      acct_type: newUser.acct_type,
      wal_addr: newUser.wal_addr,
      coy_name: newUser.coy_name,
      credit_limit: newUser.credit_limit
    })
    .then(response => {
      return "Registered"
    })
}

export const create_invoice = newInvoice => {
  return axios
    .post(server_url + 'create_invoice', {
      buyer_name: newInvoice.buyer_name,
      supplier_name: newInvoice.supplier_name,
      invoice_details: newInvoice.invoice_details,
      total_amount: newInvoice.total_amount
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })  
}

export const get_wallet_address = name => {
  return axios
  .get(server_url + 'get_wallet_address/' + name)
  .then(response => {
    return response.data
  })
  .catch(err => {
    console.log(err)
  })
}

export const get_pending_invoice_buyer = buyer_name => {
  return axios
  .get(server_url + 'get_pending_invoice_buyer/' + buyer_name)
  .then(response => {
    return response.data
  })
  .catch(err => {
    console.log(err)
  })
}

export const get_approved_invoice_buyer = buyer_name => {
  return axios
  .get(server_url + 'get_approved_invoice_buyer/' + buyer_name)
  .then(response => {
    return response.data
  })
  .catch(err => {
    console.log(err)
  })
}

export const get_invoice_supplier = supplier_name => {
  return axios
  .get(server_url + 'get_invoice_supplier/' + supplier_name)
  .then(response => {
    return response.data
  })
  .catch(err => {
    console.log(err)
  })
}

export const get_pending_invoice_supplier = supplier_name => {
  return axios
  .get(server_url + 'get_pending_invoice_supplier/' + supplier_name)
  .then(response => {
    return response.data
  })
  .catch(err => {
    console.log(err)
  })
}

export const get_approved_invoice_supplier = supplier_name => {
  return axios
  .get(server_url + 'get_approved_invoice_supplier/' + supplier_name)
  .then(response => {
    return response.data
  })
  .catch(err => {
    console.log(err)
  })
}

export const approve_invoice_buyer = id => {
  return axios
  .get(server_url + 'approve_invoice_buyer/' + id)
  .then(response => {
    return response.data
  })
  .catch(err => {
    console.log(err)
  })

}

export const login = user => {
  return axios
    .post(server_url + 'users/login', {
      user_name: user.user_name,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getApplicantDetails = id => {
  return axios
    .get(server_url + 'getApplicantDetails/' + id)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
} 

export const getProfile = user => {
  return axios
    .get(server_url + 'users/profile', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}