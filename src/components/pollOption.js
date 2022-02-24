import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResultsPanel from "./resultsPanel";
import RedirectTimer from "./redirectTimer"
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
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(true);
    let params = useParams();

    let optionValues = {};
    let optionVotes = {};
    let totalVotes = 0;


    if (poll?.options) {
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
            setLoading(false);
            if (new Date(data.end_date).getTime() < new Date().getTime() ) {
                setActive({desc: 'finished', date: data.end_date});
            }


            if (new Date(data.start_date).getTime() > new Date().getTime() ) {
                setActive({desc: 'starts', date: data.start_date});
            }

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

            console.log('submit', submitTime)
            console.log('parsed', parseDates)

            if (submitTime > parseDates.start && submitTime < parseDates.end) {
                changeSelected(windowValue.slice(spacerIndex + 1));
                setSubmitted(true);
            } else {
                console.log('remove local storage');
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
            selected: "options." + selected,
        }

        // Increment poll client side
        const incOption = {[selected]: poll.options[selected] + 1}
        setPoll({...poll,  incOption})

        const res = fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonSubmitPoll", {
            method:  'POST',
            body:    JSON.stringify(data),
        })

        window.localStorage.setItem('survey', Date.now() + '-' + selected);
        setView(view === 'options' ? 'results' : 'options')
        setSubmitted(true);
    }


    const customOptionClick = (e) => {
        const buttonTarget = e.target.dataset.target;
        const value = document.getElementById(buttonTarget).value || ' '; // !needs space as filler
        selectOption(value);
    }

    console.log(poll);


    return (
        <main id="poll">
            { loading  ?
                <div>
                    <h1>Loading</h1>
                </div>
            :
                <>
                { poll._id && active ?
                    <>
                        <div style={{textAlign: 'center'}}>
                            Survey {active.desc} on:<br/>
                            <b>{new Date(active.date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: 'short', day: "numeric"})}</b>
                        </div>
                        <div className="panel px-10 py-8">
                            <ResultsPanel optionValues={optionValues} optionVotes={optionVotes} totalVotes={totalVotes}/>
                        </div>
                    </>
                :
                <>
                { !poll.options ?
                    <div>
                        <h1>404</h1>
                        <p>No Poll Here</p>
                    </div>
                    :
                    <>
                        { poll.options &&
                            <>
                                <h1>{poll.description}</h1>
                                <p className='pollEndDate'>
                                    Survey Ends: {new Date(poll.end_date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: 'short', day: "numeric"})}
                                    <br/>
                                    { view !== 'results' && <>Return to <a href={poll.returnURL}>{poll.returnURL}</a></>}
                                </p>
                                <div className="panel px-10 py-8">
                                            { view === 'results' &&
                                                <>
                                                    <ResultsPanel optionValues={optionValues} optionVotes={optionVotes} totalVotes={totalVotes}/>
                                                    <RedirectTimer url={poll.returnURL}/>
                                                </>
                                            }
                                            { view === 'options' &&
                                                <div id="pollOptions">
                                                    <div className='optionsGrid'>
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
                    </>
                }
                </>
            }
            </main>
    )
}

export default PollOptions;