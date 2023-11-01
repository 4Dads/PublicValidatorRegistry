function minifyJSON() {
    const address = document.getElementById('address').value;
    const name = document.getElementById('name').value;
    const nodeID = document.getElementById('nodeID').value;
    const url = document.getElementById('url').value;
    const logourl = document.getElementById('logourl').value;
  
    const data = {
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