import React, {useEffect, useState} from "react";
import axios from "axios";

function Body(){
    
  var [fieldWarning, setFieldWarning] = useState("");
  var [result, setResult] = useState("");
  var [date, setDate] = useState("");
  var [time, setTime] = useState("");
  var [country, setCountry] = useState("Pakistan");
  var [countries, setCountries] = useState([]);
  var [urgency, setUrgency] = useState("Normal");

  useEffect(()=>{
    axios.get("http://localhost:5000/getCountry")
    .then(function (response) {
      // handle success
      console.log(response.data);
      setCountries(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }, []);

  function handleClick(){
    console.log("I got clicked");
    if(date===""){
      setFieldWarning("please enter the date");
    }
    else if(time===""){
      setFieldWarning("please enter the time");
    }
    else if(country===""){
      setFieldWarning("please Select a country");
    }
    else if(urgency===""){
      setFieldWarning("please select Urgency");
    }
    else{
      console.log(time);
      var dd = new Date(date);
      var ddate = dd.getDate();
      var dMonth = dd.getMonth();
      var dYear = dd.getFullYear();
      console.log("date "+ddate+" - Month "+dMonth+" - Year "+dYear);
      axios.post("http://localhost:5000",{
        date: date,
        time: time,
        country: country,
        urgency: urgency
      })
      .then(function(response) {
        // handle success
        console.log(response);
        var resData = response.data.data;
        console.log(response.data.data);
        console.log(response.data.status);
        if(response.data.status==="data recieved!"){
          var dt = new Date(date);
          var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var day = days[dt.getDay()];
          console.log(date);
          console.log(day);
          var dateOnly = date[date.length-2]+""+date[date.length-1];
          console.log(dateOnly);
          var timeHour = time[0]+""+time[1];
          timeHour = parseInt(timeHour);
          var timeDif = ((timeHour+1)-parseInt(resData.endingHour));
          if(urgency==="Normal"){
            if(day===resData.weekend){
              var deliveryDay =  days[dt.getDay()+1];
              console.log("Starting Hour "+resData.startingHour+" - Ending Hour "+resData.endingHour);
              console.log(timeDif);
              console.log("Delivery Day is "+deliveryDay+" between "+resData.startingHour);
              setResult("Your package will be delivered on "+(ddate+2)+"-"+(dMonth+1)+"-"+dYear+" between 9:00 AM - 11:00 AM");
            }
            else if((timeDif+8)<=10){
              setResult("Your package will be delivered on "+(ddate+1)+"-"+(dMonth+1)+"-"+dYear+" between 9:00 AM - 11:00 AM");
            }
            else if((timeDif+8)>10){
              setResult("Your package will be delivered on "+(ddate+2)+"-"+(dMonth+1)+"-"+dYear+" between 9:00 AM - 11:00 AM");
            }
          }
          else if(urgency==="Urgent"){
            if(day===resData.weekend){
              setResult("Your package will be delivered on "+(ddate+1)+"-"+(dMonth+1)+"-"+dYear+" between 9:00 AM - 11:00 AM");
              console.log(result);
            }
            else if(day!==resData.weekend){
              if(timeDif>=6){
                if(day==="Friday"){
                  setResult("Your package will be delivered on "+(ddate+3)+"-"+(dMonth+1)+"-"+dYear+" before "+resData.endingHour+":00");
                }
                else{
                  setResult("Your package will be delivered on "+(ddate+2)+"-"+(dMonth+1)+"-"+dYear+" before "+resData.endingHour+":00");
                }
              }
              else{
                setResult("Your package will be delivered on "+(ddate+2)+"-"+(dMonth+1)+"-"+dYear+" between 9:00 AM - 3:00 PM");
              }
            }
          }
          setCountry("Pakistan");
          setTime("");
          setDate("");
          setUrgency("Normal");
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
    }
  }


return(
    <div className="bodyDiv">
        <div className="formDiv form-group">
            <h1>Delivery Time Calculator</h1>
            <p className="resultText">{result}</p>
            <label className="formLabel">Date</label><br />
            <input type="date" className="inputField inputData date" onChange={(e)=>{setDate(e.target.value); setResult("");}}  value={date} /><br />
            <label className="formLabel">Time</label><br />
            <input type="time" className="inputField inputData time" onChange={(e)=>{setTime(e.target.value); setResult("");}}  value={time} /><br />
            <label className="formLabel">Country</label><br />
            <select className="inputField inputData select" value={country} onChange={(e)=>{setCountry(e.target.value);  setResult("");}}>
            {countries.map((result)=>{
              console.log(result);
              return (<option key={result._id+"asdsadsa"} value={result.name}>{result.name}</option>);
            })}
            </select><br />
            <label className="formLabel">Urgency</label><br />
            <select className="inputField inputData select" value={urgency} onChange={(e)=>{setUrgency(e.target.value); setResult("");}}>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select><br />
            <label><sub>{fieldWarning}</sub></label>
            <button className="inputField calBut" onClick={handleClick} >Calculate Time</button>
        </div>
    </div>
);


}

export default Body;