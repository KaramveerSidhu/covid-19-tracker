import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
    // const sortedData = [...data]
    const sortedData = data

    sortedData.sort((a,b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    });

    return sortedData;
};

const casesTypeColors = {
    cases: {
      hex: "#ffa500",
      multiplier: 200,
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 300,
    },
    deaths: {
      hex: "#CC1034",
      multiplier: 500,
    },
  };

export const showDataOnMap = (data, casesType="cases") => (
    data.map(country=>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]} 
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            fillOpacity={0.4}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed"> Cases: {numeral(country.cases).format("0,0")} </div>
                    <div className="info-recovered"> Recovered: {numeral(country.recovered).format("0,0")} </div>
                    <div className="info-deaths"> Deaths: {numeral(country.deaths).format("0,0")} </div>
                </div>
            </Popup>

        </Circle>
    ))
);


export const prettyPrintTotal = (total) => {
    return total ? `${numeral(total).format("0.0a")}` : "+0";
}
  
export const prettyPrintNew = (newCases) => {
    return newCases ? `+${numeral(newCases).format("0.0a")}` : "+0";
}
  
  