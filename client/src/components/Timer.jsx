import React, { useEffect, useState } from 'react'

const Timer = () => {

    const [second, setSeconds] = useState(0)
    const [miniutes, setMinutes] = useState(0)
    const [hour, setHour] = useState(0);
    const [stop, setStop] = useState(true);



    const handleRestart = () =>{
        setSeconds(0);
        setMinutes(0);
        setHour(0);

    }


  
    
    const handleStart = () =>{
        setStop(true);
    }

    const handleStop = () =>{
      setStop(false);
    }



 
    useEffect(()=>{

        let interval;
        if(stop){
       interval =  setInterval(()=>{

            if(second > 59){
                setMinutes(miniutes + 1);
                setSeconds(0);
                clearInterval(interval)
            }
            if(miniutes > 59){
                setHour(hour +1);
                setMinutes(0);
                clearInterval(interval);
            }

          


        }, 1000)


    }
    else{
        clearInterval(interval);
    }


    return ()=>{clearInterval(interval)};


    })


       
    
    
  

   
  return (
    <div>Timer
    <h1>{hour <10 ? "0"+hour : hour} : {miniutes < 10  ? "0"+miniutes :  miniutes} : {second < 10 ? "0"+second : second}</h1>
    <button onClick={handleRestart}>Restart</button>
    <button onClick={handleStop}>Stop</button>
    <button onClick={handleStart}>Start</button>

    </div>
  )
}

export default Timer