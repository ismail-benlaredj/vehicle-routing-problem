//CANVAS SETUP
var c = document.getElementById('canvas');
var routesCanvas = document.getElementById('routes-canvas');
var ctxRoutes = routesCanvas.getContext('2d');
//2k resolution
let canvasWidth = 2560,
  canvasHeight = 1440;

var ctx;

//GET DATA

var nbrOFvehicle,
  capacity,
  custData = [],
  populationSize,
  mutationRate,
  crossoverRa,
  nbrOfGenerations;

var excuteBtn = document.getElementById('excute-btn'),
  geneNotif = document.getElementById('notif');
procNotif = document.getElementById('proc-notif');

var pop,
  children = [];
var savingsArr;

var inter = 0;

////// GET DATA FROM FILES
const fileSelector = document.getElementById('data-btn');
var x;

fileSelector.addEventListener('change', () => {
  //hide notification
  dataNotif.style.display = 'none';
  // Create a new File object with the file path
  // console.log("/data/" + fileSelector.value + ".txt")
  // var file = new File(["/data/" + fileSelector.value + ".txt"], fileSelector.value);
  // console.log(file.stream())

  if (fileSelector.value !== "0") {
    fetch(`/data/${fileSelector.value}.txt`)
      .then(response => response.text())
      .then(txt => {

        custData = [];
        custData = getData(txt);
        calcDistance();
      });
  } else {
    custData = [];

  }
});

//////////////////////////////////////

function getData(txt) {
  var txtToArr = txt.split('\r\n');

  // var lineArr = x.split(' ');
  //   var numbers = lineArr.filter((e) => e != '');
  nbrOFvehicle = parseInt(txtToArr[4].split(' ').filter((e) => e != '')[0]);
  capacity = parseInt(txtToArr[4].split(' ').filter((e) => e != '')[1]);

  //CANVAS SETUP
  c.width = canvasWidth;
  c.height = canvasHeight;
  ctx = c.getContext('2d');
  ////////////////
  routesCanvas.width = canvasWidth;
  routesCanvas.height = canvasHeight;
  ctxRoutes = routesCanvas.getContext('2d');
  // ctx.translate(80, 80);

  var custArr = [];

  for (let i = 9; i < txtToArr.length - 1; i++) {
    var custNo = parseInt(txtToArr[i].split(' ').filter((e) => e != '')[0]),
      Xcoord = parseInt(txtToArr[i].split(' ').filter((e) => e != '')[1]),
      Ycoord = parseInt(txtToArr[i].split(' ').filter((e) => e != '')[2]),
      demand = parseInt(txtToArr[i].split(' ').filter((e) => e != '')[3]);

    var cust = new customer(custNo, Xcoord, Ycoord, demand);
    cust.draw();

    custArr.push(cust);
  }

  return custArr;
}

///////////////////////////////////////////////////////////
var customersDistance = [];

function calcDistance() {
  customersDistance = [];
  let xTab = [];
  for (let i = 0; i < custData.length - 1; i++) {
    xTab = [];
    for (let j = i + 1; j < custData.length; j++) {
      let x1 = custData[i].Xcoord;
      let y1 = custData[i].Ycoord;
      let x2 = custData[j].Xcoord;
      let y2 = custData[j].Ycoord;
      let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      xTab.push(parseFloat(distance.toFixed(3)));
    }
    customersDistance.push(xTab);
  }
}

function calcSaving() {
  let gainArr = [];
  for (let i = 1; i < custData.length - 1; i++) {
    xTab = [];
    for (let j = i + 1; j < custData.length; j++) {
      let c1 = custData[i].custNo,
        c2 = custData[j].custNo;

      let gain =
        customersDistance[0][c1 - 1] +
        customersDistance[0][c2 - 1] -
        customersDistance[c1][Math.abs(c1 + 1 - c2)];

      let obj = {
        cust1: c1,
        cust2: c2,
        gain: parseFloat(gain.toFixed(3)),
      };

      gainArr.push(obj);
    }
  }
  return gainArr.sort(compare).reverse();
}

/////////********************** */

/////////////////////////////
////////////////////

function excute() {

  populationSize = parseInt(populationInput.value);
  crossoverRa = parseFloat(crossoverInput.value) / 100;
  mutationRate = parseFloat(mutationInput.value) / 100;
  nbrOfGenerations = parseInt(generationInput.value);

  if (checkInput()) {
    //DOM STUFF

    geneNotif.style.display = 'block';
    procNotif.innerHTML = 'please wait ...';
    resultDiv.style.display = 'none';
    document.getElementById('selected-route').style.display = 'none';
    selectedCustomer.style.display = 'none';

    savingsArr = calcSaving();

    pop = new population(populationSize, crossoverRa, mutationRate);
    for (let i = 0; i < populationSize; i++) {
      pop.membersOfPop[i] = new genes(newTab(custData), 0);
    }

    pop.calcFitness(customersDistance);

    if (inter == 0) {
      inter = 1;
      var txt = document.getElementById('gen');

      var gen = 0;
      var id = setInterval(frame, 0.1);

      function frame() {
        if (gen > nbrOfGenerations) {


          pop.orderPop();
          pop.naturalSelection();
          drawPath();
          showResults();

          procNotif.innerHTML = 'Done !';
          window.scrollTo(0, 450);
          clearInterval(id);
          inter = 0;
        } else {

          pop.orderPop();
          pop.naturalSelection();
          pop.crossover();
          pop.mutation();
          children = [];
          drawPath();

          txt.innerHTML = gen;
          gen++;
        }
      }
    }
  }

}

let colors = [
  'ffc93c',
  'a2d5f2',
  'ff7171',
  'ffaa71',
  'ffff3f',
  '2DC7FF',
  'EABA6B',
  '90e0ef',
  'fff1e6',
  '80ffdb',
  'f8f9fa',
];

function drawPath() {
  //CANVAS SETUP
  routesCanvas.width = canvasWidth;
  routesCanvas.height = canvasHeight;
  ctxRoutes = routesCanvas.getContext('2d');
  //ctx.translate(80, 80);
  for (let i = 0; pop.membersOfPop[0].dna.length > i; i++) {
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
  }
}








//// customer event listner click
var selectedCustomer = document.getElementById('selected-customer');

c.addEventListener('click', function (event) {
  custData.forEach((e) => {
    e.draw();
  });

  let rect = c.getBoundingClientRect();
  let x = event.clientX - rect.left; /// 15;
  let y = event.clientY - rect.top;
  x = (x * canvasWidth) / window.innerWidth;
  y = (y * canvasHeight) / window.innerHeight;
  let obj;
  for (let i = 0; i < custData.length; i++) {
    if (custData[i].clickCustomer(x, y)) {
      obj = custData[i];
      selectedCustomer.style.display = 'block';

      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(obj.Xcoord * 15, obj.Ycoord * 15, 8, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      document.getElementById('cust-id-result').innerHTML = obj.custNo;
      document.getElementById('demande-result').innerHTML = obj.demand;
      document.getElementById('cust-coord').innerHTML =
        ' ' + 'X = ' + obj.Xcoord + ' ' + '   Y= ' + obj.Ycoord;
      break;
    }
  }
});