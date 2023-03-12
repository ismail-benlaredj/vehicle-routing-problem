///////////////////////////
function minDistIndex(tab) {
  let min = 9999;
  let index = 0;
  for (let i = 0; i < tab.length; i++) {
    if (tab[i] < min && tab[i] !== 'x') {
      min = tab[i];
      index = i;
    }
  }
  if (min == 9999) {
    return -1;
  } else {
    tab[index] = 'x';
    return index;
  }
}

////////////////////
function checkNearest(tab) {
  for (let i = 1; i < tab.length; i++) {
    if (tab[i] !== 'x') {
      return true;
    }
  }
  return false;
}
///////////////////////
/******************************** */

function clarckWrightHeur() {
  let gene = [];
  let fakeGene = [];
  let dna = [];
  fakeGene[0] = custData[savingsArr[0].cust1];
  fakeGene[1] = custData[savingsArr[0].cust2];
  gene[0] = custData[savingsArr[0].cust1];
  gene[1] = custData[savingsArr[0].cust2];

  for (let i = 1; i < savingsArr.length; i++) {
    if (
      !exist(savingsArr[i].cust1, fakeGene) &&
      exist(savingsArr[i].cust2, fakeGene)
    ) {
      if (calcLoad(gene) + custData[savingsArr[i].cust1].demand < capacity) {
        if (gene[0].custNo == savingsArr[i].cust2) {
          gene.unshift(custData[savingsArr[i].cust1]);
        } else {
          gene.push(custData[savingsArr[i].cust1]);
        }
        fakeGene.push(custData[savingsArr[i].cust1]);
      }
    } else {
      if (
        exist(savingsArr[i].cust1, fakeGene) &&
        !exist(savingsArr[i].cust2, fakeGene)
      ) {
        if (calcLoad(gene) + custData[savingsArr[i].cust2].demand < capacity) {
          if (gene[0].custNo == savingsArr[i].cust1) {
            gene.unshift(custData[savingsArr[i].cust2]);
          } else {
            gene.push(custData[savingsArr[i].cust2]);
          }
          fakeGene.push(custData[savingsArr[i].cust2]);
        }
      } else {
        if (
          !exist(savingsArr[i].cust1, fakeGene) &&
          !exist(savingsArr[i].cust2, fakeGene)
        ) {
          if (calcLoad(gene) / capacity > 0.9) {
            gene.unshift(custData[0]);
            gene.push(custData[0]);

            dna.push(gene);
            gene = [];
            gene[0] = custData[savingsArr[i].cust1];
            gene[1] = custData[savingsArr[i].cust2];

            fakeGene.push(custData[savingsArr[i].cust1]);
            fakeGene.push(custData[savingsArr[i].cust2]);
          }
        }
      }
    }
  }
  gene.unshift(custData[0]);
  gene.push(custData[0]);
  dna.push(gene);
  heurAmelioration(dna);
  return dna;
}

/********************************* */
function heurAmelioration(tab) {

  if (Math.random > 0.5) {
    /***  2-opt **/

    let x = Math.floor(Math.random() * (tab.length - 1));
    let y = Math.floor(Math.random() * (tab.length - 1));
    // console.log(x + "  " + y);
    let cnst = tab[x][tab[x].length - 2];
    tab[x][tab[x].length - 2] = tab[y][tab[y].length - 2];
    tab[y][tab[y].length - 2] = cnst;

  } else {
    /***  OR-opt **/
    x = Math.floor(Math.random() * (tab.length - 1));
    y = Math.floor(Math.random() * (tab.length - 1));
    // console.log(x + "  " + y);
    let a = Math.floor(1 + Math.random() * (tab[x].length - 2));
    let b = Math.floor(1 + Math.random() * (tab[x].length - 2));
    let c = Math.floor(1 + Math.random() * (tab[y].length - 2));
    //console.log(a + "  " + b + "  " + c);

    cnst = tab[x][b];
    tab[x][b] = tab[x][a];
    tab[x][a] = tab[y][c];
    tab[y][c] = cnst;

  }
}
/********************************* */

function generateGenes(custData, capacity) {
  let genes = [];
  let depot = custData[0];
  let route = [depot];
  let b;
  removeElement(custData, 0);
  let index = 0;
  while (custData.length > 0) {


    let chekLoad = calcLoad(route) + custData[index].demand;
    if (chekLoad < capacity) {
      route.push(custData[index]);
      removeElement(custData, index);
      b = true;
    } else {
      route.push(route[0]);
      genes.push(route);
      route = [depot];
      b = false;
    }
  }
  if (b) {
    route.push(route[0]);
    genes.push(route);
  }

  heurAmelioration(genes);


  return genes;
}



/////////// BUILD GENES AFTER CROSSOVER AND MUTATION
function buildGenes(tab) {
  let genes = [];
  let depot = custData[0];
  let route = [depot];
  let b;

  let index = 0;
  while (tab.length > index) {
    let chekLoad = calcLoad(route) + tab[index].demand;
    if (chekLoad < capacity) {
      route.push(tab[index]);

      b = true;
      index++;
    } else {
      route.push(route[0]);
      genes.push(route);
      route = [depot];
      b = false;
    }
  }
  if (b) {
    route.push(route[0]);
    genes.push(route);
  }

  return genes;
}

class genes {
  constructor(custs, origin) {
    this.dna = [];
    this.fitness = 0;
    if (origin == 0) {
      /// GENERATE GENES FROM 50% OF HEURISTIC 1
      ///   + 50% OF CLARCK & WRIGHT HEURISTIC

      if (Math.random() < 0.5) {
        this.dna = generateGenes(custs, capacity);
      } else {
        this.dna = clarckWrightHeur();
      }




    } else {
      this.dna = buildGenes(custs);
    }
  }

  calcFitness(tab) {
    let distance = 0;
    for (let i = 0; i < this.dna.length; i++) {
      for (let j = 0; j < this.dna[i].length - 1; j++) {
        if (this.dna[i][j].custNo < this.dna[i][j + 1].custNo) {
          var index = Math.abs(
            this.dna[i][j].custNo + 1 - this.dna[i][j + 1].custNo
          );
          distance += tab[this.dna[i][j].custNo][index];
        } else {
          var index = Math.abs(
            this.dna[i][j + 1].custNo + 1 - this.dna[i][j].custNo
          );
          distance += tab[this.dna[i][j + 1].custNo][index];
        }
      }
    }
    this.fitness = parseFloat(distance.toFixed(3));
  }
}