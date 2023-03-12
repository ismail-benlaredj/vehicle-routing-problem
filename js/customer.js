class customer {
  constructor(custNo, Xcoord, Ycoord, demand) {
    this.custNo = custNo;
    this.Xcoord = Xcoord;
    this.Ycoord = Ycoord;
    this.demand = demand;

    this.draw = function () {
      if (custNo == 0) {
        ctx.beginPath();
        ctx.fillStyle = 'rgb(0, 100, 10)';
        ctx.arc(this.Xcoord * 15, this.Ycoord * 15, 30, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        //ctx.fillRect(this.Xcoord * 15, this.Ycoord * 15, 50, 50);
      } else {
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(this.Xcoord * 15, this.Ycoord * 15, 6.5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      }
    }

  }
  clickCustomer(x, y) {
    let a = Math.abs(x / 15 - this.Xcoord);
    let b = Math.abs(y / 15 - this.Ycoord);
    if (a < 1.5 && b < 1.5) {
      return true
    }
    return false;
  }
}