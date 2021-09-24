import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1
        } else {
            return 1
        }
    })
    return sortedData
}

export const sortData_Deaths = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.deaths > b.deaths) {
            return -1
        } else {
            return 1
        }
    })
    return sortedData
}

export const sortData_Recovered = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.recovered > b.recovered) {
            return -1
        } else {
            return 1
        }
    })
    return sortedData
}

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 150
    },
    recovered: {
        hex: "#7DD71D",
        multiplier: 225,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 300
    }
}


export const showDataOnMap = (data, casesType = "cases") => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0.0")} </div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0.0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0.0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
)

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "No cases of corona virus detected"

