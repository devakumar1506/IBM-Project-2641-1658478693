/**
 * Dashboard V1
 */
import React, { Component } from 'react';
import MessageBlock from './components/MessageBlock';
import { FormGroup, Input } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Badge } from 'reactstrap';
import Button from 'material-ui/Button';
import { w3cwebsocket } from 'websocket';
import { distanceTo, headingTo } from 'geolocation-utils';
// rct card box

import GoogleMap from 'google-map-react';

import $ from 'jquery';

// actions
import { getBoatsStatus, getBoats, updateBoatsStatus } from '../../actions';
// page title bar
import PageTitleBar from '../../components/PageTitleBar/PageTitleBar';

// rct card box
import { RctCard, RctCardContent } from '../../components/RctCard';

// rct collapsible card
import RctCollapsibleCard from '../../components/RctCollapsibleCard/RctCollapsibleCard';

// intl messages
import IntlMessages from '../../util/IntlMessages';

class Dashboard extends Component {

	state = {
			markerImages:[],
			user: JSON.parse(localStorage.getItem("user_id")),
			boats: [],
			socket: null,
			handleDelta: {
				"navigation": (boat,delta)=>(this.handleNavigation(boat,delta)),

			},
			//positionMarkers:[]

	}

	componentWillMount() {
			//this.fetchRecentBoats();
			this.props.getBoats(JSON.parse(localStorage.getItem('user_id')).user_id);
			this.setState({user:JSON.parse(localStorage.getItem('user_id'))});


	}

	componentWillReceiveProps(nextProps){
			if(nextProps.boatAppReducer.boats !== this.props.boatAppReducer.boats){
				//this.setState({boats: nextProps.boatAppReducer.boats});
				this.handleBoatsInitialState(nextProps.boatAppReducer.boats);
			}

	}

	componentWillUpdate(nextProps, nextState){

	}
	componentDidUpdate(prevProps,prevState){
			if(this.state.socket !== null && (this.state.socket !== prevState.socket)){
				this.handleWsConnection()
			}

	}

	componentWillUnmount(){
		this.state.socket.close();
		this.setState({socket:null});
	}

	handleBoatsInitialState(boats){
		//console.log('Im in initialization');

			//let boats = this.state.boats;
			_.map(boats,(boat,index)=> {
					boats[index].isActive = false;
					boats[index].badgeType = "danger";
					boats[index].lat = '--';
					boats[index].lng = '--';
					boats[index].speedOverGround = '--';
					boats[index].courseOverGroundTrue = '--';
					boats[index].menuOpened = false;
					boats[index].coords = [];
					boats[index].markers = [];
					boats[index].routes = null;

					//boatsTmp.push(boat);
			})
			//console.log(boats);

			this.setState({boats},this.connectWebsocket());

	}

	//socket functions
	handleWsConnection(){
		//console.log('Im in initialization 2');
		let socket = this.state.socket;
		socket.onopen = () => { this.sendMessage() };
		socket.onclose = () => {
			console.log('echo-protocol Client Closed');
			this.handleBoatsInitialState(this.state.boats);
			//NotificationManager.error('Oops! You have lost connection with the device server. Please try again!')


		};
		socket.onerror = () => {console.log('error connecting');}
		socket.onmessage = (e) => { this.handleData(e.data) }
		this.setState({socket});
	}

	sendMessage(){
		let wsMessage = {
			"user_id" : this.state.user.user_id,
			"boat_id" : _.map(this.state.boats,'boat_id')
		};
		if(this.state.socket !== null){
			this.state.socket.send(JSON.stringify(wsMessage));
		}
		//this.forceUpdate();
	}

	connectWebsocket(){
		let socket = new w3cwebsocket ('ws://realtime.boatster.co:3000', 'echo-protocol');
		this.setState({
					socket
				})
	}

	handleData(data){
		let delta = JSON.parse(data);
		let boat_id = delta.context;
		let boat_index = _.findIndex(this.state.boats,{'boat_id':boat_id});
		let delta_type = _.split(delta.path,'.')[0];
		if(boat_index >= 0){
			if(_.has(this.state.handleDelta,delta_type))
				this.state.handleDelta[delta_type](boat_index,delta);
		}

	}
	handleNavigation(boat,delta){
			//console.log('posistion value',value);
			let boats = this.state.boats
			//console.log('in rev');
			//console.log(delta);

			switch(delta.path){
				case 'navigation.position':
					boats[boat].lat = delta.value.latitude;
					boats[boat].lng = delta.value.longitude;
					this.addBoatMarker(boat,[delta.value.latitude,delta.value.longitude]);
					break;

				case 'navigation.speedOverGround':
					if(delta.value > 0 && boats[boat].badgeType !== "success")
						boats[boat].badgeType = "success";
					boats[boat].speedOverGround = delta.value
					break;
				case 'navigation.courseOverGroundTrue':
						boats[boat].courseOverGroundTrue = delta.value
						break;
				default:
					break;
			}

			this.setState({boats});

	}
	onMapLoaded (map, maps) {
		//this.fitBounds(map, maps)
		//console.log(map.getCenter());
		this.setState({
        ...this.state,
        mapsLoaded: true,
        map: map,
        maps: maps,
				markerImages: [
					{
	          url: 'https://www.shareicon.net/data/32x32/2017/05/09/885776_green_512x512.png',
	          // This marker is 20 pixels wide by 32 pixels high.
	          size: maps.Size(32, 32),
	          // The origin for this image is (0, 0).
	          origin: maps.Point(0, 0),
	          // The anchor for this image is the base of the flagpole at (0, 32).
	          anchor: maps.Point(0, 32),

						color: '#33cc00'
	        },
					{
	          url: 'https://www.shareicon.net/data/32x32/2017/05/09/885776_green_512x512.png',
	          // This marker is 20 pixels wide by 32 pixels high.
	          size: maps.Size(32, 32),
	          // The origin for this image is (0, 0).
	          origin: maps.Point(0, 0),
	          // The anchor for this image is the base of the flagpole at (0, 32).
	          anchor: maps.Point(0, 32)
	        },
					{
	          url: 'https://www.shareicon.net/data/32x32/2017/05/09/885776_green_512x512.png',
	          // This marker is 20 pixels wide by 32 pixels high.
	          size: maps.Size(32, 32),
	          // The origin for this image is (0, 0).
	          origin: maps.Point(0, 0),
	          // The anchor for this image is the base of the flagpole at (0, 32).
	          anchor: maps.Point(0, 32)
	        }
				]
		 })

	}

	addBoatMarker(boat_index, coords){

		let distance = 0;
		//get boats state to overwrite later
		let boats = this.state.boats;

		//calculate latlng from new delta to instatiate the delta marker
		let latLng = new google.maps.LatLng(coords[0],coords[1]);

		//assign new cords
		let newCoords = {lat:coords[0],lng:coords[1]};


		//instatiate marker icon with assigned color image
		let icon = this.state.markerImages[boat_index];



		//check for other coords values in the state
		if(boats[boat_index].coords.length > 0){
			//since there are other coords lets get the last coords to calculate heading
			let lastCoords = _.last(boats[boat_index].coords);

			//calculate heading using new and latest newCoords
			let heading = headingTo(lastCoords,newCoords);

			//assign heading to icon
			icon.rotation = heading;
		}

		//check existance of other markers to hide previous markers
		if(boats[boat_index].markers.length > 0){
			//get latest marker
			let lastMarker = _.last(boats[boat_index].markers);
			lastMarker.setMap(null); //hide latest marker
		}

		//and new marker
		let newMarker = new google.maps.Marker({
				position: latLng,
				map: this.state.map,
				icon: icon,
				title: boats[boat_index].name
		});

		let infowindow = new google.maps.InfoWindow({
			content: boats[boat_index].name
		})

		//lets rename state for use within the listener function
		let that = this;
		newMarker.addListener('click', function() {
				 infowindow.open(that.state.map, newMarker);
			 });
		//push markers and coords to state array
		boats[boat_index].markers.push(newMarker);
		boats[boat_index].coords.push(newCoords);

		this.addBoatPathSection(boat_index,latLng);

		//set new boat state with markers and coords
		this.setState({boats})


	}

	addBoatPathSection(boat_index,coords){

		//instatiate boats state for further update
		let boats = this.state.boats;

		//check if path exists for the boat
		if(boats[boat_index].route == null){
			let poly = new google.maps.Polyline ({
				strokeColor: 'blue',
				strokeOpacity: 0.8,
				strokeWeight: 2
			});
			poly.setMap(this.state.map);
			boats[boat_index].route = poly;

		}
		let path = boats[boat_index].route.getPath();
		path.push(coords);

		this.setState({boats});

	}

	getScrollHeight() {
			//if (this.props.fullHeight) {
					return 'calc(100vh - 128px)';
			//} else {
				//  return 'calc(100vh - 270px)';
			//}
	}
 render(){
	 const {boats} = this.state;
	 return(
		 <div className="dashboard-v1">
	 		<PageTitleBar title={<IntlMessages id="sidebar.dashboard" />} match={this.props.match} />
	 		<div className="row">
	 			<RctCard
	 				customClasses="overflow-hidden"
	 				colClasses="col-sm-12 col-md-12 col-lg-12 p-0 m-0 w-xs-half-block"
	 				fullBlock
	 			>
	 			<div className="chat-main-body">
	 					<Scrollbars className="rct-scroll" autoHide style={{ height: this.getScrollHeight() }}>
									<div id="mapi" >
									</div>
	 								<GoogleMap
	 									bootstrapURLKeys={{ key: "AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk" }}
	 									yesIWantToUseGoogleMapApiInternals={true}
	 									center={[37.0902, -100.5032963]}
	 									zoom={5} style={{ position: 'relative', width: '100%', height: this.getScrollHeight() }}
										mapTypeId="satellite"
										onGoogleApiLoaded={({ map, maps }) => this.onMapLoaded(map, maps)}
	 								/>

	 					</Scrollbars>
	 			</div>
	 			</RctCard>
	 		</div>
	 	</div>
	 )
 }

}
const mapStateToProps = ({ boatAppReducer }) => {
    return { boatAppReducer };
};

export default withRouter(connect(mapStateToProps, {
    getBoats,
    updateBoatsStatus,
    getBoatsStatus
})(Dashboard));
