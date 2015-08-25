import GridView from './grid-view';

const grid = new GridView();

window.addEventListener('resize', grid.resize);

window.conway = {
  grid: grid
};
