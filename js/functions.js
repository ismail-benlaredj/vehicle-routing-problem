/************************* */

//DOM

/********************** */


///// INPUT

var populationInput = document.getElementById("nbr-of-population"),
    crossoverInput = document.getElementById("crossover-ratio"),
    mutationInput = document.getElementById("mutation-rate"),
    generationInput = document.getElementById("nbr-of-generations"),
    excuteBtn = document.getElementById("excute-btn");




////population input event

populationInput.addEventListener("input", () => {
    if (populationInput.value == "" || populationInput.value < 0) {
        populationInput.style.borderBottom = "3px solid red";
        populationInput.style.color = "red";
    } else {
        populationInput.style.borderBottom = "1px solid rgb(107, 107, 107)";
        populationInput.style.color = "";
    }

});


/////// crossover input event
crossoverInput.addEventListener("input", () => {
    if (crossoverInput.value == "" || crossoverInput.value < 0 || crossoverInput.value > 100) {
        crossoverInput.style.borderBottom = "3px solid red";
        crossoverInput.style.color = "red";
    } else {
        crossoverInput.style.borderBottom = "1px solid rgb(107, 107, 107)";
        crossoverInput.style.color = "";
    }


});

///////////// mutation input event

mutationInput.addEventListener("input", () => {
    if (mutationInput.value == "" || mutationInput.value < 0 || mutationInput.value > 100) {
        mutationInput.style.borderBottom = "3px solid red";
        mutationInput.style.color = "red";
    } else {
        mutationInput.style.borderBottom = "1px solid rgb(107, 107, 107)";
        mutationInput.style.color = "";
    }


});

////// generations  input event
generationInput.addEventListener("input", () => {
    if (generationInput.value == "" || generationInput.value < 0) {
        generationInput.style.borderBottom = "3px solid red";
        generationInput.style.color = "red";
    } else {
        generationInput.style.borderBottom = "1px solid rgb(107, 107, 107)";
        generationInput.style.color = "";
    }


});




/*********************************** */


///             SHOW RESULTS


/********************************** */

/// OUTPUT ELEMENT
var resultDiv = document.getElementById('results'),
    distanceElem = document.getElementById("distance-result"),
    vehiclUse = document.getElementById("vehicules-result"),
    routesRes = document.getElementById("routes-result")


distanceRoute = document.getElementById("distance-route-result"),
    numRoute = document.getElementById("num-route-result"),
    loadRoute = document.getElementById("vehicules-load-result"),
    vehicCapacityRes = document.getElementById("vehicules-capacity");


function showResults() {
    resultDiv.style.display = "block";
    routesRes.innerHTML = "";
    distanceElem.innerHTML = pop.membersOfPop[0].fitness;
    vehiclUse.innerHTML = pop.membersOfPop[0].dna.length;
    for (let i = 0; i < pop.membersOfPop[0].dna.length; i++) {
        var li = document.createElement("li");
        for (let j = 0; j < pop.membersOfPop[0].dna[i].length - 1; j++) {
            li.innerHTML += pop.membersOfPop[0].dna[i][j].custNo + " --> "
        }
        li.innerHTML += 0
        li.id = i;
        //  li.addEventListener("click", showOneRoute());
        li.onclick = showOneRoute;
        routesRes.appendChild(li);
    }
}

function showOneRoute() {
    routesCanvas.width = canvasWidth;
    routesCanvas.height = canvasHeight;
    ctxRoutes = routesCanvas.getContext('2d');
    let i = this.id;
    for (let j = 0; pop.membersOfPop[0].dna[i].length - 1 > j; j++) {
        ctxRoutes.beginPath(); // Start a new path.
        ctxRoutes.lineWidth = 2;
        ctxRoutes.strokeStyle = '#' + colors[i];
        ctxRoutes.moveTo(
            pop.membersOfPop[0].dna[i][j].Xcoord * 15,
            pop.membersOfPop[0].dna[i][j].Ycoord * 15
        );
        ctxRoutes.lineTo(
            pop.membersOfPop[0].dna[i][j + 1].Xcoord * 15,
            pop.membersOfPop[0].dna[i][j + 1].Ycoord * 15
        );
        ctxRoutes.stroke();

    }
    document.getElementById('selected-route').style.display = "block";
    numRoute.innerHTML = parseInt(i) + 1;
    distanceRoute.innerHTML = calcDistanceRoute(pop.membersOfPop[0].dna[i]);
    loadRoute.innerHTML = calcLoad(pop.membersOfPop[0].dna[i]);
    vehicCapacityRes.innerHTML = capacity;
}










////////////////
var dataNotif = document.getElementById("data-notif")
var inputNotif = document.getElementById("input-notif")

function checkInput() {
    if (custData[0] == undefined) {

        dataNotif.style.display = "block";
        return false
    }

    if (populationInput.style.color == "red" ||
        crossoverInput.style.color == "red" ||
        mutationInput.style.color == "red" ||
        generationInput.style.color == "red") {
        inputNotif.style.display = "block";
        return false
    }
    if (populationInput.value == "" ||
        crossoverInput.value == "" ||
        mutationInput.valvalueue == "" ||
        generationInput.value == "") {
        inputNotif.style.display = "block";
        return false
    }
    inputNotif.style.display = "none";
    return true
}



function calcDistanceRoute(tab) {
    let x = 0;
    for (let j = 0; tab.length - 1 > j; j++) {

        if (tab[j].custNo > tab[j + 1].custNo) {
            let a = tab[j + 1].custNo;
            let b = tab[j].custNo;
            x += customersDistance[a][Math.abs(a + 1 - b)];
        } else {
            let a = tab[j].custNo;
            let b = tab[j + 1].custNo;
            x += customersDistance[a][Math.abs(a + 1 - b)];

        }

    }
    return x.toFixed(3);
}





/************************* */

//FUNCTIONS

/********************** */


//// REMOVE ELEMENT FROM ARRAY
function removeElement(array, index) {
    array.splice(index, 1);
}


//remove repeated elements in an array
function removeRepeate(tab) {
    var repElement = [];
    let i = 0;
    while (custData.length - 1 < tab.length) {
        repElement = [];
        for (j = i + 1; j < tab.length; j++) {
            if (tab[i] == tab[j]) {
                removeElement(tab, j);
            }
        }

        i++;
    }
    return tab;
}

///// CALC LOAD OF A ROUTE
function calcLoad(route) {
    let load = 0;
    for (let i = 0; i < route.length; i++) {
        load += route[i].demand;
    }
    return load;
}


/////////// return true if an elem exist in arr
function exist(e, tab) {
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].custNo == e) return true;
    }
    return false;
}




//create new array function
function newTab(arr) {
    var newtab = [];
    for (let i = 0; i < arr.length; i++) {
        newtab[i] = arr[i];
    }
    return newtab;
}



//// COMPARE 

function compare(a, b) {
    const x = a.gain;
    const y = b.gain;

    let comparison = 0;
    if (x > y) {
        comparison = 1;
    } else if (x < y) {
        comparison = -1;
    }
    return comparison;
}