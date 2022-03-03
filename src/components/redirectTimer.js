import { useState, useEffect } from "react";
import  {CircleButton} from "./Button";

let timeout;

const RedirectTimer = ({url}) => {
    const [startTime, setStartTime] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        setStartTime(new Date().getTime())
    }, [])

    useEffect(() => {
        if (!timeout && startTime) {
            timeout = setInterval(() => {
                const currTime = new Date().getTime();
                const diff = 30 - Math.floor((currTime - startTime) / 1000);
                if (diff === 0) {
                    window.location.href = url;
                    clearInterval(timeout)
                }
                setTimer(diff);
            }, 1000);
        }
    }, [startTime])

    const clearRedirect = () => {
        clearInterval(timeout);
        setStartTime(false);
        setTimer(0);
    }


    return (
        <>
            {startTime &&
            <>
                <div className="w-full mb-2 font-bold">
                    Redirecting to <a href={url}>{url}</a> in&nbsp;<b>{timer}&nbsp;seconds</b>
                </div>
                 <CircleButton onClick={() => clearRedirect()} classList="bg-danger text-white">Stop</CircleButton>
            </>
            }
        </>
    )

};

export default RedirectTimer;