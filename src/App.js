import React from "react";
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, sortData_Recovered, sortData_Deaths, prettyPrintStat } from "./util";
import Linegraph from "./Linegraph";
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [worldwide, setWorldwide] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    const getWorldwideData = () => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
        })
    }
    getWorldwideData();
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))

          const sortedData = sortData(data)
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data)
        })
    }
    getCountriesData();
  }, [])

  const sortByCases = () => {
    const sortedDataCases = sortData(tableData);
    setTableData(sortedDataCases)
  }
  const sortByDeaths = () => {
    const sortedDataDeath = sortData_Deaths(tableData);
    setTableData(sortedDataDeath)
  }

  const sortRecovered = () => {
    const sortedDataRecovered = sortData_Recovered(tableData);
    setTableData(sortedDataRecovered)

  }


  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode)
    console.log("cont", countryCode);
    console.log("contr", country);
    setCountry(countryCode)
    console.log("contrr", country);
    const url = (countryCode === "worldwide" || country === "worldwide")
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${country}`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (url === "https://disease.sh/v3/covid-19/all") {
          setCountryInfo(data)
          setMapCenter({ lat: 34.80746, lng: -40.4796 })
          return setCountry(countryCode)
        } else {

          setCountryInfo(data)
          console.log("contr", country);
          setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long })
          setMapZoom(4)
          console.log("data", data);
          return
        }
      })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19-TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.name}>{country.name} </MenuItem>

                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)} />
        </div>
        <div>
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <div className="btn" >
            <button onClick={sortByCases}>Sort by cases</button>
            <button onClick={sortByDeaths}>Sort by deaths</button>
            <button onClick={sortRecovered}>Sort by recovered</button>
          </div>
          <Table countries={tableData} />

          <h3>Worldwide new cases</h3>
          <Linegraph casesType={casesType} />

        </CardContent>
      </Card>
    </div>
  );
}

export default App;
