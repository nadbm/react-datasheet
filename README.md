# React DataSheet 

## Installation    
React 15

    npm install react-datasheet --save

## Usage
``` javascript
import React from 'react';
import ReactDataSheet from 'react-datasheet';

// include styles
import 'react-datasheet/dist/rdatasheet.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.data = [
			[1 , 2, 3, 4, 5],
			[6,  7, 8, 9,10],
			[11,12,13,14,15],
			[16,17,18,19,20]
		];
    }

    render() {
        return (
            <div>
			<ReactDataSheet 
				data={data}
				valueRenderer={(cell) => cell}
				onChange={(cell, col, row, value)=> this.data[i][j] = value} />
            </div>
        )
    }
}
```

