const { advanceTime, shouldThrow } = require("../utils");

const ItemStorage = artifacts.require("ItemStorage");

contract("ItemStorage", ([owner, alice, bob]) => {
  let contractInstance;

	beforeEach(async () => {
		contractInstance = await ItemStorage.new();
	});

  it("should register items", async () => {
    const { logs } = await contractInstance.registerItem("Painting", "link", 1, {from: alice});
  
    assert.equal(logs[0].args._name, "Painting");
    assert.equal(logs[0].args._link, "link");
    assert.equal(logs[0].args._minAmount, 1);

    const item = await contractInstance.items(0);
    
    assert.equal(item.name, "Painting");
    assert.equal(item.link, "link");
    assert.equal(item.minAmount, 1);

    const owner = await contractInstance.itemToOwner(0);
    assert.equal(owner, alice);
  });

  it("shouldn't register items after end time", async () => {
    await advanceTime(2 * 24 * 60 * 60);
    await shouldThrow(
      contractInstance.registerItem("Painting", "https://link/to/img", 1)
    );
  });

  it("should list items", async () => {
    await contractInstance.registerItem("Painting", "https://link/to/img", 1, {from: alice});
    await contractInstance.registerItem("Vase", "https://link/to/vase_img", 2, {from: bob});

    const items = await contractInstance.getItems({from: alice});
    assert.equal(items.length, 2);
  });


});
