import { useState } from "react";

const SurveyOptionsDD = ({copy, options}) => {
    const [open, toggleOpen] = useState(false);

    const openStyle = {
        display: 'block',
        position: 'absolute',
        border: '1px solid grey',
        backgroundColor: 'white',
        padding: '0.5em',
        fontSize: '12px'
    }
    const closeStyle = {
        display: 'none'
    }

    return (
        <>
        <button onClick={() => toggleOpen(!open)} className="button liveButton">{copy}</button>
        { open &&
            <div style={ open ? openStyle : closeStyle}>
                {options.map((o, i) => (
                    <p key={o} style={{padding: '0.5em', borderBottom: i + 1 !== options.length ? '1px solid grey' : ''}}>{o}</p>
                ))}
            </div>

        }
        </>
    )
}

export default SurveyOptionsDD;