import { useEffect, useRef, useState } from "react";
import ResultsPanel from "./resultsPanel";


const PollResults = ({poll}) => {
    const optionValues = Object.keys(poll.options);
    const optionVotes = Object.values(poll.options);
    const totalVotes = optionVotes.reduce((sum, v) => sum + v, 0);
    return (
        <ResultsPanel optionValues={optionValues} optionVotes={optionVotes} totalVotes={totalVotes}/>
    )
}

const PollOptions = ({options, pollData, setPollData}) => {
    const addPollOption = (e, i) => {
        const newOptions = [...pollData.options];
        newOptions[i] = e.target.value;
        setPollData({...pollData, options: newOptions});
    }

    const removePollOption = (i) => {
        pollData.options.splice(i, 1);
        setPollData({...pollData, options: pollData.options});
    }


    return options.map((o, i) => (

        <div className="addPollOption" key={'option' + i}>
            <input id="user"
            onChange={(e) => {
                addPollOption(e, i)
            }}
            placeholder={`Option ${i + 1}`}
            style={{width: '100%'}}
            type='text'
            />
            {i >= 2 &&
                <img onClick={() => {removePollOption(i)}} height="50px" width="50px" style={{width: '1em', height: '1em'}} src="close.svg" alt="+"/>
            }
        </div>
    ));
}


const AdminPanel = () => {
    const [loggedIn, setLogin] = useState(false);
    const [loginErr, setLoginErr] = useState(false);
    const [polls, setPolls] = useState([]);
    const [pollData, setPollData] = useState(false);
    const userRef = useRef('');
    const codeRef = useRef('');

    const getPolls = () => {
        const fetchPolls = async () => {
            const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonGetAllPolls")
            return await res.json();
        }
        fetchPolls().then((data) => {
            setPolls(data);
        })
    }

    useEffect(() => {
        if (document.cookie) {
            const parseCookie = str =>
            str
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});

            const cookies = parseCookie(document.cookie);
            if (cookies._user) {
                setLogin(true);
            }
        }
    }, [])

    useEffect(() => {
        if (loggedIn) {
            getPolls();
        }
    }, [loggedIn])

    const clearPollData = () => {
        setPollData(false);
    }


    const handleLogin = (login) => {

        if (!login) {
            setLogin(false);
            clearPollData();

            document.cookie = `_user=; expires=${new Date().toUTCString()}`;
            return;
        }
        const user = userRef.current.value;
        const code = codeRef.current.value;

        if (!user || !code) {
            return;
        }

        // Send post request to login
        const loginPost = async () => {
            const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonAdminLogin", {
                method:  'POST',
                body:    JSON.stringify({
                    username: user,
                    code: code
                }),
            })
            return await res.json();
        }
        loginPost().then((data) => {
            if (data.user) {
                setLogin(true);
                let cookieExpire = new Date();
                cookieExpire.setTime(cookieExpire.getTime() + 86400000); // 86400000 milli in 24 hours
                document.cookie = `_user=${data._id}; expires=${cookieExpire.toUTCString()}`;
            }
            else {
                setLoginErr(data.err);
            }
        })


    }

    const submitPoll = (e) => {
        e.preventDefault();
        if (! pollData.title || !pollData.start_date || !pollData.end_date || pollData.options.length < 2){
            console.log('incomplete')
            return;
        }

        const parsedOptions = {};
        pollData.options.map(o => parsedOptions[o] = 0);

        pollData.options = parsedOptions;

        // Post Data
        const addPoll = async () => {
            const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonAddPoll", {
                method:  'POST',
                body:    JSON.stringify(pollData),
            })
            return await res.json();
        }
        addPoll().then((data) => {
            if (data.insertedId) {
                // setPolls([...polls, pollData]);
                getPolls();
                setPollData(false);
            }
        })

        // Return to surveys and refetch polls
    }


    return (
        <main id="admin">

            <div className="panel" style={{minWidth: loggedIn && '50%'}}>
                { !loggedIn &&
                    <>
                        <h1>Patreon Polls</h1>
                        <form onSubmit={(e) => {e.preventDefault(); handleLogin(true)}}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <input id="user" ref={userRef} placeholder="Username" type='text'/>
                                <input id="code" ref={codeRef} placeholder="Password" type='password'/>
                                {loginErr && <p style={{fontSize: '12px'}}>{loginErr}</p>}
                            </div>
                            <button type='submit' style={{width: '100%'}} className="button">Login</button>
                        </form>
                    </>
                }
                { loggedIn &&
                    <>
                            {/* Header Buttons */}
                            <div style={{display: 'flex', marginBottom: '1em '}}>
                                {   pollData ?
                                    <button onClick={() => clearPollData()} style={{width: '66%', marginRight: '1em'}} className="button">Back</button>
                                    :
                                    <button onClick={(e) => {
                                        setPollData({
                                            title: '',
                                            start_date: '',
                                            end_date: '',
                                            options: ['', '']
                                        });
                                        e.target.blur();
                                    }}
                                    style={{width: '66%', marginRight: '1em'}}
                                    className="button">
                                        Add Poll
                                    </button>
                                }
                                <button onClick={() => handleLogin(false)} style={{width: '33%', marginLeft: '1em'}} className="button">Logout</button>
                            </div>

                            {/* All Polls */}
                            { !pollData  &&
                                <div className="optionsGrid"  style={{gridTemplateColumns: `repeat(2, 1fr)` }}>
                                    {polls && polls.map(p => (
                                        <div onClick={() => setPollData(p)} key={p.title} style={{cursor: 'pointer', padding: '1em', border: '1px solid lightgrey', borderRadius: '1em', }}>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <p>{p.title}</p>
                                                <p>{Object.values(p.options).reduce((sum, v) => v ? sum + v : sum, 0)} votes</p>
                                            </div>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div>
                                                    <p>Starts: {new Date(p.start_date).toDateString()}</p>
                                                    <p>Ends: {new Date(p.end_date).toDateString()}</p>
                                                </div>
                                                <a href={`localhost:3000/${p._id}`} target='_blank' rel="noreferrer">Survey Link</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }

                            {/* Add Survey Form */}
                            { (pollData && !pollData._id) &&
                                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={(e) => {submitPoll(e)}}>
                                    <input onChange={(e) => setPollData({...pollData, title: e.target.value})} style={{fontSize: '1.5em', margin: '0'}} id="user" placeholder="Title" type='text'/>
                                    <div style={{display: 'flex',  margin: '1em 0 0'}}>
                                        <div style={{width: '50%', marginRight: '0.5em'}}>
                                            <label htmlFor="start_date">Start Date</label><br/>
                                            <input id="start_date" onChange={(e) => setPollData({...pollData, start_date: e.target.value})} type="datetime-local" />
                                        </div>
                                        <div style={{width: '50%', marginLeft: '0.5em'}}>
                                            <label htmlFor="end_date">End Date</label><br/>
                                            <input id="end_date" onChange={(e) => setPollData({...pollData, end_date: e.target.value})} type="datetime-local" />
                                        </div>
                                    </div>
                                    <div style={{ margin: '1em 0 0', maxHeight: '300px', overflow: 'scroll'}} >

                                        <PollOptions options={pollData.options} pollData={pollData} setPollData={setPollData}/>

                                        {/* <div>
                                            <input id="user" placeholder="Option 1" type='text'/>
                                            <img height="50px" width="50px" style={{width: '1em', height: '1em'}} src="close.svg" alt="+"/>
                                        </div>
                                        <div>
                                            <input  id="user" placeholder="Option 2" type='text'/>
                                            <img height="50px" width="50px" style={{width: '1em', height: '1em', cursor: 'pointer'}} src="close.svg" alt="+"/>
                                        </div> */}
                                    </div>
                                    <p onClick={() => setPollData({...pollData, options: [...pollData.options, '']})} style={{color: 'grey', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                                        <img height="50px" width="50px" style={{width: '1em', height: '1em'}} src="add.svg" alt="+"/>
                                            Add Option
                                    </p>
                                        {/* <button style={{ width: '33%', margin: 'auto 0 auto 1em'}} className="button">Add Option</button> */}

                                    <button style={{ width: '100%', margin: '1em 0 0'}} type="submit" className="button">Submit</button>
                                </form>

                            }

                        <>
                            {/* Poll Results */}
                            { (pollData && pollData._id) &&
                                <PollResults poll={pollData}/>
                            }
                        </>
                    </>
                }
            </div>
        </main>
    )
}

export default AdminPanel