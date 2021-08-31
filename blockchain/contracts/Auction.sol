// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./ItemStorage.sol";

contract Auction is ItemStorage {
  mapping (address => uint256) balances;

  address charityAddress;

  event NewBid(uint256 _itemId, address _bidder, uint256 _bid);

  constructor(address _charityAddress) public {
    charityAddress = _charityAddress;
  }

  function bid(uint256 _itemId) public beforeEndTime payable {
    require(balances[msg.sender] + msg.value > items[_itemId].highestBid);

    items[_itemId].highestBidder = msg.sender;
    items[_itemId].highestBid = balances[msg.sender] + msg.value;
    balances[msg.sender] += msg.value;

    emit NewBid(_itemId, msg.sender, msg.value);
  }
}
