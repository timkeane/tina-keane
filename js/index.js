import $ from 'jquery';
import Player from './Player';
import playlist from './playlist/tina';

setTimeout(() => $('#intro').hide(), 5000);
new Player(playlist);
