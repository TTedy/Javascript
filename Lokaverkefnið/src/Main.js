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
              // console.log("");
              // console.log("");
              // console.log(jsonObj[i])
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
    let divContainer = document.createElement('div');
    divContainer.classList.add('text-white', 'p-2', 'space-y-2'); // Example classes for container, customize as needed

    data.forEach(obj => {
      // Create an <a> tag
      let aTag = document.createElement('a');
      aTag.classList.add('shadow-xl'); // Example classes for <a> tag, customize as needed
      aTag.href = '#'; // Set the href attribute to your desired link

      let divItem = document.createElement('div');
      divItem.classList.add('bg-primary', 'p-2', 'border', 'border-primary', 'rounded-xl', 'shadow-xl', 'hover:bg-green-400','hover:border-green-400'); // Example classes for item container, customize as needed

      let itemText = document.createElement('p');
      itemText.textContent = `${obj.verd_vidburds}: ${obj.stadsetning_vidburds} ${obj.nafn_vidburds} ${obj.dagsetning_vidburds}`;
      itemText.classList.add('text-black'); // Example text color class, customize as needed

      // Append the itemText to the <div> inside the <a> tag
      divItem.appendChild(itemText);

      // Append the <div> (with classes) to the <a> tag
      aTag.appendChild(divItem);

      // Append the <a> tag to the container
      divContainer.appendChild(aTag);
    });

    document.getElementById('maincontent').appendChild(divContainer); // Add single quotes around 'maincontent'
  }














};