import React, {useState} from "react"

function ScheduleComponent(){
    const {time} = Array.from({length: 24}).reduce(
        ({time, current}) => ({
            time: [...time, current],
            current: current + 1
        }),
        {time: [], current: 1}
    )
    return(time);
}

export default ScheduleComponent;
