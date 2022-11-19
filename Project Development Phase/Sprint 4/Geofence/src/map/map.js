import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

let geoFence = []; //json object
let vertices = [];
let fence = [];
let isDrawing = false;
let isComplete = false;
let deleted = [];

  let newoverlay = {
   type: null,
   info: null
   }

   function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

   function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const boxStyle = {
    'background-color' : 'rgba(255,255,255,.5)',
    'width' : 325
  }
  
   const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    button: {
      margin: theme.spacing.unit,
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: -5,
      width: 260,
    },
     root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
     },
      menu: {
      width: 200,
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 65,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
      },
  });

function clearOverlays() {
  console.log("clearing")
  for (var i = 0; i < fence.length; i++ ) {
    fence[i].setMap(null);
  }
  fence.length = 0;
}

class GeoFence extends Component {
  constructor(props){
    super(props);

    this.state = {
      map: null,
      maps: null,
      drawingManager: null,
      name: null,
      view : "map",
      overlay: {
       type: null,
       info: null,
       },
       drawing: true,
       savemap: [],
       savefence: [],
       currentfence: null,
       currentfenceindex : null,
       listview: false,
       createdby: null,
       active: false,
       alertenter: false,
       alertleave: false,
       newname: null,

   }  
  }
  static defaultProps = {
    center: {
      lat: 25.76,
      lng: -80.19
    },
    zoom: 10,
    geoFence: null,
    vertices: null,
    fence: null,
  }
 
  saveGeoFence = (callback,callback2) =>{
    if(this.state.name == null || this.state.name == ""){
      alert("please enter name for fence")
      return;
    }

    if(this.state.overlay.type == null){
      alert("please draw a fence")
      return;
    }
    let overlaycopy = this.state.overlay;
    let temp = this.state.savemap;

    let tempfence = this.state.currentfence;
    let fencearr = this.state.savefence;
    console.log(tempfence)
    console.log(overlaycopy)
    if(this.state.currentfence){
    fencearr.push(tempfence);
    this.setState({savefence: fencearr})
    }    
    let template = { name: this.state.name,
      overlay:overlaycopy,
      createdby: null,
      active: false,
      alertleave: false,
      alertenter: false,
      }
    if(this.state.overlay.info != null){
    temp.push(template)
    this.setState({savemap: temp});
    }
    alert('Fence Saved!');
    callback();
  }

  newGeoFence = () => {
    console.log(fence)
    let map = this.state.map
    this.setState({map});
    let drawingManager1 = this.state.drawingManager;   

    if(this.state.overlay.info != null){
      let newoverlay = {
        type: null,
        info: null
        }
      drawingManager1.setMap(map);
      clearOverlays()
      this.setState({ drawingManager:drawingManager1 ,overlay:newoverlay});
      
    }
  }
  
  buttons = (callback) =>{
    let buttons = []
    let fences = this.state.savefence
    let maps = this.state.savemap
    let currentmap;
    let { classes } = this.props;
    
    if(maps){
    for(let i = 0; i< maps.length; i++){
      if(!deleted.includes(i)){
      currentmap = maps[i]
      buttons.push(<div> <Button onClick = {() => this.viewMap(i)} size = "large" variant = "contained" className={classes.button} >View: {maps[i].name} </Button>
      <Button onClick = {() => this.deletemap(i,this.deleteSwitch)} size = "small" variant = "contained" className={classes.button} color = "secondary" > Delete 
      <DeleteIcon className={classes.rightIcon} /> 
      </Button> 
      <Button onClick = {() => this.viewFenceSettings(i)} size = "medium" variant = "contained" className={classes.button} color = "primary" > Settings </Button> </div>) 
    }
  }
      return buttons;
  }
}
viewMap = (index) => {

    this.setState({currentfence: this.state.savemap[index].name})
    this.setState({view: "list"})
  if(fence){
    clearOverlays()
  }
   
  let map = this.state.map
  fence = this.state.savefence[index].slice()
  fence[0].setMap(map);

  console.log(this.state.drawingManager)
}

increase = () => {
  console.log("increased")
  let value = this.state.overlay ;
  value.info.radius += 500
  this.setState({overlay: value})
}

deletemap = (index,callback) => {
  deleted.push(index);
  this.setState({view : 'list'})
  callback()
}

deleteSwitch = () => {
    this.setState({view: 'map'})
}

viewFenceSettings = (index) => {
    if(this.state.view != 'settings'){
        this.setState({currentfence: this.state.savemap[index].name})
        this.setState({currentfenceindex : index})
         this.setState({view: 'settings'})
    }

    else
        this.setState({view: 'map'})
}

changeView = () => {

  if(this.state.view == 'map'){
    if(this.state.overlay.type != null){
      alert('Cannot view list while drawing map, please clear or save first')
      return
    }
  this.setState({view: "list"})
  }
  else
  {
  this.setState({view: "map"})
    this.setState({name: null})
  clearOverlays()
  }
}  

saveSettings = (callback) => {
    
    if(this.state.newname == null || this.state.newname == ''){
        alert('please enter name')
        return
    }
   let copy = this.state.savemap.slice()
    let index = this.state.currentfenceindex
    let data = copy[index]
    data.active = this.state.active;
    data.alertenter = this.state.alertenter;
    data.alertleave = this.state.alertleave;
    data.name = this.state.newname;
    copy[index] = data
    this.setState({savemap : copy})
    console.log(this.state.savemap)
    alert('Settings Saved!')
    this.setState({alertenter: false})
    this.setState({alertleave : false})
    this.setState({newname : null})
    this.setState({active : false})
    callback()
}

drawing = () =>{
  if(this.state.view == "list")
  this.setState({drawing: false})

  else this.setState({drawing: true})
}

handleGoogleMapApi = (map, maps) => {
    let that = this;
    that.setState({map,maps});
    let drawingManager = new maps.drawing.DrawingManager({
      drawingMode: maps.drawing.OverlayType.CIRCLE,
      drawingControl: this.state.drawing,
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
        draggable: false,
        geodesic: true
      },
      polygonOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
        draggable: false,
        geodesic: true
      },
    });
    drawingManager.setMap(map);
    that.setState({ drawingManager })
    
    maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        
      let overlay = that.state.overlay;
      
      that.setState({overlay})
      console.log("saved")

      drawingManager.setOptions({drawingMode: null});
      drawingManager.setOptions({map: null});
      
      fence.push(event.overlay);
      let savefence = fence.slice()

      that.setState({currentfence: savefence})
      
      console.log(fence) 
      if (event.type === 'circle') {
        overlay.type = event.type;
        var radius = event.overlay.getRadius();
        var center = event.overlay.getCenter().toString();

        overlay.info = {
          radius: radius,
          coord: {center}
        }
      }
      else{
        overlay.type = event.type;
        var poly = event.overlay.getPath()

        for (var i =0; i < poly.getLength(); i++) {
          var xy = poly.getAt(i);

          var vertex = {lat:xy.lat(),lng:xy.lng()}
          vertices.push(vertex)
        }
        overlay.info = {
            Info: {vertices}
        }
      }
    console.log(this.state)
    });

  }

  handleChange = (event) => {
    console.log(event.target.name,':',event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleActive = () => {
    if(this.state.active == false)
        this.setState({active: true})
    
    else
        this.setState({active: false})
  }

  handleEnter = () => {
    if(this.state.alertenter == false)
    this.setState({alertenter: true})

else
    this.setState({alertenter: false})
  }

  handleExit = () => {
    if(this.state.alertleave == false)
    this.setState({alertleave: true})

else
    this.setState({alertleave: false})
  }

  render() {

    const { classes } = this.props;

    const bootstrapURLKeys={
      key: 'AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk',
      libraries: ['drawing','places'].join(','),
    }
    if(this.state.view == "list")
    return(
      <div style={{ height: '100vh', width: '100%' }} >
         <GoogleMapReact
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}       
          bootstrapURLKeys={ bootstrapURLKeys }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map,maps})=>this.handleGoogleMapApiList(map,maps) }
        >
        <div style = {boxStyle}>
         <FormControl className={classes.formControl}>
       
        <h2>Viewing: {this.state.currentfence} </h2> 
       
        </FormControl> 
        < br />
        <Button size = "large" color = "primary" variant = "contained" className={classes.button} onClick = {this.changeView}>
         Fence List
        </Button>
        </div>
        </GoogleMapReact>
        </div>
    )
    else if(this.state.view == "map")
    return (
      <div style={{ height: '100vh', width: '100%', }}>
        <GoogleMapReact
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}       
          bootstrapURLKeys={ bootstrapURLKeys }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map,maps})=>this.handleGoogleMapApi(map,maps) }
        >
        <div style = {boxStyle} >
        <FormControl className={classes.formControl}>
        
        <h2> Use the Tools to Draw a GeoFence </h2>
       
                <TextField
				          id="name"
				          label= 'Enter name for Geofence'
				          name='name'
				          className={classes.textField}
				          defaultvalue={this.state.name}
				          margin="normal"
				          onChange = {this.handleChange}
				        />  
        </FormControl>
                < br />    
        <Button color = "primary" size = "small" variant = "contained" className={classes.button} onClick={() => this.saveGeoFence(this.newGeoFence)}>
         Save Current
         <SaveIcon className={classes.rightIcon} />
        </Button>
        <Button size = "small" color = "secondary" variant = "contained" className={classes.button} onClick={this.newGeoFence}
        > Clear
        <DeleteIcon className={classes.rightIcon} /> 
        </Button>
        < br />
        <Button  size = "medium" variant = "contained" className={classes.button}  onClick={this.handleOpen}>View Fences</Button>
        <Button  size = "small" variant = "contained" className={classes.button} onClick = {() => this.props.onClickHandle('main')}>
         Go Back
        </Button>
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
          <h1 className={classes.formControl} > Saved Fences </h1> 
        {this.buttons()}
        < br />
        <Button color = "secondary" size = "large" variant = "contained" className={classes.button} onClick = {this.handleClose}>
         Close List
        </Button>
            
          </div>
        </Modal>
        </GoogleMapReact>
      </div>
    );

    else
    return(
        <div style = {{'margin-left' : 20}}>
            <h1>Settings for Fence:  {this.state.currentfence} </h1> <br />
            <FormControl className={classes.formControl}>
            <h2> Rename fence </h2>
                <TextField
				          id="name"
				          label= 'Enter name'
				          name='newname'
				          className={classes.textField}
				          defaultvalue={this.state.newname}
				          margin="normal"
				          onChange = {this.handleChange}
				        />  <br />
                <h2> Fence is Active </h2>
                <Switch
                checked={this.state.checkedA}
                onChange={this.handleActive}
                value="checkedA"
                color = "primary"
                /><br />
                <h2> Alert When Boat Enters Fence </h2>
                <Switch
                checked={this.state.checkedA}
                onChange={this.handleEnter}
                value="checkedA"
                color = "primary"
                /><br />
                <h2> Alert When Boat Exits Fence</h2>
                <Switch
                checked={this.state.checkedA}
                onChange={this.handleExit}
                value="checkedA"
                color = "primary"
                />
                </FormControl>< br />    <br />
            <Button color = "primary"  variant = "contained"  onClick = {() => this.saveSettings(this.viewFenceSettings)} className={classes.button} > Save Settings 
            <SaveIcon className={classes.rightIcon} />
            </Button>
            <Button color = "secondary" variant = "contained" onClick = {this.viewFenceSettings} className={classes.button} > Return to Fence List </Button>
        </div>
    )
  }
}

GeoFence.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  

const GeoFences = withStyles(styles)(GeoFence)

export default GeoFences ;