import Canvas from './canvas';

const canvas = new Canvas();

const conway = window.conway = {
  canvas: canvas
};

canvas.setup();
