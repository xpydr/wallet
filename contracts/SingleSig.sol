// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SingleSig {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    // Receive ETH
    receive() external payable {}

    // Withdraw ETH
    function withdraw(address payable _to, uint _amount) external {
        require(msg.sender == owner, "Not authorized");
        require(address(this).balance >= _amount, "Insufficient balance");
        _to.transfer(_amount);
    }

    // Withdraw ERC20 tokens
    function withdrawToken(address token, address _to, uint _amount) external {
        require(msg.sender == owner, "Not authorized");
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", _to, _amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Token transfer failed");
    }
}
