import React from "react";
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, sortData_Recovered, sortData_Deaths } from "./util";
import Linegraph from "./Linegraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState("worldwide");
  const [tableData, setTableData] = useState([])

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
    const countryCode = event.target.value
    setCountry(countryCode);
    const url = (countryCode === "worldwide")
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${country}`
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
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
                  <MenuItem value={country.value}>{country.name} </MenuItem>

                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Coronavirus cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases} />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered} />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths} />
        </div>
        <Map />
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
          <Linegraph />

        </CardContent>
      </Card>
    </div>
  );
}

export default App;
