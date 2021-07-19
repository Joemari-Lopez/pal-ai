import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core';
import api from "../api/recommenderapi"
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import "../styles/croprecommenderoutput.css"
import {fertilizerData} from "./Data"
import Loading from './Loading';


const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width: "280px",
      backgroundColor: "whitesmoke",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
        maxWidth: 550,
    },
    table: {
        minWidth: 450,
    },
}));

function FertilizerRecommender() {
    const [formData, setFormData] = useState({
        Temparature:"",
        Humidity:"",
        Moisture:"",
        soil_type:"select",
        crop_type:"select",
        Nitrogen:"",
        Potassium:"",
        Phosphorous:"",
    })

    const [predictionData, setPredictionData] = useState({})

    const [loadingStatus, setLoadingStatus] = useState(false)
    
    const classes = useStyles();


    const formRenderData = [
        {
           name:"Nitrogen",
           description:"Amount Of Nitrogen in Soil"
        },
        {
            name:"Potassium",
            description:"Amount of Potassium in Soil"
         },
         {
            name:"Phosphorous",
            description:"Amount of Phosphorous in Soil"
         },
         {
            name:"Temparature",
            description:"Temperature (in Celcius)"
         },
         {
            name:"Humidity",
            description:"Humidity (in %)"
         },
         {
            name:"Moisture",
            description:"Moisture in Soil"
         }
    ]

    const soilTypes = ['Sandy', 'Loamy', 'Black', 'Red', 'Clayey']
    const cropTypes = ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts']

    const handleChange = (e, changeKey=undefined) => {
        // console.log(changeKey, e.target.value)
        let newData = {...formData}
        if(changeKey) {
            newData[changeKey] = e.target.value
        }
        else newData[e.target.id] = e.target.value
        setFormData(newData)
    }

    const handleClick = async () => {

        setLoadingStatus(true)
        
        const request = new FormData()

        for(let key in formData) {
            request.append(key, formData[key])
        }

        const response = await api.post(
            "/predict_fertilizer",
            request
        )
        
        const responseData = response.data
        setPredictionData(responseData)
        setLoadingStatus(false)
    }

    const handleBackClick = () => {
        setPredictionData({})
    }

    const predictedFertilizer = fertilizerData[predictionData.final_prediction]



    if (predictionData.final_prediction) {

        const outputComponent = (


            <div className="output_container">
                <Card className={`${classes.root} output_container__card`}>
                    {/* <CardActionArea> */}
                        <CardMedia
                        component="img"
                        alt={predictedFertilizer.title}
                        height="225"
                        image={predictedFertilizer.imageUrl}
                        title={predictedFertilizer.title}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            <b>Prediction: </b>{predictedFertilizer.title}
                        </Typography>
                        <Typography variant="body3" color="textPrimary" component="p">
                            {predictedFertilizer.description}
                        </Typography>
                        <br/>
                        </CardContent>
                    {/* </CardActionArea> */}
                    <CardActions>
                        <Button onClick={()=>handleBackClick()} className="back__button" variant="contained" size="small" color="primary">
                        Back to Prediction
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )

        return outputComponent


    }

    else if(loadingStatus) {
        return <Loading />
    }


    else return (
        <div  className="animate">
        <div className="form">
            
             <div className="form__form_group">

                {
                    predictionData.error && 
                    <Alert style={{marginTop:"20px"}} severity="error"> { predictionData.error } </Alert>
                }

                <center><div className="form__title">Fertilizer Recommender</div></center>
                <div className="cube">
                <div className="column2">
                {
                   
                    formRenderData.map((formAttribute) => {
                        
                        return <TextField
                        key={formAttribute.name} 
                        onChange={(e) => handleChange(e)}
                        value={formData[formAttribute.name]}
                        className="form__text_field"
                        id={formAttribute.name}
                        name={formAttribute.name}
                        variant="filled"
                        label={formAttribute.description}
                        />
                    })
                   
                }
                 </div>

                <TextField
                    id="soil_type"
                    name="soil_type"
                    select
                    label="Soil Type"
                    value={formData.soil_type}
                    onChange={(e) => handleChange(e, "soil_type")}
                    SelectProps={{
                        native: true,
                    }}
                    variant="filled"
                    className="form__selector_soil"
                    >
                    <option key={"select"} value={"select"}>
                    {"Select"}
                    </option>
                    {soilTypes.map((soiltype) => (
                        <option key={soiltype} value={soiltype}>
                        {soiltype}
                        </option>
                    ))}
                </TextField>


                <TextField
                    id="soil_type"
                    name="soil_type"
                    select
                    label="Crop Type"
                    value={formData.crop_type}
                    onChange={(e) => handleChange(e, "crop_type")}
                    SelectProps={{
                        native: true,
                    }}
                    variant="filled"
                    className="form__selector_crop"
                    >
                    <option key={"select"} value={"select"}>
                    {"Select"}
                    </option>
                    {cropTypes.map((croptype) => (
                        <option key={croptype} value={croptype}>
                        {croptype}
                        </option>
                    ))}
                </TextField>

                {/* <div style={{display:"flex",justifyContent:"space-around", flexWrap:"wrap"}}>
                <FormControl variant="filled" className={`${classes.formControl} form__select`}>
                    <InputLabel id="demo-simple-select-filled-label">Soil Type</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="soil_type"
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={(e) => handleChange(e, "soil_type")}
                    >
                    {
                        soilTypes.map((soiltype) => {
                            return <MenuItem key={soiltype} value={soiltype}>{soiltype}</MenuItem>
                        })
                    }
                    </Select>
                </FormControl>

                <FormControl variant="filled" className={`${classes.formControl} form__select`}>
                    <InputLabel id="demo-simple-select-filled-label">Crop Type</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="crop_type"
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={(e) => handleChange(e, "crop_type")}
                    >
                    {
                        cropTypes.map((cropType) => {
                            return <MenuItem key={cropType} value={cropType}>{cropType}</MenuItem>
                        })
                    }
                    </Select>
                </FormControl>
                </div> */}

                <Button onClick={()=>handleClick()} className="form__button" color="primary" variant="contained">Predict Fertilizer</Button>
                </div>
            </div>
        </div>
    </div>  
    )
}

export default FertilizerRecommender
