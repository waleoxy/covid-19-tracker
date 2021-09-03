import React from "react";
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide")

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))
          setCountries(countries);

        })
    }
    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)
  }

  return (
    <div className="app">
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

        <InfoBox title="Coronavirus cases" cases={2235} total={22555} />

        <InfoBox title="Recovered" cases={2235} total={22555} />

        <InfoBox title="Deaths" cases={2235} total={22555} />
      </div>
      <Map />
      {/*3 boxes */}

      {/*map */}

    </div>
  );
}

export default App;
