import {useState, useEffect} from "react";
import {Line} from "react-chartjs-2";
import {options} from './graphOptions';

function LineGraph({casesType, ...props}) {

    const [data, setData] = useState({});

    const buildChartData = (data, casesType) => {
        let chartData = [];
        let lastPointData;
        for (let date in data.[casesType]) {
            if (lastPointData) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastPointData, //Because I am finding the new number of cases and the data provided to me contained total cases everyday.
                }
                chartData.push(newDataPoint)
            }
            lastPointData = data[casesType][date];
        }
        return chartData;
    };

    useEffect(() => {

        const fetchChartData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, casesType);
                setData(chartData);
            })
        }

        fetchChartData();
        
    }, [casesType]);

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line 
                    data={{
                        datasets: [
                        {
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data,
                        },
                        ],
                    }}
                    options = {options}
                />
            )}
        </div>
    )
}

export default LineGraph;
