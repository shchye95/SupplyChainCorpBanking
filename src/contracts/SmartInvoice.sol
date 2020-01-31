pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SmartInvoice {

	mapping (uint256 => Invoice) public invoices;
	// enum InvoiceState {Drafted, Active};
	enum AdvanceState {NoAction, Requested, Approved, Granted}

	struct Invoice {
		uint256 id;
		// address payable payer;
		address payer;
		// address payable payee;
		address payee;
		uint discountRate;
		// InvoiceState invoiceStatus;
		AdvanceState advanceStatus;
	}

	modifier onlyBy(address _account)
    {
        require(
            msg.sender == _account,
            "Sender not authorized."
        );
        _;
    }

    modifier sufficientFund(address _account, uint256 _invoiceAmount)
    {
        require(
            _account.balance >= _invoiceAmount,
            "Insufficient credit to provide advance."
        );
        _;
    }

	function add_invoice(uint256 _invoiceID, address _payeeAddress) public {
		Invoice storage invoice = invoices[_invoiceID];
		invoice.id = _invoiceID;
		invoice.payer = msg.sender;
		invoice.payee = _payeeAddress;
		// invoice.invoiceStatus = InvoiceState.Drafted;
		invoice.advanceStatus = AdvanceState.NoAction;
	}

	function request_advance(uint256 _invoiceID) public onlyBy(invoices[_invoiceID].payee){

		Invoice storage invoice = invoices[_invoiceID];

		require ( invoice.advanceStatus == AdvanceState.NoAction);
		
		invoice.advanceStatus = AdvanceState.Requested;
	}

	function approve_advance(uint256 _invoiceID, uint256 _discountRate) public onlyBy(invoices[_invoiceID].payer){
		Invoice storage invoice = invoices[_invoiceID];

		require ( invoice.advanceStatus == AdvanceState.Requested);

		invoice.advanceStatus = AdvanceState.Approved;
		invoice.discountRate = _discountRate;
	}

	function grant_advance(uint256 _invoiceID, uint256 _invoiceAmount) public payable sufficientFund(msg.sender, _invoiceAmount){

		Invoice storage invoice = invoices[_invoiceID];

		require ( invoice.advanceStatus == AdvanceState.Approved);
		
		// address payable payeeAddress = invoice.payee;

		address payeeAddress = invoice.payee;
		// payeeAddress.send(_invoiceAmount);
		invoice.payee = msg.sender;
	}

	// function close() public onlyBy(owner){
	// 	selfdestruct(owner);	
	// }	

}