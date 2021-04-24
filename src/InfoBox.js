import {Card, CardContent, Typography} from '@material-ui/core';
import "./InfoBox.css";

function InfoBox({isRed, isOrange, active, title, newCases, total, ...props}) {
    return (
        <div className={active? (isRed? "infoBox infoBox--selected infoBox--red": (isOrange? "infoBox infoBox--selected infoBox--orange": "infoBox infoBox--selected")) : "infoBox" }> 
        {/* className={`infoBox` ${active && "infoBox--selected"}} */}
            <Card onClick={props.onClick}>
                <CardContent>
                    <Typography className = "infoBox__title"> {title} </Typography>

                    <h2 className = "infoBox__newCases"> {newCases} </h2>

                    <Typography className = "infoBox__total"> {total} Total </Typography>
                </CardContent>   
            </Card>
            
        </div>
    )
}

export default InfoBox
