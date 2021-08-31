// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract ItemStorage {
  uint public endTime = block.timestamp + 1 days;

  struct Item {
    string name;
    string link;
    uint256 minAmount;
    uint256 highestBid;
    address highestBidder;
  }

  Item[] public items;

  mapping (uint256 => address) public itemToOwner;

  event NewItem(string _name, string _link, uint256 _minAmount);

  modifier beforeEndTime() {
    require(block.timestamp < endTime);
    _;
  }

  function registerItem(string memory _name, string memory _link, uint256 _minAmount) public beforeEndTime {
    items.push(Item(_name, _link, _minAmount, 0, address(0)));
    uint _id = items.length - 1;

    itemToOwner[_id] = msg.sender;

    emit NewItem(_name, _link, _minAmount);
  }

  function getItems() public view returns(Item[] memory) {
    return items;
  }
}
