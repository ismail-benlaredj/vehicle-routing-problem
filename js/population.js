class population {
  constructor(popSize, crossoverRa, mutationRa) {
    this.popSize = popSize;
    this.membersOfPop = [];
    this.crossoverRa = crossoverRa;
    this.mutationRa = mutationRa;
    this.popArry;
    this.pool = [];
  }
  calcFitness(tab) {
    for (let i = 0; i < this.membersOfPop.length; i++) {
      this.membersOfPop[i].calcFitness(tab);
    }
  }
  orderPop() {
    var orderTab = newTab(this.membersOfPop);
    var tab = [];
    let index;
    while (orderTab.length > 0) {
      let fit = 0;
      for (let i = 0; i < orderTab.length; i++) {
        if (orderTab[i].fitness > fit) {
          fit = orderTab[i].fitness;
          index = i;
        }
      }

      tab.push(orderTab[index]);
      removeElement(orderTab, index);
    }
    this.membersOfPop = tab.reverse();
  }

  naturalSelection() {
    this.pool = newTab(this.membersOfPop).splice(
      0,
      this.membersOfPop.length * this.crossoverRa
    );
    this.membersOfPop = newTab(this.membersOfPop).splice(0, this.popSize);
  }

  crossover() {
    let x,
      y,
      tab = [];

    while (this.pool.length > 0) {
      //chose Parent randomly
      x = parseInt(Math.random() * this.pool.length);
      y = parseInt(Math.random() * this.pool.length);
      //y = parseInt(Math.random() * this.pool.length);

      while (x == y) {
        y = parseInt(Math.random() * this.pool.length);
      }

      let parent1 = prepareChrom(this.pool[x].dna);
      let parent2 = prepareChrom(this.pool[y].dna);

      //CROSSOVER PARENT1 X PARENT2
      let randomPoint = parseInt(Math.random() * parent1.length);
      // let randomPoint = parseInt(parent1.length / 2);

      tab = parent1.slice(0, randomPoint);
      tab = tab.concat(parent2.slice(randomPoint));
      tab = tab.concat(parent1.slice(randomPoint));
      tab = tab.concat(parent2.slice(0, randomPoint));
      removeRepeate(tab);

      children.push(tab);

      removeElement(this.pool, x);
      if (y == 0) {
        removeElement(this.pool, y);
      } else {
        removeElement(this.pool, y - 1);
      }

      if (this.pool.length == 1) break;
    }
  }


  mutation() {
    let dna;
    for (let i = 0; i < children.length; i++) {
      dna = mutate(children[i]);
      let child = new genes(dna, 1);

      child.calcFitness(customersDistance);
      //  console.log(child)
      pop.membersOfPop.push(child);

    }


  }


}

/*************************************** */

//   *********/////////////////////////

//prepare dna for crossover and mutation
function prepareChrom(tab) {
  let chrom = [];
  for (let i = 0; i < tab.length; i++) {
    for (let j = 1; j < tab[i].length - 1; j++) {
      chrom.push(tab[i][j]);
    }
  }
  return chrom;
}


function mutate(tab) {
  let c;
  for (let i = 0; i < tab.length / 2; i++) {
    if (Math.random() < mutationRate) {
      let x = parseInt(Math.random() * tab.length);
      let y = parseInt(Math.random() * tab.length);
      c = tab[x];
      tab[x] = tab[y];
      tab[y] = c;

    }
  }
  return tab;
}