document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    console.log('DOM is ready');
    start();
  });
  
function start(){
  console.log('Start');

  async function fetchText() {
    let response = await fetch('./vidburdir.json');
    console.log("fetchText")

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.text();
        try {
            let jsonObj = JSON.parse(data);
            // Handle jsonObj, which is now a JavaScript object.
            console.log(jsonObj);
            for (let i = 0; i < jsonObj.length; i++) {
              //console.log(jsonObj[i].item);
              //console.log(jsonObj[i].price);
              console.log("");
              console.log("");
              console.log(jsonObj[i])
              template([jsonObj[i]]); // Pass the object as an array
            }
            

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
  let ulNode = document.createElement('div'); // Remove the space after 'ul'
  let nodes = data.map(obj => {
    let li = document.createElement('div');
    li.textContent = `${obj.verd_vidburds}: ${obj.stadsetning_vidburds} ${obj.nafn_vidburds} ${obj.dagsetning_vidburds} ${obj.vefslod_myndar}`;
    return li;
  });
  ulNode.append(...nodes); // Bætum li við ul með append og spread syntax.
  document.getElementById('maincontent').append(ulNode); // Add single quotes around 'maincontent'
}












};