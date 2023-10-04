document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    console.log('DOM is ready');
    Start();
  });
  

function Start(){
  console.log('Start');

  async function fetchText() {
    let response = await fetch('./vidburdir.json');

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.text();
        try {
            let jsonObj = JSON.parse(data);
            // Handle jsonObj, which is now a JavaScript object.
            console.log(jsonObj);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    } else {
        console.log('Error');
    }
}

fetchText();


// data er array með item og price
function template(data) {
  let ulNode = document.createElement('ul');
  let nodes = data.map(obj => {
    let li = document.createElement('li');
    li.textContent = `${obj.item}: ${obj.price} kr.`;
    return li;
  });
  ulNode.append(...nodes); // Bætum li við ul með append og spread syntax.
  document.body.append(ulNode); // Birtum lista í html.
}

for (let i = 0; i < jsonObj.length; i++) {
  console.log(jsonObj[i].item);
  console.log(jsonObj[i].price);
  template(jsonObj[i]);
}








};