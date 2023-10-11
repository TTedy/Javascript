document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    console.log('DOM is ready');
    start();
  });
  
function start(){
  console.log('Start');

  async function fetchText() {
    try {
        // Fetch the JSON data
        const response = await fetch('./vidburdir.json');
        if (response.status !== 200) {
            console.log('Error: Unable to fetch data');
            return;
        }

        // Parse the JSON data
        const data = await response.text();
        const currentDate = new Date();
        let jsonObj = JSON.parse(data);

        // Filter events to keep only future events
        jsonObj = jsonObj.filter(item => {
            const eventDate = new Date(item.dagsetning_vidburds);
            return eventDate >= currentDate;
        });

        // Sort events by date
        jsonObj.sort((a, b) => new Date(a.dagsetning_vidburds) - new Date(b.dagsetning_vidburds));

        // Set up the price slider
        const maxVal = Math.max(...jsonObj.map(item => item.verd_vidburds));
        const minVal = Math.min(...jsonObj.map(item => item.verd_vidburds));
        const i = document.getElementById('peningur');
        const o = document.querySelector('output');

        i.min = minVal;
        i.max = maxVal;
        i.step = 1000; // Set the step value for the slider

        i.value = maxVal;
        o.innerHTML = maxVal;

        // Add event listener for slider input
        i.addEventListener('input', function () {
            const selectedValue = parseFloat(i.value);
            o.innerHTML = selectedValue;
            updateDisplay(selectedValue);
        });

        // Add event listener for search input
        document.getElementById('search').addEventListener('input', function() {
            const searchText = document.getElementById('search').value;
            updateDisplayFromSearch(searchText);
        });


        // Add an event listener for the date input
        document.getElementById('date').addEventListener('input', function() {
            const inputDateText = document.getElementById('date').value;
            const inputDate = new Date(inputDateText); // Parse the input date

            // Convert the input date to Icelandic date format
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const icelandicDate = inputDate.toLocaleDateString('is-IS', options);

            // Update the input value with the Icelandic date format
            document.getElementById('date').value = icelandicDate;

            // Update the display using the Icelandic date
            updateDisplayFromDate(icelandicDate);
        });

        function updateDisplay(selectedValue) {
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
        }

        function updateDisplayFromSearch(searchText) {
            // Hide or show elements based on the search text
            const elementsToToggle = document.querySelectorAll('.itemToRemove');
            elementsToToggle.forEach(element => {
                const eventText = element.textContent.toLowerCase();
                if (eventText.includes(searchText.toLowerCase())) {
                    element.style.display = 'block'; // Show the element
                } else {
                    element.style.display = 'none'; // Hide the element
                }
            });
        }

        function updateDisplayFromDate(dateText) {
            console.log(jsonObj[1].dagsetning_vidburds,"inni")
            console.log(dateText,"inni")
            // Parse the selected date in the Icelandic date format
            const selectedDate = new Date(dateText + 'T00:00:00.000Z');
        
            // Hide or show elements based on the selected date
            const elementsToToggle = document.querySelectorAll('.itemToRemove');
            elementsToToggle.forEach(element => {
                const eventDateText = element.getAttribute('data-date'); // Assuming you have a data-date attribute with the event date in Icelandic date format
        
                // Parse the event date in the Icelandic date format
                const eventDate = new Date(eventDateText + 'T00:00:00.000Z');
        
                if (eventDate >= selectedDate) {
                    element.style.display = 'block'; // Show the element (event is on or after the selected date)
                } else {
                    element.style.display = 'none'; // Hide the element (event is before the selected date)
                }
            });
        }
        
        








        
        // Format dates in Icelandic
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        jsonObj.forEach(item => {
            const date = new Date(item.dagsetning_vidburds);
            item.dagsetning_vidburds = date.toLocaleDateString('is-IS', options);
        });

        // Display events
        console.log(jsonObj);
        for (let i = 0; i < jsonObj.length; i++) {
            template([jsonObj[i]]); // Pass the object as an array
        }        
        console.log(jsonObj[1].dagsetning_vidburds)
    }
    

    catch (error) {
        console.error('Error:', error);
    }
}

fetchText();

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