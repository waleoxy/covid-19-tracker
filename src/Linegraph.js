import React, { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2"
import numeral from "numeral"

const options = {
    legend: {
        display: false,
    },
    elements: {
        points: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        callback: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format('+0.0');
            }
        }
    },
    scales: {
        xAxes: {
            type: 'time',
            time: {
                format: "MM/DD/YY",
                tooltipFormat: 'll'
            }
        },
        yAxes: {
            gridLines: {
                display: false,
            },
            ticks: {
                callback: function (value, index, values) {
                    return numeral(value).format('0a')
                }
            }
        }
    }
}

const buildChartData = (data, caseType = 'cases') => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.caseType = 'cases') {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[caseType][date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[caseType][date]
    }
    return chartData
}


function Linegraph(caseType = 'cases') {
    const [data, setData] = useState({});

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => response.json())
            .then(data => {
                console.log("data", data);
                const chartData = buildChartData(data, caseType);
                setData(chartData)
            })

    }, [])

    return (
        <div>
            {data?.length > 0 && (
                <Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgroundColor: 'rgba(204, 16. 52, 0)',
                                burderColor: '#CC1034',
                                data: data
                            }
                        ]
                    }}
                />
            )}

        </div>
    )
}

export default Linegraph
