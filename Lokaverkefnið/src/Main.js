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
            const currentDate = new Date();
            let jsonObj = JSON.parse(data);
            
            // Filter events so the closest one is on top
            jsonObj = jsonObj.filter(item => {
              const eventDate = new Date(item.dagsetning_vidburds);
              return eventDate >= currentDate;
            });
            // now i need to short it so on top is the closest to current date
            jsonObj.sort((a, b) => {
              const dateA = new Date(a.dagsetning_vidburds);
              const dateB = new Date(b.dagsetning_vidburds);
              return dateA - dateB;
            });

            // i need the datas to be in the icelandic format
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            jsonObj.forEach(item => {
              const date = new Date(item.dagsetning_vidburds);
              item.dagsetning_vidburds = date.toLocaleDateString('is-IS', options);
            });


            console.log(jsonObj);
            for (let i = 0; i < jsonObj.length; i++) {
              template([jsonObj[i]]); // Pass the object as an array
            }

            const maxVal = Math.max(...jsonObj.map(item => item.verd_vidburds));
            const minVal = Math.min(...jsonObj.map(item => item.verd_vidburds));
                        
            let i = document.getElementById('peningur'),
            o = document.querySelector('output');
            
        

            i.min = minVal;
            i.max = maxVal;

            // i need to have steps in my slider so i can choose the price also need it to be dynamic with the i.maxval and i.minval
            i.step = 1000;



            i.value = maxVal; 
            o.innerHTML = maxVal; 

            i.addEventListener('input', function () {
              const selectedValue = parseFloat(i.value);
              o.innerHTML = selectedValue;
              // Hide or show elements based on the selected value
              const elementsToToggle = document.querySelectorAll('.itemToRemove');
              elementsToToggle.forEach(element => {
                  const verdValue = parseFloat(element.getAttribute('data-verd'));
                  if (verdValue <= selectedValue) {
                      element.style.display = 'block'; // Show the element
                  } else {
                      element.style.display = 'none'; // Hide the element
                  }
              });
          }, false);
          
          
          

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

      // Inside the template function
      aTag.classList.add('itemToRemove'); // Add the class
      aTag.setAttribute('data-verd', obj.verd_vidburds); // Set the data-verd attribute



    });

    document.getElementById('maincontent').appendChild(divContainer); // Add single quotes around 'maincontent'
  }
};