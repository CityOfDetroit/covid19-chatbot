import React, { useState }from 'react';
import './Geocoder.scss';
const turf = require('@turf/turf');
const arcGIS = require('terraformer-arcgis-parser');

function Geocoder(props) {
  // Declare a new state variable, which we'll call when changing panel render
  const [sugg, setSugg]             = useState();
  const [address, setAddress]       = useState();
  const [geoResults, setGeoResults] = useState();
  const [parcel, setParcel]         = useState(props.parcel);

  const getAddressSuggestions = (addr) => {
    let tempAddr = addr.split(",");
    tempAddr = tempAddr[0];
    tempAddr = tempAddr.split(" ");
    let newTempAddr = '';
    let size = tempAddr.length;
    tempAddr.forEach(function(item, index) {
      newTempAddr += item;
      ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
    });
    let url = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/CompositeGeocoder/GeocodeServer/findAddressCandidates?Street=&City=&ZIP=&SingleLine=${newTempAddr}&category=&outFields=User_fld&maxLocations=4&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json`;
    
    try {
        fetch(url)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
          let candidates = [];
          data.candidates.forEach((candidate)=>{
            if(candidate.attributes.User_fld != ''){
              candidates.push(candidate);
            }
          });
          setSugg(candidates);
        })
        .catch((error) => {
            error(error);
        });
    }catch (error) {
        console.log(error);
    }
  }

  const handleChange = (ev) => {
      getAddressSuggestions(ev.target.value);
      (ev.target.value == '') ? setAddress('') : setAddress(ev.target.value);
      if(sugg != undefined){
        sugg.forEach((item) => {
          if(ev.target.value == item.address){
            console.log('setting parcelID');
            console.log(props.specialFunction);
            setParcel(item.attributes.User_fld);
            switch (props.specialFunction) {
              case 'nearest-vaccine':
                getNearestVaccine(item);
                break;
            
              default:
                break;
            }
          }
        })
      }
  }

  const handleBlur = (ev) => {
    if(ev.target.value == ''){
      setAddress('');
      setParcel('');
    }
  }

  const buildOptions = () => {
    const markup = sugg.map((item, key) =>
        <option key={key} value={item.address} data-parcel={item.attributes.User_fld} data-x={item.location.x} data-y={item.location.y}></option>
    );
    return markup;
  }

  const buildNames = () => {
    return `${props.id}-list`;
  }

  const getClassName = () => {
    if(props.required){
      return 'required-field';
    }else{
      return '';
    }
  }

  const buildGeoResults = () => {
    let markup = '';
    if(geoResults != undefined){
      console.log(geoResults);
      markup = geoResults.map((item, key) =>
        <div key={key}>
          <p><strong>Location:</strong> {item.attributes.Site_Name}<br></br>
          <strong>Address:</strong> {item.attributes.Address}<br></br>
          <a href={item.attributes.How_to_schedule_} target="_blank">Book Appointment</a></p>
        </div>
      );
    }
    return markup;
  }

  const getNearestVaccine = (item) => {
    console.log('getting nearest vaccine');
    let _point = turf.point([item.location.x, item.location.y]);
    let _buffer = turf.buffer(_point, 10, {units: 'miles'});
    let _simplePolygon = turf.simplify(_buffer.geometry, {tolerance: 0.005, highQuality: false});
    let arcsimplePolygon = arcGIS.convert(_simplePolygon);
    let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Vaccine_Locations_for_Website/FeatureServer/0/query?where=&objectIds=&time=&geometry=${encodeURI(JSON.stringify(arcsimplePolygon))}&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=3&f=json`;
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      console.log(data);
      if(data.features.length){
        setGeoResults(data.features);
      }
    }).catch( err => {
      // console.log(err);
    });
  }

  return (
      <div>
        <label className={getClassName()} htmlFor={props.id}>{props.label}</label>
        <input list={buildNames()} id={props.id} aria-label={props.label} name={props.name} value={props.value} defaultValue={props.savedValue} placeholder={props.placeholder} data-parcel={parcel} onChange={handleChange} onBlur={handleBlur} aria-required={props.required} required={props.required} autoComplete="off"></input>
        <datalist id={buildNames()}>
            {(sugg) ? buildOptions() : ''}
        </datalist>
        <div className={(props.alert) ? 'active-m' : 'hide-m'}>
            {(props.alert) ? props.alert : ''}
        </div>
        <div className="geo-results">
          {buildGeoResults()}
        </div>
      </div>
  );
}

export default Geocoder;
