// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <=0.8.17;

contract BankAccount {
    event Deposit(
        address indexed user,
        uint256 indexed accountId,
        uint256 value,
        uint256 timestamp
    );
    event WithdrawRequested(
        address indexed user,
        uint256 indexed accountId,
        uint256 indexed withdrawId,
        uint256 amount,
        uint256 timestamp
    );
    event Withdraw(uint256 indexed withdrawId, uint256 timestamp);
    event AccountCreated(
        address[] owners,
        uint256 indexed id,
        uint256 timestamp
    );

    struct WithdrawRequest {
        address user;
        uint256 amount;
        uint256 approvals;
        mapping(address => bool) ownersApproved;
        bool approved;
    }

    struct Account {
        address[] owners;
        uint256 balance;
        mapping(uint256 => WithdrawRequest) withdrawRequests;
    }

    mapping(uint256 => Account) accounts;
    mapping(address => uint256[]) userAccounts;

    uint256 nextAccountId;
    uint256 nextWithdrawId;

    modifier accountOwner(uint256 accountId) {
        bool isOwner;
        for (uint256 idx; idx < accounts[accountId].owners.length; idx++) {
            if (accounts[accountId].owners[idx] == msg.sender) {
                isOwner = true;
                break;
            }
        }

        require(isOwner, "You are not a owner of this account");
        _;
    }

    modifier validOwners(address[] calldata owners) {
        require((owners.length + 1) <= 4, "Maximum of 4 owners per account.");
        for (uint256 i; i < owners.length; i++) {
            if(owners[i] == msg.sender) {
                revert("No duplicate owners allowed.");
            }

            for (uint256 j = i + 1; j < owners.length; j++) {
                if (owners[i] == owners[j]) {
                    revert("No duplicate owners allowed.");
                }
            }
        }

        _;
    }

    modifier sufficientBalance(uint256 accountId, uint256 amount) {
        require(accounts[accountId].balance >= amount, "Insufficient funds.");
        _;
    }

    modifier canApprove(uint256 accountId, uint256 withdrawId) {
        require(
            !accounts[accountId].withdrawRequests[withdrawId].approved,
            "This withdraw request has already been approved."
        );
        require(
            accounts[accountId].withdrawRequests[withdrawId].user != msg.sender,
            "You cannot approve your own request."
        );
        require(
            accounts[accountId].withdrawRequests[withdrawId].user != address(0),
            "This request doesn't exist."
        );
        require(
            !accounts[accountId].withdrawRequests[withdrawId].ownersApproved[
                msg.sender
            ],
            "You have approved this request already."
        );
        _;
    }

    modifier canWithdraw(uint256 accountId, uint256 withdrawId) {
        require(
            accounts[accountId].withdrawRequests[withdrawId].user == msg.sender,
            "Only the author of the approved request can withdraw."
        );
        require(
            accounts[accountId].withdrawRequests[withdrawId].approved,
            "The request has not been approved yet."
        );

        _;
    }

    function deposit(uint256 accountId)
        external
        payable
        accountOwner(accountId)
    {
        accounts[accountId].balance += msg.value;
    }

    function createAccount(address[] calldata otherOwners)
        external
        validOwners(otherOwners)
    {
        address[] memory owners = new address[](otherOwners.length + 1);
        owners[otherOwners.length] = msg.sender;

        uint256 id = nextAccountId;

        for (uint256 idx; idx < owners.length; idx++) {
            if (idx < owners.length - 1) {
                owners[idx] = otherOwners[idx];
            }

            if (userAccounts[owners[idx]].length > 2) {
                revert("Users can have a maximum of 3 accounts.");
            }

            userAccounts[owners[idx]].push(id);
        }

        accounts[id].owners = owners;
        nextAccountId++;
        emit AccountCreated(owners, id, block.timestamp);
    }

    function requestWithdraw(uint256 accountId, uint256 amount)
        external
        accountOwner(accountId)
        sufficientBalance(accountId, amount)
    {
        uint256 id = nextWithdrawId;
        WithdrawRequest storage request = accounts[accountId].withdrawRequests[
            id
        ];
        request.user = msg.sender;
        request.amount = amount;
        nextWithdrawId++;
        emit WithdrawRequested(
            msg.sender,
            accountId,
            id,
            amount,
            block.timestamp
        );
    }

    function approveWithdraw(uint256 accountId, uint256 withdrawId)
        external
        accountOwner(accountId)
        canApprove(accountId, withdrawId)
    {
        WithdrawRequest storage request = accounts[accountId].withdrawRequests[
            withdrawId
        ];
        request.approvals++;
        request.ownersApproved[msg.sender] = true;
        if (request.approvals == accounts[accountId].owners.length - 1) {
            request.approved = true;
        }
    }

    function withdraw(uint256 accountId, uint256 withdrawId)
        external
        canWithdraw(accountId, withdrawId)
    {
        uint256 amount = accounts[accountId]
            .withdrawRequests[withdrawId]
            .amount;
        require(accounts[accountId].balance >= amount, "Insufficient funds.");

        accounts[accountId].balance -= amount;
        delete accounts[accountId].withdrawRequests[withdrawId];

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent);

        emit Withdraw(withdrawId, block.timestamp);
    }

    function getBalance(uint256 accountId) public view returns (uint256) {
        return accounts[accountId].balance;
    }

    function getOwners(uint256 accountId)
        public
        view
        returns (address[] memory)
    {
        return accounts[accountId].owners;
    }

    function getApprovals(uint256 accountId, uint256 withdrawId)
        public
        view
        returns (uint256)
    {
        return accounts[accountId].withdrawRequests[withdrawId].approvals;
    }

    function getAccounts() public view returns (uint256[] memory) {
        return userAccounts[msg.sender];
    }
}
