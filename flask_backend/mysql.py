from flask import Flask, jsonify, request, render_template
import pymysql
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)

import json

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'secret'

mysql = pymysql.connect(
                        host='127.0.0.1',
                        port=8889,
                        user='root',
                        password='root',
                        db='supplychain')

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)

@app.route('/users/register', methods=['POST'])
def register():
    cur = mysql.cursor()
    username = request.get_json()['coy_name'] + "_2019"
    acct_type = request.get_json()['acct_type']
    wal_addr = request.get_json()['wal_addr']
    coy_name = request.get_json()['coy_name']
    password = bcrypt.generate_password_hash(request.get_json()['coy_name'] + "123").decode('utf-8')
    approver = '0xD95881ECF87A1d036e6366dA8897a3a00258bCEE'
    credit_limit = request.get_json()['credit_limit']
    created_on = datetime.utcnow() 

    # username = 'abcBank'
    # acct_type = 'Financier'
    # wal_addr = '0xD95881ECF87A1d036e6366dA8897a3a00258bCEE'
    # coy_name = 'ABC Bank'
    # password = bcrypt.generate_password_hash('abcbank123').decode('utf-8')
    # credit_limit = 0
    # approver = '0xD95881ECF87A1d036e6366dA8897a3a00258bCEE'
    # created_on = datetime.utcnow()
	
    cur.execute("INSERT INTO account_records (user_name, account_type, wallet_addr, coy_name, pwd, credit_limit, approver,created_on) VALUES ('" + 
		str(username) + "', '" + 
		str(acct_type) + "', '" + 
		str(wal_addr) + "', '" + 
		str(coy_name) + "', '" + 
		str(password) + "', '" + 
        str(credit_limit) + "','" +
        str(approver) + "', '" +
        str(created_on) + "')")

    mysql.commit()

    
	
    result = {
		'username' : username,
		'acct_type' : acct_type,
		'wal_addr' : wal_addr,
		'coy_name' : coy_name,
		'password' : password,
        'created_on': created_on
	}

    return jsonify({'result' : result})
	

@app.route('/users/login', methods=['POST'])
def login():
    cur = mysql.cursor()
    username = request.get_json()['user_name']
    password = request.get_json()['password']
    result = ""
	
    cur.execute("SELECT * FROM account_records where user_name = '" + str(username) + "'")
    rv = cur.fetchone()
	
    if bcrypt.check_password_hash(rv[4], password):
        access_token = create_access_token(identity = {'user_name': rv[0],'acct_type': rv[1], 'wal_addr': rv[2],'coy_name': rv[3], 'credit_limit': rv[5], 'approver': rv[6],'created_on': rv[7]})
        result = access_token
    else:
        result = jsonify({"error":"Invalid username and password"})
    
    

    return result

@app.route('/users/apply', methods=['POST'])
def apply():
    cur = mysql.cursor()
    coy_name = request.get_json()['coy_name']
    acct_type = request.get_json()['acct_type']
    wallet_addr = request.get_json()['wal_addr']
    submitted_on = datetime.utcnow()
    
    cur.execute("INSERT INTO application_records (coy_name, acct_type, wallet_addr, submitted_on) VALUES ('" + 
		str(coy_name) + "', '" + 
		str(acct_type) + "', '" + 
        str(wallet_addr) + "', '" + 
        str(submitted_on) + "')")

    mysql.commit()
	 
    

    result = {
		'coy_name': coy_name,
        'acct_type': acct_type,
        'wallet_addr': wallet_addr,
        'submitted_on': submitted_on
	}

    return jsonify({'result' : result})

@app.route('/getApplicantDetails/<id>')
def getApplicantDetails(id):
    cur = mysql.cursor()
    cur.execute("SELECT * FROM application_records where id = '" + str(id) + "'")
    rv = cur.fetchone()

    result = {
        "id": rv[0],
        "coy_name": rv[1],
        "acct_type": rv[2],
        "submitted_on": rv[4]
    }

    

    return jsonify({'result' : result})

@app.route('/get_wallet_address/<user_name>')
def get_wallet_address(user_name):
    cur = mysql.cursor()
    cur.execute("SELECT wallet_addr FROM account_records where user_name = '" + user_name + "'")
    wallet_addr = cur.fetchone()
    print(wallet_addr[0])

    
    return wallet_addr[0]

@app.route('/create_invoice', methods=['POST'])
def create_invoice():
    cur = mysql.cursor()
    buyer_name = request.get_json()['buyer_name']
    supplier_name = request.get_json()['supplier_name']
    invoice_details = json.dumps(request.get_json()['invoice_details'])
    total_amount = request.get_json()['total_amount']
    status = "Pending"
    created_on = datetime.utcnow()

    cur.execute("INSERT INTO invoice_records (buyer_name, supplier_name, invoice_details, total_amount, status, created_on) VALUES ('" + 
		str(buyer_name) + "', '" + 
		str(supplier_name) + "', '" + 
        str(invoice_details) + "', '" + 
        str(total_amount) + "', '" + 
        str(status) + "', '" + 
        str(created_on) + "')") 

    mysql.commit()

    

    result = {
		'buyer_name': buyer_name,
        'supplier_name': supplier_name,
        'total_amount': total_amount,
        'status': status,
        'created_on': created_on
	}

    

    return result

@app.route('/get_pending_invoice_buyer/<buyer_name>')
def get_pending_invoice_buyer(buyer_name):
    cur = mysql.cursor()
    cur.execute("SELECT * FROM invoice_records where buyer_name = '" + buyer_name + "' and status = 'Pending' ")
    rv = cur.fetchall()

    

    return jsonify(rv)

@app.route('/get_approved_invoice_buyer/<buyer_name>')
def get_approved_invoice_buyer(buyer_name):
    cur = mysql.cursor()
    cur.execute("SELECT * FROM invoice_records where buyer_name = '" + buyer_name + "' and status = 'Approved' ")
    rv = cur.fetchall()

    

    return jsonify(rv)

@app.route('/get_pending_invoice_supplier/<supplier_name>')
def get_pending_invoice_supplier(supplier_name):
    cur = mysql.cursor()
    cur.execute("SELECT * FROM invoice_records where supplier_name = '" + supplier_name + "' and status = 'Pending' ")
    rv = cur.fetchall()

    

    return jsonify(rv)

@app.route('/get_approved_invoice_supplier/<supplier_name>')
def get_approved_invoice_supplier(supplier_name):
    cur = mysql.cursor()
    cur.execute("SELECT * FROM invoice_records where supplier_name = '" + supplier_name + "' and status = 'Approved' ")
    rv = cur.fetchall()

    

    return jsonify(rv)

@app.route('/get_invoice_supplier/<supplier_name>')
def get_invoice_supplier(supplier_name):
    cur = mysql.cursor()
    cur.execute("SELECT * FROM invoice_records where supplier_name = '" + supplier_name + "'")
    rv = cur.fetchall()

    

    return jsonify(rv)

@app.route('/approve_invoice_buyer/<id>')
def approve_invoice_buyer(id):

    cur = mysql.cursor()

    cur.execute("UPDATE invoice_records SET status = 'Approved' WHERE id = '" + str(id) + "'")

    mysql.commit()

    

    return "Updated status"


if __name__ == '__main__':
    app.run(debug=True)



