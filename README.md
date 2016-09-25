# React DataSheet 

A simple react component to create a spreadsheet.
View DEMO https://nadbm.github.io/react-datasheet/

## Current features
1. Select cells, copy-paste cells
2. Navigation using keyboard keys
3. Deletion using keyboard keys 
4. Callbacks for onChange, valueRenderer(visible data), dataRenderer(underlying data in the input, takes the value by default)
    * more examples to come soon! 

## Installation    
React 15

    npm install react-datasheet --save


## Usage
``` javascript
import React from 'react';
import ReactDataSheet from 'react-datasheet';

// include styles
import 'react-datasheet/dist/react-datasheet.css';

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

