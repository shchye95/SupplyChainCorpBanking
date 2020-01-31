pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SmartCredit{

	address public owner = msg.sender; // Used to ensure that approver for credit is the owner
	uint256 public buyerCount = 0;
	mapping (uint256 => Buyer) public buyers;
	
	struct Buyer{

		uint256 id;
		address buyerWallet;
		uint256 creditLimit;
		uint256[] invoices;

	}

	uint256 public applicantCount = 0;
	mapping (uint256 => Applicant) public applicants;
	// Applicant[] public applicants;
	enum ApplicationState {Pending, Rejected, Approved}

	struct Applicant{

		uint256 id;
		address walletAddress;
		ApplicationState status;
		address approver;

	}

	modifier onlyBy(address _account)
    {
        require(
            msg.sender == _account,
            "Sender not authorized."
        );
        _;
    }

    modifier sufficientCredit(int256 _remainingAmount)
    {
        require(
            _remainingAmount >= 0,
            "Insufficient credit to create more invoice."
        );
        _;
    }

	function add_buyer(address _walletAddress, uint256 _creditLimit) private{
		
		buyerCount ++;
		Buyer storage buyer = buyers[buyerCount];
		buyer.id = buyerCount;
		buyer.buyerWallet = _walletAddress;
		buyer.creditLimit = _creditLimit;

	}

	function apply_credit() public{

		applicantCount ++;
		Applicant storage applicant = applicants[applicantCount];
		applicant.id = applicantCount;
		applicant.walletAddress = msg.sender;
		applicant.status = ApplicationState.Pending;
		applicant.approver = owner;

		// applicants.push(Applicant(applicantCount ,msg.sender, ApplicationState.Pending, _approver));
		
	}

	function approve_credit(uint256 _applicantID,uint256 _creditLimit) public onlyBy(applicants[_applicantID].approver){

		Applicant storage applicant = applicants[_applicantID];

		require (applicant.status == ApplicationState.Pending);

		applicant.status = ApplicationState.Approved;
		add_buyer(applicant.walletAddress , _creditLimit);

	}

	function reject_credit(uint256 _applicantID,uint256 _creditLimit) public onlyBy(applicants[_applicantID].approver){

		Applicant storage applicant = applicants[_applicantID];

		require (applicant.status == ApplicationState.Pending);
		
		applicant.status = ApplicationState.Rejected;

	}

	function add_invoice(uint256 _buyerID, uint256 _invoiceID, uint256 _invoiceAmount) public onlyBy(buyers[_buyerID].buyerWallet) sufficientCredit(int(buyers[_buyerID].creditLimit - _invoiceAmount)){

		Buyer storage buyer = buyers[_buyerID];

		require (_buyerID <= buyerCount);

		buyer.invoices.push(_invoiceID);
		// Deduct credit limit
		buyer.creditLimit -= _invoiceAmount;
	}

	function remove_invoice(uint256 _buyerID, uint256 _invoiceAmount) public onlyBy(buyers[_buyerID].buyerWallet){

		Buyer storage buyer = buyers[_buyerID];
		// buyer.invoices.push(_invoiceAddress);
		// Add credit limit back
		buyer.creditLimit += _invoiceAmount;

	}

	// function close() public onlyBy(owner){
	// 	selfdestruct(owner);	
	// }

}