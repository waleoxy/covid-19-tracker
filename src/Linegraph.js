import React, { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";


const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0
        },
    },
    maintainAspectRatio: true,
}


const buildChartData = (data, casesType = `cases`) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date]

    }
    return chartData
}



function Linegraph({ casesType }) {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then(data => {
                    let chartData = buildChartData(data, 'cases');
                    setData(chartData)
                })

        }
        fetchData();

    }, [casesType])

    return (
        <div>
            <h2>Worldwide new {casesType}</h2>
            {data?.length > 0 && (
                <Line

                    options={options}
                    data={
                        {
                            datasets: [
                                {
                                    fill: true,
                                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                                    borderColor: "#CC1034",
                                    data: data,

                                }
                            ]
                        }
                    }
                />
            )}

        </div>
    )
}

export default Linegraph
