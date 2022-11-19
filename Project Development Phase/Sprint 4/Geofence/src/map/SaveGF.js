import React, {Component} from 'react';

class SaveGF extends Component {
	render(){
		const {handleGoogleMapApi, saveGeoFence } = this.props;
		return(
			<div className="Component">	
				<button onClick={saveGeoFence}> hello  </button> 
			</div>
		);
	}
}
export default SaveGF;