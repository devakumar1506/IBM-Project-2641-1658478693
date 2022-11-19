import React from 'react';
import data from './data';
import _ from 'lodash';
import { Chart, AnnotationChart } from 'react-google-charts';

// let arraydata = [];


// let newdata = _.mapValues(data,function(o){o["propulsion.port.revolutions"]});

// Object.keys(newdata).forEach(function(key){
//   arraydata.push(new Array(key));
// });

// for(let i in arraydata){
  
//     for(let key in data[i]){

//      arraydata[i].push(data[i][key]);
//     } 
  
// }

let mainarr = [['date','engine1','engine2']];
for(let key in data){
  let newarr = [null];
  newarr[0] = key;
  for(let key2 in data[key]){
    newarr.push(parseInt(data[key][key2]))
      console.log(data[key][key2]);
    }
    if(newarr.length == 2)
      newarr.push(null);
    mainarr.push(newarr);
  }
  // console.log(data[key]);

let control = [];
 _.mapKeys(data, function(value, key) {
   _.mapKeys(value, function(metric,path){
      control.push(path)
  })
});
let new1 = _.uniq(control)
let result = new1.sort()
let resultcount = Object.keys(result).length;

let newmain = ['date'];

for (let i = 1; i< result.length + 1; i++){
    newmain.push('engine' + i)
}

let testmain = [];

testmain.push(newmain);
for(let key in data){
  let temparr = [];

  for(let i=0;i<=resultcount;i++)
    temparr[i] = null;

  temparr[0] = new Date(key);
  for(let j = 1; j<result.length + 1;j++){
    if(data[key][result[j-1]])
      temparr[j] = parseInt(data[key][result[j-1]]);
  }
  testmain.push(temparr);
}
console.log(testmain);
//arraydata.push([Object.keys(newdata)]);

class ExampleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        title: 'RPM over time',
        hAxis: { title: 'Date', minValue: 0, maxValue: 15 },
        vAxis: { title: 'RPM', minValue: 0, maxValue: 15 },
        legend: 'none',
      },
      data: testmain,
    };
  }
  render() {
     console.log(testmain);
    return (
      
      <Chart
        chartType="AnnotatedTimeLine"
        chartPackages={['corechart','annotatedtimeline','map']}
        data={this.state.data}
        options={this.state.options}
        graph_id="ScatterChart"
        width="100%"
        height="400px"
        legend_toggle
       />
    );
  }
}
export default ExampleMap;