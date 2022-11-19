import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

class NewGF extends Component {
	render(){
	const { newGeoFence } = this.props
    const {overlay} = this.state;
    const {map, drawingManager } = this.state;

		return(
			<div className="component">	
				<button onClick={newGeoFence}> New geoFence  </button> 
			</div>
		);
	}
}

export default NewGF;