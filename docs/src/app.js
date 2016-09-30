import React from 'react';
import ReactDOM from 'react-dom';
import ReactDataSheet from '../../src/index';
import '../../src/react-datasheet.css';
let data = [
	[1 , 2, 3, 4, 5, 'test'],
	[6,  7, 8, 9,10, 'me'],
	[11,12,13,14,15, 'copy'],
	[16,17,18,19,20, 'paste']
];

ReactDOM.render(<ReactDataSheet 
	data={data}
	valueRenderer={(cell) => cell}
	onChange={(cell, i, j, value)=> data[i][j] = value}
	/>, 
	document.getElementById('root'));
console.log('Webpack Starter...Welcome');

