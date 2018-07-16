console.log("INIT hello");

//Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
} else {
  console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
}

console.log("START");

window.App = {
  start: function() {
    console.log("START");

    // Get my account in blockchain
    web3.eth.getAccounts(function(error, accs) {
      if (error != null) {
        alert("There was an error fetching your accounts.");
        return;
      };

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      };

      account = accs[0];
      console.log("ACCOUNT: ", account);
    });
  },

  showInfo: function() {
    // Get values from inputs (address and number of blocks to scan)
    console.log("SHOW INFO");
    var address = document.getElementById("address_input").value;
    console.log("ADDRESS: ", address);
    var blocksToScan = document.getElementById("blocks_input").value ? document.getElementById("blocks_input").value : 2;
    console.log("BLOCKS TO SCAN: ", blocksToScan);

    // Get balance of the given address
    web3.eth.getBalance(address, function(error, balance) {
      if (!error) {
        console.log("BALANCE: ", balance.toNumber());
        var balance_element = document.getElementById("balance");
        balance_element.innerHTML = balance;
      } else {
        console.log("ERROR: web3.eth.getBalance");
      }
    });

    // Get number of transactions of the given address
    web3.eth.getTransactionCount(address, function(error, cnt) {
      if (!error) {
        console.log("COUNT: ", cnt);
        var number_element = document.getElementById("number");
        number_element.innerHTML = cnt;
      } else {
        console.log("ERROR: web3.eth.getTransactionCount");
      }
    });
    

    // Get all transactions connected with the given address from the last block
    var txs = "";
    web3.eth.getBlockNumber(function(error, number) {
      if (!error) {
        console.log("NUMBER: ", number);
        for (var i = number; i > number - blocksToScan; i--) {
          web3.eth.getBlock(i, function(error, block) {
            if (!error) {
              var transactions = block.transactions;
              if (transactions.length > 0) {
                // console.log("LENGTH: ", transactions.length);
                for (j = 0; j < transactions.length; j++) {
                  var tx = transactions[j];
                  // console.log("TX: ", tx);
                  web3.eth.getTransactionReceipt(tx, function(error, receipt) {
                    if (!error) {
                      if ((receipt.from != null && receipt.to != null) && (receipt.from == address || receipt.to == address)) {
                        // console.log(receipt);
                        txs += 'blockHash: ' + receipt.blockHash + '<br>' + 'transactionHash: ' + receipt.transactionHash + '<br>' + 'from: ' + receipt.from + '<br>' + 'to: ' + receipt.to + '<br>' + '<br>';
                        var tx_element = document.getElementById("tx");
                        tx_element.innerHTML = txs;
                      }
                    } else {
                      console.log("ERROR: web3.eth.getTransactionReceipt");
                    }
                  });
                };
              };
            } else {
              console.log("ERROR: web3.eth.getBlock");
            };
          });
        }
      } else {
        console.log("ERROR: web3.eth.gtBlockNumber");
      }
    });
    console.log("LENGTH: ", txs.length);
  }
};

window.addEventListener('load', function() {
  console.log('LISTENER');
  App.start();
});