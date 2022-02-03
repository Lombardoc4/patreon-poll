import { useState, useEffect } from "react";

let timeout;

const RedirectTimer = ({url}) => {
    const [startTime, setStartTime] = useState(false);
    const [timer, setTimer] = useState(30);
    // let currTime = new Date().getTime();

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

    if (startTime) {

        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{width: '25%'}}>
                    <button onClick={() => {clearInterval(timeout)}} style={{width: '100%'}} className="button">Stop</button>
                </div>
                <div style={{width: '75%', margin: '1em'}}>
                    Redirecting to <a href={url}>{url}</a> in&nbsp;<b>{timer}&nbsp;seconds</b>
                </div>
            </div>
        )
    } else {
        return <></>
    }

};

export default RedirectTimer;