import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResultsPanel from "./resultsPanel";
import PollButtons from "./pollButtons";

const Option = ({ click, active, children, ...rest}) => {
    return(
        <div data-target={rest?.target || undefined} className="optionButton" onClick={(e) => {click(rest.value || e)}} >
            <input data-target={rest?.target || undefined} readOnly id={rest?.value} checked={active} type="checkbox" value={rest?.value}/>
            { children }
        </div>

)}

const PollOptions = ({dates, options}) => {


    const [poll, setPoll] = useState(false);
    const [view, setView] = useState('options');
    const [selected, changeSelected] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    let params = useParams();

    let optionValues = {};
    let optionVotes = {};
    let totalVotes = 0;


    if (poll?.options) {
        // console.log('options', poll.options);
        optionValues = Object.keys(poll.options);
        optionVotes = Object.values(poll.options);
        totalVotes = optionVotes.reduce((sum, v) => sum + v, 0);
    }

    useEffect(() => {
        // Get Poll Data


        const getPolls = async () => {
            const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonGetPoll", {
                method:  'POST',
                body:    JSON.stringify(params),
            })
            return await res.json();
        }
        getPolls().then((data) => {
            setPoll(data);
        })


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const windowValue = window.localStorage.getItem('survey');
        if (windowValue && poll?.options) {
            const spacerIndex = windowValue.indexOf('-');
            const submitTime = parseInt(windowValue.slice(0, spacerIndex));
            const parseDates = {
                start: new Date(poll.start_date).getTime(),
                end: new Date(poll.end_date).getTime()
            }

            if (submitTime > parseDates.start && submitTime < parseDates.end) {
                changeSelected(windowValue.slice(spacerIndex + 1));
                setSubmitted(true);
            } else {
                window.localStorage.removeItem('survey');
            }
        }
    }, [poll])

    const selectOption = (option) => {
        changeSelected(selected === option ? false : option);
    }



    const handleSubmit = async () => {
        if (!selected) {
            return;
        }


        const data = {
            id: poll._id,
            selected: "options." + selected
        }

        console.log(data);

        // const res = fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonSubmitPoll", {
        //     method:  'POST',
        //     body:    JSON.stringify(data),
        // })

        window.localStorage.setItem('survey', Date.now() + '-' + selected);
        setView(view === 'options' ? 'results' : 'options')
        setSubmitted(true);
    }


    const customOptionClick = (e) => {
        const buttonTarget = e.target.dataset.target;
        const value = document.getElementById(buttonTarget).value || ' '; // !needs space as filler
        selectOption(value);
    }




    return (
        <main id="poll">
            { !poll.options ?
                <div>
                    <h1>404</h1>
                    <p>No Poll Here</p>
                </div>
                :
                <>
                    <h1>Will Ramos Cover Poll</h1>
                    { poll.options &&
                        <>
                            <p className='endDate'>
                            Survey Ends: {new Date(poll.end_date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: 'short', day: "numeric"})}
                            </p>
                            <div className="panel">
                                { view === 'results' &&
                                    <ResultsPanel optionValues={optionValues} optionVotes={optionVotes} totalVotes={totalVotes}/>
                                    // <div id="results" style={{width: '100%'}}>
                                    //     {optionVotes.map((o, i) => (

                                        //         <div key={optionValues[i]} style={{width: '100%', display: 'flex', alignItems: 'center', padding: '0.25em'}}>
                                        //             <p style={{width: '25%', fontSize: '14px', textAlign: 'end', padding: '0 1em'}}> {optionValues[i]}</p>
                                        //             <div style={{width: '75%',  display: 'flex', alignItems: 'center',}}>
                                        //                     <div style={{backgroundColor: 'red', width: `${Math.floor((o / totalVotes) * 100)}%`, borderRadius: '1em'}} >&nbsp;</div>
                                        //                     <b style={{padding: '0 0.5em'}} >{Math.floor((o / totalVotes) * 100)}%</b>
                                        //             </div>
                                        //         </div>
                                        //     ))}
                                        // </div>
                                    }
                                { view === 'options' &&
                                    <div id="pollOptions">
                                        <div className='optionsGrid' style={{gridTemplateColumns: `repeat(${Math.round(optionValues.length / 4) + 1}, 1fr)` }}>
                                        {optionValues.map(o => (
                                            <Option key={o} click={selectOption} active={o === selected ? true : false} value={o}>
                                                <label>{o}</label>
                                            </Option>
                                        ))}
                                        </div >
                                            <Option target='customOption' style={{marginTop: '1em'}} click={customOptionClick} active={(selected && !optionValues.includes(selected)) ? true : false}>
                                                {/* <label style={{paddingLeft: '1em'}}>{o}</label> */}
                                                <input data-target='customOption' id="customOption" onChange={(e) => selectOption(e.target.value)} type="text" placeholder="Your Choice"/>
                                            </Option>
                                    </div>
                                }

                                <PollButtons submitted={submitted} setView={setView} view={view} handleSubmit={handleSubmit}/>

                            </div>
                        </>
                    }
                </>
            }
            </main>
    )
}

export default PollOptions;