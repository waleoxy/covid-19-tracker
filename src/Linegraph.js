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
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0.0");
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(index).format("0a")
                    }
                }
            }
        ]
    }
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



function Linegraph({ casesType = "cases" }) {
    <h1>Line graph</h1>
    const [data, setData] = useState({});



    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then(data => {
                    console.log('da', data);
                    let chartData = buildChartData(data, 'cases');
                    console.log('ch', chartData);
                    setData(chartData)
                })

        }
        fetchData();

    }, [casesType])

    return (
        <div>
            <h1>Im a graph</h1>
            {data?.length > 0 && (
                <Line

                    data={
                        {
                            datasets: [
                                {

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
