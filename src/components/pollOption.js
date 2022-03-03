import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Results } from "./Result";
import RedirectTimer from "./redirectTimer"
import PollButtons from "./pollButtons";
import { CircleButton } from "./Button";

const Option = ({ click, active, children, ...rest}) => {
    return(
        <div
        data-target={rest?.target || undefined}
        className="pollOption flex items-center border bg-white border-black my-6 px-4 py-2 rounded-lg"
        onClick={(e) => {click(rest.value || e)}} >
            <input data-target={rest?.target || undefined} readOnly id={rest?.value} checked={active} type="radio" name="survey" value={rest?.value}/>
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
    const timerRef = useRef();
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
            // const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonGetPoll", {
            //     method:  'POST',
            //     body:    JSON.stringify(params),
            // })
            // return await res.json();
            return {
                "_id": {
                  "$oid": "61f302c763d8c2ab4c6ceec6"
                },
                "title": "First Survey",
                "end_date": "Friday, Mar 4, 2022",
                "start_date": "Friday, Feb 11, 2022",
                "options": {
                    "Track Tip1": 5,
                    "Dusti's DDDDSDSAFDSFSDFesires": 19,
                    "Track Tip2": 9,
                    "Dusti's Desirs": 11,
                    "Track Tip For the fliperroni3": 4,
                    "Dusti's Deses": 21,
                    "Dusti's Dees": 22,
                },
                "user": 'TheWillRamos'
            }
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
        window.addEventListener('scroll', () => {
            if (timerRef.current) {
                // const { scrollBottom,  } = timerRef.current;
                const scrollHeight = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                const scrollTop = window.scrollY;
                const innerHeight = window.innerHeight;
                if (innerHeight + scrollTop === scrollHeight) {
                  console.log("reached bottom");
                  timerRef.current.classList.remove('shadow-top')
                } else {
                  timerRef.current.classList.add('shadow-top')
                }
              }
        })
    }, []);

    useEffect(() => {
        const windowValue = window.localStorage.getItem('survey');
        console.log(windowValue)
        if (windowValue && poll?.options) {
            const spacerIndex = windowValue.indexOf('-');
            const submitTime = parseInt(windowValue.slice(0, spacerIndex));
            const parseDates = {
                start: new Date(poll.start_date).getTime(),
                end: new Date(poll.end_date).getTime()
            }

            // console.log('submit', submitTime)
            // console.log('parsed', parseDates)

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


    const submitVote = async () => {
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


    if (loading) {
        return <h1>Loading</h1>
    }

    if (!loading && !poll.options) {
        return (
            <>
                <h1>404</h1>
                <p>No Poll Here</p>
            </>
        )
    }

    if (active) {

        const description = (
            <div className="py-4 px-6 shadow-dark border-b border-black bg-white">
                Survey {active.desc} on: <span className="font-bold">{new Date(active.date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: 'short', day: "numeric"})}</span>
            </div>
        )

        return active.desc === 'finished' ?
            (
                <>
                    {description}
                    <Results pollData={poll}/>
                </>
            ) : (
                <main id="pollMain">
                    {description}
                </main>
            )
    }



    if (view === 'results') {
        return (
            <div className="min-h-screen flex flex-col">
                <Results pollData={poll}/>

                <CircleButton onClick={() => setView(view === 'options' ? 'results' : 'options')}  classList="ml-auto bg-primary fixed bottom-4 right-4 rounded-full">
                    <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="25" height="25.1" viewBox="0 0 35.33 27"><line x1="1" y1="1" x2="1" y2="26" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/><line x1="1" y1="26" x2="34.33" y2="26" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/><line x1="5.17" y1="20.17" x2="16.83" y2="10.17" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="16.92" y1="10.18" x2="21" y2="15.17" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="21.3" y1="14.91" x2="31.37" y2="6.82" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                </CircleButton>
                {/* Redirect */}
                {/* <div className="fixed bottom-0">
                <RedirectTimer url={poll.returnURL}/>
                </div> */}

            </div>
        )
    }



    return (
        <main id="pollMain">
            { poll.options &&
            <div className="w-full px-4 py-6 rounded-lg" style={{backgroundColor: 'rgba(255,255,255,0.9)'}}>
                <h1 className="text-3xl font-bold font-grotesk w-3/4">{poll.title}</h1>
                <div className="h-1 border-b border-black mb-4"/>
                <div id="pollOptions">
                    {poll.custom &&
                    <Option target='customOption' click={customOptionClick} active={(selected && !optionValues.includes(selected)) ? true : false}>
                        <input
                        data-target='customOption'
                        id="customOption"
                        className="text-2xl ml-4 bg-transparent outline-none"
                        onChange={(e) => selectOption(e.target.value)}
                        type="text"
                        placeholder="Your Choice"/>
                    </Option>
                    }
                    {optionValues.map(o => (
                        <Option key={o} click={selectOption} active={o === selected ? true : false} value={o}>
                            <label className="text-2xl">{o}</label>
                        </Option>
                    ))}
                </div>


                {submitted &&
                    <>
                    <CircleButton onClick={() => {setView(view === 'options' ? 'results' : 'options')}} classList="fixed bottom-4 left-4 rounded-full ml-auto bg-primary">
                        <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="25" height="25.1" viewBox="0 0 35.33 27"><line x1="1" y1="1" x2="1" y2="26" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/><line x1="1" y1="26" x2="34.33" y2="26" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/><line x1="5.17" y1="20.17" x2="16.83" y2="10.17" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="16.92" y1="10.18" x2="21" y2="15.17" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="21.3" y1="14.91" x2="31.37" y2="6.82" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                    </CircleButton>
                    </>
                }
                <CircleButton  onClick={() => submitVote()}  classList="fixed bottom-4 right-4 rounded-full bg-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="23" y1="7.01" x2="7.54" y2="19.99" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="7.35" y1="19.91" x2="2" y2="12.88" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                </CircleButton>
            </div>
            }
        </main>
    )
}

export default PollOptions;