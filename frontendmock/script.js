const web3 = new Web3('https://coston-api.flare.network/ext/C/rpc');
const contractAddress = '0x32580c46242F7C3D6AF86DdF10D82f2Af32cf558'; 

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

