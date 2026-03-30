const addPatientButton=document.getElementById("addPatient");
//The button used to add patient data
const report=document.getElementById("report");
//The HTML element where you will see analysis reports displayed
const btnSearch=document.getElementById("btnSearch");
//The variable name of the button which displays the search results when clicked
const patients=[];
//An empty array named patients is also created to store the collected patient data.

function addPatient(){
    const name=document.getElementById("name").value;
    const gender=document.querySelector('input[name="gender"]:checked');
    const age=document.getElementById("age").value;
    const condition=document.getElementById("condition").value;

    if(name && gender && age && condition){
        patients.push({name,gender:gender.value,age,condition});
        //appends the patient's details to the patients[] array, which stores all entered patient data using the push() method
        resetForm();
        //resets the form fields using the resetForm() method to clear the input fields for the next entry
        generateReport();
        //triggers the generateReport() method to update and display the analysis report based on the newly added patient data
    }
}

//function to reset the form fields after adding a patient
function resetForm(){
    document.getElementById("name").value="";
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
    document.getElementById("age").value="";
    document.getElementById("condition").value="";
}
//This generateReport() function calculates and constructs an analysis report based on the collected patient data stored in the patients[] array.
function generateReport(){
    const numPatients=patients.length;
    //numPatients Represents the total number of patients stored in the patients[] array
    const conditionCount={
        Diabetes:0,
        Thyroid:0,
        "High Blood Pressure":0,
    };
    //conditionsCount A data structure (object) initializing counters for specific medical conditions (Diabetes, Thyroid, High Blood Pressure), initially set to zero.
    const genderConditionsCount={
        Male:{
            Diabetes:0,
            Thyroid:0,
            "High Blood Pressure":0,
        },
        Female:{
            Diabetes:0,
            Thyroid:0,
            "High Blood Pressure":0,
        },
    };
//genderConditionsCount A nested object with gender-specific condition counters ( male and female) for each medical condition, also initialized to zero for each condition
    for(const patient of patients){
        //Iterates through the patients[] array: Utilizes a for…of loop to iterate through each patient's data within the patients[] array
        conditionCount[patient.condition]++;
        //Increment condition counts: Increments the count for each patient's specific medical condition in the conditionsCount object.
        genderConditionsCount[patient.gender][patient.condition]++;
        //Updating gender-based condition counts: Increases the count of each medical condition within the respective gender category in the genderConditionsCount object based on the patient's gender and condition
        }

        report.innerHTML=`Number of patients: ${numPatients}<br><br>`;
        //Total patients display: Displays the total number of patients
        report.innerHTML+=`Condition Breakdown:<br>`;
        //Conditions breakdown: Lists the counts for each medical condition in the conditionsCount object
        for(const condition in conditionCount){
            report.innerHTML+=`${condition}: ${conditionCount[condition]}<br>`;
        }
        report.innerHTML+=`<br>Gender-Based Conditions:<br>`;
        //Gender-based conditions display: Illustrates counts of each condition categorized by gender in the genderConditionsCount object, showing the distribution of conditions among males and females separately.
        for (const gender in genderConditionsCount){
            report.innerHTML+=`&nbsp;&nbsp;${gender}:<br>`;
            for(const condition in genderConditionsCount[gender]){
                report.innerHTML+=`&nbsp;&nbsp;&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
            }
        }
}


addPatientButton.addEventListener("click",addPatient);


function searchCondition(){
    // is designed to work within a web page to retrieve health condition information based on user input.
    const input=document.getElementById("conditionInput").value.toLowerCase();
    //This retrieves the value entered into the input field with the ID conditionInput. It converts the entered text to lowercase to ensure case-insensitive comparison.
    const resultDiv=document.getElementById("result");
    //This retrieves the HTML element with the ID 'result'. It clears any previous content within this HTML element.
    resultDiv.innerHTML="";

    fetch("health_analysis.json")
    // This API method initiates a fetch request to the file named 'health_analysis.json'. It assumes a JSON file named 'health.json' is in the same directory as the HTML file.
    .then(response => response.json())
    //Converts the fetched response into JSON format.
    .then(data => {
        //This handles the retrieved JSON data. It searches for a health condition that matches the user input.
        const condition=data.conditions.find(item => item.name.toLowerCase() === input);
        //This searches within the JSON data for a health condition whose name matches the entered input.

        if(condition){
            //This code checks for a matching condition. If found, it constructs HTML content to display details about the condition (name, symptoms, prevention, treatment) within the resultDiv. If the system cannot find a matching condition, it displays a 'Condition not found' message within the resultDiv
            const symptoms=condition.sysptoms.join(", ");
            const prevention=condition.prevention.join(", ");
            const treatment=condition.treatment;

            resultDiv.innerHTML+=`<h2>${condition.name}</h2>`;
            resultDiv.innerHTML+=`<img src="${condition.imagesrc}" alt="hjh">`;

            resultDiv.innerHTML+=`<p><strong>Symptoms:</strong> ${symptoms}</p>`;
            resultDiv.innerHTML+=`<p><strong>Prevention:</strong> ${prevention}</p>`;
            resultDiv.innerHTML+=`<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
            resultDiv.innerHTML=`<p>Condition not found. Please try again.</p>`;
        }
    })

    .catch(error => {
        //This handles any errors that might occur during the fetch request or data processing. If an error occurs, it logs it to the console and displays an error message within the resultDiv.
        console.error("Error: ", error);
        resultDiv.innerHTML=`<p>Error fetching condition data. Please try again later.</p>`;
    });
}

btnSearch.addEventListener("click",searchCondition);