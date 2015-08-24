var Utils = {
  extendCanvas: function () {
    // Extend the canvas be able to draw a round rect
    CanvasRenderingContext2D.prototype.fillRadiusRect = function (x, y, width, height, radius, fill, stroke) {
      if (typeof radius === 'undefined') {
        radius = 5;
      }

      if (typeof stroke === 'undefined') {
        stroke = true;
      }

      this.beginPath();
      this.moveTo(x + radius, y);
      this.lineTo(x + width - radius, y);
      this.quadraticCurveTo(x + width, y, x + width, y + radius);
      this.lineTo(x + width, y + height - radius);
      this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      this.lineTo(x + radius, y + height);
      this.quadraticCurveTo(x, y + height, x, y + height -radius);
      this.lineTo(x, y + radius);
      this.quadraticCurveTo(x, y, x + radius, y);

      if (fill) {
        this.fill();
      }

      if (stroke) {
        this.stroke();
      }
    }
  }
}
