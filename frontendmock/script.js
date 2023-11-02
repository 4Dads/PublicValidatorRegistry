const envPrefix = 'https://coston-api.flare.network';
const explorerPrefix = 'https://coston-explorer.flare.network'
const web3 = new Web3(envPrefix+'/ext/C/rpc');
const contractAddress = '0x32580c46242F7C3D6AF86DdF10D82f2Af32cf558';
const contractURL = explorerPrefix+'/address/'+contractAddress;

const contractABI =[
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
  
    const jsonString = '\"'+JSON.stringify(data).replace(/\s/g, '').replace(/"/g, "'").replace('{','').replace('}','')+'\"';
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
        const data = result;
        //const nodes = result[1];

        console.log('Return:', data);
        //console.log('Nodes:', nodes);
    } catch (error) {
        //console.error('Error:', error);
        if (error.message) {
            console.error('Error Message:', error.message);
          }
    }
}

function openContract() {
    return contractURL;
}

async function sendFormattedJSON() {
    try {
        const formattedJSON = document.getElementById('minifiedOutput').value;
        const transactionHash = await sendToChain(formattedJSON);
        alert('Registered! Transaction Hash: ' + transactionHash);

    } catch (error) {
        console.error('Error sending transaction:', error);
        alert('Failed to send transaction check console');
    }
}

async function sendToChain(data) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const senderAddress = accounts[0];
    const contractMethod = contract.methods.registerProviderInformation(data);

    const transactionParameters = {
        to: contractAddress,
        from: senderAddress,
        gas: '2000000',
        data: contractMethod.encodeABI()
    };

    const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    });

    return transactionHash;
}