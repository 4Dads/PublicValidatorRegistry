const envPrefix = 'https://coston-api.flare.network';
const explorerPrefix = 'https://coston-explorer.flare.network'
const web3 = new Web3(envPrefix+'/ext/C/rpc');
const contractAddress = '0x17f3499f2b6994020a71c53317d987cFbE3Df48e';
const contractURL = explorerPrefix+'/address/'+contractAddress;

const contractABI = [
  {
      "constant": true,
      "inputs": [],
      "name": "getAllProviderInformation",
      "outputs": [
          {
              "name": "",
              "type": "string[]"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_jsonProviderInformation",
              "type": "string"
          }
      ],
      "name": "registerProviderInformation",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

function minifyJSON() {
    const address = document.getElementById('address').value.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    const name = encodeURIComponent(document.getElementById('name').value.replace(/"/g,'&quot;').replace(/'/g,'&#39;'));
    const nodeID = document.getElementById('nodeID').value; //todo: verify byte20, length = 40
    const url = encodeURIComponent(document.getElementById('url').value.replace(/"/g,'&quot;').replace(/'/g,'&#39;'));
    const logourl = encodeURIComponent(document.getElementById('logourl').value.replace(/"/g,'&quot;').replace(/'/g,'&#39;'));
  
    let data = {
      address: address,
      name: name,
      nodeID: [nodeID], 
      url: url,
      logourl: logourl
    };
  
    const jsonString = '"'+JSON.stringify(data).replace(/\s/g, "").replace('{','').replace('}','').replace(/"/g,"'")+'"';
    document.getElementById('minifiedOutput').value = jsonString;
  }
  
  function copyToClipboard() {
    const minifiedOutput = document.getElementById('minifiedOutput');
    const textToCopy = minifiedOutput.value;
  
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Minified JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy minified JSON. Please copy it manually.');
      });
  }

  async function getAllProviderInformation() {
    try {
      const result = await contract.methods.getAllProviderInformation().call();
      const data = result[0];
      console.log(data);
      //const utf8String = web3.utils.hexToUtf8(hexData);
      //console.log(hexData);
      const jsonString = JSON.parse(JSON.stringify(data));
      console.log(jsonString);
      alert(jsonString);
      console.log('Return:', jsonString);
    } catch (error) {
      if (error.message) {
        console.error('Error Message:', error.message);
      }
    }
  }

function openContract() {
    return contractURL;
}

function stringToHex(str) {
  const hex = Array.from(new TextEncoder().encode(str))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  return '0x' + hex;
}

async function sendFormattedJSON() {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const senderAddress = accounts[0];

    const address = document.getElementById('address').value;
    const name = document.getElementById('name').value;
    const nodeID = document.getElementById('nodeID').value;
    const url = document.getElementById('url').value;
    const logourl = document.getElementById('logourl').value;

    const data = {
      address: address,
      name: name,
      nodeID: nodeID,
      url: url,
      logourl: logourl
    };

    const transactionParameters = {
      to: contractAddress,
      from: senderAddress,
      gas: '1000000',
      data: contract.methods.registerProviderInformation(JSON.stringify(data)).encodeABI()
    };

    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    alert('Registered! Transaction Hash: ' + transactionHash);
  } catch (error) {
    console.error('Error sending transaction:', error);
    alert('Failed to send transaction. Check console for details.');
  }
}



async function sendToChain(data) {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const senderAddress = accounts[0];
  const transactionParameters = {
    to: contractAddress,
    from: senderAddress,
    gas: '1000000',
    data: data
  };

  const transactionHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });

  return transactionHash;
}

function hexToUtf8(hex) {
  const utf8String = web3.utils.hexToUtf8(hex);
  console.log(utf8String);
  return JSON.parse(utf8String);
}

function encodeData(data) {
  //data.nodeID = Array.isArray(data.nodeID) ? data.nodeID.filter(node => node !== "") : [];
  const jsonStr = JSON.stringify(data);
  const utf8Hex = web3.utils.utf8ToHex(jsonStr);
  return utf8Hex;
}