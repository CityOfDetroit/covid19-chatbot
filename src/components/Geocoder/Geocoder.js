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
  const words = {
    en: ['Location:','Address:','Availability:','Schedule:','Book Appointment'],
    es: ['Ubicación:','Dirección:','Disponibilidad:','Reservar una cita:','Reservar una cita'],
    bn: ['Location:','Address:','Availability:','Schedule:','Book Appointment'],
    ar: ['Location:','Address:','Availability:','Schedule:','Book Appointment'],
  }

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
        // console.log(error);
    }
  }

  const handleChange = (ev) => {
      getAddressSuggestions(ev.target.value);
      (ev.target.value == '') ? setAddress('') : setAddress(ev.target.value);
      if(sugg != undefined){
        sugg.forEach((item) => {
          if(ev.target.value == item.address){
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
      markup = geoResults.map((item, key) =>
        <div className="mb-n3" key={key}>
          <p><strong>{words[props.language][0]}</strong> {item.attributes.USER_Site_Name}<br></br>
          <strong>{words[props.language][1]}</strong> {item.attributes.USER_Address}<br></br>
          <strong>{words[props.language][2]}</strong> {item.attributes.USER_Availability}<br></br>
          <strong>{words[props.language][3]}</strong> {(item.attributes.Schedule == null) ? 'NA' : (item.attributes.Schedule.includes('313')) ? item.attributes.Schedule : <a href={item.attributes.Schedule} target="_blank">{words[props.language][4]}</a>}<br></br></p>
        </div>
      );
    }
    return markup;
  }

  const getNearestVaccine = (item) => {
    let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Vaccine_Locations_for_Website/FeatureServer/0/query?where=&objectIds=&time=&geometry=${item.location.x}%2C${item.location.y}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&resultType=standard&distance=2&units=esriSRUnit_StatuteMile&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=3&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=`;
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      if(data.features.length){
        setGeoResults(data.features);
      }
    }).catch( err => {
      // console.log(err);
    });
  }

  return (
      <div>
        <label className={getClassName()} htmlFor={props.id}>{props.label[props.language]}</label>
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
