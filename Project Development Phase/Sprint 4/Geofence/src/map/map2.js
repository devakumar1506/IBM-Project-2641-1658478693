import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

//need to make a button to save and delete overlays
//   find a way to make line 52 work. turn on the map; need to reference drawingManager and set it to map
// use json as initial state. modify json object with each render 

//need to make listeners for overlay changes 
//    1 for circles 
//    1  for polygons

let geoFence = []; //json object
let vertices = [];
let fence = []; //actual shape object
let isDrawing = false;
let isComplete = false;


function clearOverlays() {
  for (var i = 0; i < fence.length; i++ ) {
    fence[i].setMap(null);
  }
  fence.length = 0;
}


class ExampleMap extends Component {
  static defaultProps = {
    center: {
      lat: 25.76,
      lng: -80.19
    },
    zoom: 10
    // drawingManager: handleGoogleMapApi(){
    //   return this.
    // }
  }
  state = {
     map: null,
     maps: null,
     drawingManager: null,
     circle: null,
     polygon: null 
   }

   saveGeoFence= () => {
    // let maps = this.state.maps;
    // let map = this.state.map;
    // var radius = this.state.cirlce.getRadius();
    // console.log('radius = ', radius)
    // var center = maps.drawing.getCenter().toString();
    // // console.log(radius)
    // // console.log(center)
    // var circle = {
    //     type: 'Circle',
    //     info: {
    //       radius: radius,
    //       coord: {center}
    //     }
    // }
    // geoFence.push(circle)
    console.log(this.circle)

   }


  newGeoFence = () =>{
    let maps = this.state.maps;
    let map = this.state.map;
    let drawingManager = new maps.drawing.DrawingManager({
      drawingMode: maps.drawing.OverlayType.CIRCLE,
      drawingControl: true,
      drawingControlOptions: {
        position: maps.ControlPosition.TOP_CENTER,
        drawingModes: ['circle', 'polygon']
      },
      circleOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
        draggable: true,
        geodesic: true
      },
      polygonOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
        draggable: true,
        geodesic: true
      },
    });

    if(geoFence.length >= 1){
      clearOverlays()
      geoFence = [];
      drawingManager.setMap(map);
      this.setState({ drawingManager });
    }
    maps.event.addListener(drawingManager,'markerComplete', function(event){
      console.log('marker is complete')
        if(isDrawing){
        if(isComplete && geoFence != null){
          geoFence = []
          isComplete = false;
        }
      }
      else
        isDrawing = true;

    })

    maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
      
      let shapes = { 
        boat_id: 'xxxx',
        geoFence: geoFence
      }

      drawingManager.setOptions({drawingMode: null});
      drawingManager.setOptions({map: null});

      fence.push(event.overlay);
      console.log(fence) 
      // const num = fence.length()
      // console.log(num)

      if (event.type === 'circle') {
        this.setState({circle: event.overlay})
        var radius = event.overlay.getRadius();
        console.log('radius = ', radius)
        var center = event.overlay.getCenter().toString();
        // console.log(radius)
        // console.log(center)
        var circle = {
            type: 'Circle',
            info: {
              radius: radius,
              coord: {center}
            }
        }
        geoFence.push(circle)
        console.log('shapes is', shapes);
        console.log('geoFence is', geoFence)
      }
      else{
        var poly = event.overlay.getPath()
        // console.log(poly)
        // console.log(event.overlay);
        for (var i =0; i < poly.getLength(); i++) {
          var xy = poly.getAt(i);
          // console.log(i)
          // console.log({lat:xy.lat(),lng:xy.lng()})
          var vertex = {lat:xy.lat(),lng:xy.lng()}
          vertices.push(vertex)
        }
        var polygon = {
            Type: 'Polygon',
            Info: [{vertices}]
        }
        geoFence.push(polygon);
      }

      // console.log(shapes)
    });
  }

handleGoogleMapApi = (map, maps) => {
    this.setState({map,maps});
    let drawingManager = new maps.drawing.DrawingManager({
      drawingMode: maps.drawing.OverlayType.CIRCLE,
      drawingControl: true,
      drawingControlOptions: {
        position: maps.ControlPosition.TOP_CENTER,
        drawingModes: ['circle', 'polygon']
      },
      circleOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
        draggable: true,
        geodesic: true
      },
      polygonOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
        draggable: true,
        geodesic: true
      },
    });
    that.setState({ drawingManager })
    drawingManager.setMap(map);
    // drawingManager = { map:map}

    maps.event.addListener(drawingManager,'markerComplete', function(event){
      console.log('marker is complete')
        if(isDrawing){
        if(isComplete && geoFence != null){
          geoFence = []
          isComplete = false;
        }
      }
      else
        isDrawing = true;

    })

    maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
      
      let shapes = { 
        boat_id: 'xxxx',
        geoFence: geoFence
      }

      drawingManager.setOptions({drawingMode: null});
      drawingManager.setOptions({map: null});

      fence.push(event.overlay);
      // console.log(fence) 
      // const num = fence.length()
      // console.log(num)
      let rad = null;
      if (event.type === 'circle') {
        this.setState({circle: event.overlay});
        event.overlay.addListener('dragend',function(){
          event.overlay.setCenter(event.overlay.getCenter());
          console.log(event.overlay.getCenter().toString())
        })
        event.overlay.addListener('radius_changed', function(){
          rad = event.overlay.getRadius()
          console.log(event.overlay.getRadius())
        })
        that.state.circle.setRadius(rad);

        that.setState({circle: event.overlay})
        console.log(event.overlay)
        console.log('overlaycomplete circle', this.circle)
        var radius = event.overlay.getRadius();
        console.log('radius = ', radius)
        var center = event.overlay.getCenter().toString();
        // console.log(radius)
        // console.log(center)
        var circle = {
            type: 'Circle',
            info: {
              radius: radius,
              coord: {center}
            }
        }
        geoFence.push(circle)
        console.log('shapes is', shapes);
        console.log('geoFence is', geoFence)
      }
      else{
        that.setState({polygon: event.overlay})
        var poly = event.overlay.getPath()
        // console.log(poly)
        // console.log(event.overlay);
        for (var i =0; i < poly.getLength(); i++) {
          var xy = poly.getAt(i);
          // console.log(i)
          // console.log({lat:xy.lat(),lng:xy.lng()})
          var vertex = {lat:xy.lat(),lng:xy.lng()}
          vertices.push(vertex)
        }
        var polygon = {
            Type: 'Polygon',
            Info: [{vertices}]
        }
        geoFence.push(polygon);
      }

      // console.log(shapes)
    });
  }



  render() {

    const bootstrapURLKeys={
      key: 'AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk',
      libraries: ['drawing','places'].join(','),
    }

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
         <button onClick={this.newGeoFence}>New GeoFence</button>
        <GoogleMapReact
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}       
          bootstrapURLKeys={ bootstrapURLKeys }
          // center={  this.center }
          // zoom={ 10 }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map,maps})=>this.handleGoogleMapApi(map,maps) }
        >     
        </GoogleMapReact>
        <button onClick={this.saveGeoFence}>Save GeoFence</button>
      </div>
    );
  }
}

export default ExampleMap;