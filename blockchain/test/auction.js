const { shouldThrow, advanceTime } = require("../utils");

const Auction = artifacts.require("Auction");

contract("Auction", async ([charityAddress, alice, bob]) => {
  let contractInstance;

	beforeEach(async () => {
		contractInstance = await Auction.new(charityAddress);
    await contractInstance.registerItem("Painting", "https://link/to/img", 1, {from: alice});
	});

  it("should allow bidding on items", async () => {
    const {logs} = await contractInstance.bid(0, {from: bob, value: 2});

    assert.equal(logs[0].args._itemId, 0);
    assert.equal(logs[0].args._bidder, bob);
    assert.equal(logs[0].args._bid, 2);

    const item = await contractInstance.items(0);
    assert.equal(item.highestBid, 2);
    assert.equal(item.highestBidder, bob);
  });

  it("shouldn't allow bidding for lower than current highest bid", async () => {
    await shouldThrow(
      contractInstance.bid(0, {from: bob, value: 0.5})
    );
  });

  it("shouldn't allow bidding after end time", async () => {
    await advanceTime(2 * 24 * 60 * 60);
    await shouldThrow(
      contractInstance.bid(0, {from: bob, value: 2})
    );
  });
});
