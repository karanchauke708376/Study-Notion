
import React from "react";

const HightlightText = ({color,text}) => {
    return (

        <span className={`${color} bg-clip-text text-transparent`}>
        {" "}
            {text}

        </span>
    )
}

export default HightlightText