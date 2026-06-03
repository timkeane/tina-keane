import $ from 'jquery';
import Slide from './Slide';
import Player from './Player';
import imagelist from './imagelist/tina';
import playlist from './playlist/tina';

setTimeout(() => $('#intro').hide(), 5000);
new Slide(imagelist);
new Player(playlist);
