//testing input for json

//const {gzip, ungzip} = require('node-gzip');
const jsonminify = require("jsonminify");

let data = {
  "address": "0x30339DFfD7953259e6Ae934c285F9d3179b110D6",
  "name": "4dads", //test comment to clean
  "nodeID": ["NodeID-CoNH4gyEwB9gTrEmozwh14Zr8hs6wokRS"],
  "url": "4dads.io",
  //returned line
  "logourl": "abc123"
};

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log('not a valid json format')
    return false;
  }
  return true;
}

if (isJsonString) {
  data = jsonminify(JSON.stringify(data, null, 2)).toString();

  console.log('\"'+data.replace(/"/g, "'").replace('{','').replace('}','')+'\"');
}

//**********************************************************************

//testing http call

/*const Web3 = require('web3');
const web3 = new Web3('https://coston-api.flare.network/ext/C/rpc'); 

const contractAddress = '0x32580c46242F7C3D6AF86DdF10D82f2Af32cf558'; 
const contractABI = [
    {
        constant: true,
        inputs: [],
        name: 'getAllOwnersAndNodes',
        outputs: [
            {
                name: 'owners',
                type: 'address[]'
            },
            {
                name: 'nodes',
                type: 'string[]'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getAllOwnersAndNodes() {
    try {
        const result = await contract.methods.getAllOwnersAndNodes().call();
        const owners = result[0];
        const nodes = result[1];

        console.log('Owners:', owners);
        console.log('Nodes:', nodes);
    } catch (error) {
        console.error('Error:', error);
    }
}

getAllOwnersAndNodes();*/

//**********************************************************************