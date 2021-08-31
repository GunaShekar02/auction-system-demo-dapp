App = {
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.loadItems();
    await App.listen();
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert('Please connect to Metamask.')
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
    }
    // Non-dapp browsers...
    else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
      )
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = (await web3.eth.getAccounts())[0]
  },

  loadContract: async () => {
    App.contract = new web3.eth.Contract(abi, address);
  },

  loadItems: async () => {
    const items = await App.contract.methods.getItems().call();
    
    let elements = $();
    items.forEach(item => {
      elements = elements.add("<div>" + item.name + " $" + item.minAmount + "</div>");
    })

    $("body").append(elements);
  },

  registerItem: async () => {
    const name = $("#name").val();
    const minAmount = $("#minAmount").val();
    const link = "https://i1.wp.com/lanecdr.org/wp-content/uploads/2019/08/placeholder.png?w=1200&ssl=1";

    const receipt = await App.contract.methods.registerItem(name, link, minAmount).send({from: App.account});
    console.log(receipt);
  },

  listen: async () => {
    console.log("Listening...");
    App.contract.events.NewItem(async (err, event) => {
      $("body").append("<div>" + event.returnValues._name + " $" + event.returnValues._minAmount + "</div>");
    })
  },
}

$(document).ready(() => {
  App.load()
})