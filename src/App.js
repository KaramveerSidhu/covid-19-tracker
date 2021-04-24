import React, {useState, useEffect} from "react";
import {Card, CardContent, FormControl, MenuItem, Select} from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import {sortData, prettyPrintNew, prettyPrintTotal} from "./util.js";
import './App.css';
import 'leaflet/dist/leaflet.css';


function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {

    const getCountriesData = async () => {

      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then(data => {
        const countries = data.map((countryObj) => (
          {
            name: countryObj.country,
            value: countryObj.countryInfo.iso2,
          }
        ));
        const sortedData = sortData(data);
        
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      });

    };

    getCountriesData()

  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value //Because event.target.value gives a country's code.

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}` //yesterday=true

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      if (countryCode === "worldwide") {
        setMapCenter({lat: 34.80746, lng: -40.4796})
        setMapZoom(3);
      } else {
        setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
        setMapZoom(4);
      }    
      // setMapCenter([data.countryInfo.lat, data.countryInfo.long]))
      
    });

  };

  return (
    <div className="app">

      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>

          <FormControl variant="outlined" className="app__dropdown" >
            <Select value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

        </div>

        <div className="app__stats">

          <InfoBox 
            isOrange
            active={casesType==="cases"}
            onClick={(e)=>setCasesType("cases")}
            title={"No. of Cases"} 
            newCases={prettyPrintNew(countryInfo.todayCases)} 
            total={prettyPrintTotal(countryInfo.cases)} />
          <InfoBox 
            active={casesType==="recovered"}
            onClick={(e)=>setCasesType("recovered")}
            title={"Recovered"} 
            newCases={prettyPrintNew(countryInfo.todayRecovered)} 
            total={prettyPrintTotal(countryInfo.recovered)} />
          <InfoBox 
            isRed
            active={casesType==="deaths"}
            onClick={(e)=>setCasesType("deaths")}
            title={"Deaths"} 
            newCases={prettyPrintNew(countryInfo.todayDeaths)} 
            total={prettyPrintTotal(countryInfo.deaths)} />

        </div>

        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType={casesType} />

      </div>

      <Card className = "app__right">
          <CardContent>
            <h3 className="app__tableTitle" >Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle" >New worldwide {casesType} </h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
      </Card>          


    {/* {Header} */}
    {/* {Title + Input DropDown} */}

    {/* {InfoBox} */}
    {/* {InfoBox} */}
    {/* {InfoBox} */}

    {/* {Table} */}
    {/* {Graph} */}

    {/* {Map} */}

    </div>
  );
}

export default App;
