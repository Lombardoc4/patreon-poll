import { useEffect, useState } from "react";
import Button, { CircleButton } from "./Button";
import SurveyOptionsDD from "./dropdown";
import ResultsPanel from "./resultsPanel";
import Login from './Login'
import SurveyList from "./SurveyList";
import ShareModal from "./Share";
import { Link } from "react-router-dom";


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
            <input
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


const AdminPanel = ({login, error}) => {
    const [loggedIn, setLogin] = login;
    const [loginErr, setLoginErr] = error;
    const [polls, setPolls] = useState([]);
    const [pollData, setPollData] = useState(false);
    const [shareModal, toggleShareModal] = useState(false);
    const [filters, toggleFilters] = useState(false);
    const filterOptions = ['Upcoming', 'Ongoing', 'Completed']

    const getPolls = () => {
        setPolls([{
                "_id": {
                  "$oid": "61f302c763d8c2ab4c6ceec6"
                },
                "title": "First Survey",

                "end_date": "Wednesday, Feb 16, 2022",
                "start_date": "Friday, Feb 11, 2022",
                "options": {
                  "Track Tip1": 5,
                  "Dusti's Desires": 19
                },
                "user": 'TheWillRamos'
            },{
                "_id": {
                  "$oid": "61f302c763d9c2ab4c6ceec6"
                },
                "title": "Second Survey",

                "end_date": "Wednesday, Mar 2, 2022",
                "start_date": "Friday, Feb 11, 2022",
                "options": {
                  "Track Tip1": 5,
                  "Dusti's Desires": 19
                },
                "user": 'TheWillRamos'
            },{
                "_id": {
                  "$oid": "61f302c763d9c2ab4c6ceec5"
                },
                "title": "Thirds Survey",

                "end_date": "Wednesday, Mar 2, 2022",
                "start_date": "Friday, Feb 25, 2022",
                "options": {
                  "Track Tip1": 5,
                  "Dusti's Desires": 19
                },
                "user": 'TheWillRamos'
            }])
        // const fetchPolls = async () => {
        //     const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonGetAllPolls")
        //     return await res.json();
        // }
        // fetchPolls().then((data) => {
        //     setPolls(data);
        // })
    }

    useEffect(() => {
        if (document.cookie) {
            const parseCookie = str =>
            str.split(';').map(v => v.split('=')).reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});

            const cookies = parseCookie(document.cookie);
            if (cookies._user) {setLogin(cookies._user);}
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
        // Log Out
        if (!login) {
            setLogin(false);
            clearPollData();
            document.cookie = `_user=; expires=${new Date().toUTCString()}`;
            return;
        }

        const user = login.username;
        const code = login.password;

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
                setLogin(data.user);
                let cookieExpire = new Date();
                cookieExpire.setTime(cookieExpire.getTime() + 86400000); // 86400000 milli in 24 hours
                document.cookie = `_user=${data._id}; expires=${cookieExpire.toUTCString()}`;
            } else {
                setLoginErr(data.error);
            }
        })


    }


    const submitPoll = (e) => {
        e.preventDefault();
        if (! pollData.title || !pollData.start_date || !pollData.end_date || pollData.options.length < 2){
            return;
        }

        const parsedOptions = {};
        pollData.options.map(o => parsedOptions[o] = 0);
        pollData.options = parsedOptions;
        pollData.active = true;

        // Post Data
        const addPoll = async () => {
            const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonAddPoll", {
                method:  'POST',
                body:    JSON.stringify(pollData),
            })
            return await res.json();
        }
        addPoll().then((data) => {
            if (data.upsertedId) {
                getPolls();
                setPollData(false);
            }
        })

    }

    const shareClick = (data) => {
        toggleShareModal(data)
    }

    // console.log(polls);

    return (
        <main id="admin"
        className="md:bg-contain"
        style={{
            backgroundImage: !loggedIn && 'url("/poll-maker-login.svg")',
            backgroundPosition: 'center center',
            height: !loggedIn && window.innerHeight,
        }}>
            {/* <Button classList="bg-secondary"/> */}
                { !loggedIn &&
                        <Login submitForm={handleLogin} errors={loginErr} />
                }
                { loggedIn &&
                <>
                {shareModal && <ShareModal openState={[shareModal, toggleShareModal]} data={shareModal}></ShareModal>}
                <div className=" border-b border-black shadow-dark w-full">
                    <div className="container">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-grotesk font-bold">Poll Maker</h1>
                            <button onClick={() => handleLogin(false)} className="w-1/6 ml-auto underline">Logout</button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-around w-full mt-6 mb-2">
                    {filterOptions.map(f => (
                    <Button
                    key={f}
                    onClick={() => {toggleFilters(filters === f  ? false: f)}}
                    classList={'rounded-lg px-2 py-1 ' + (filters === f ? 'bg-primary text-white' : 'bg-secondary')}
                    padding={true}>
                        <div className="flex items-center">
                            <p className="">{f}</p>
                            {/* <svg className="m-auto mr-0 pointer-events-auto" xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15"><line x1="8.5" y1="3.5" x2="20.5" y2="3.5" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10"/><line x1="18.5" y1="11.5" x2="20.5" y2="11.5" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10"/><circle cx="5.5" cy="3.5" r="3" fill="none" stroke="#000" strokeMiterlimit="10"/><circle cx="15.5" cy="11.5" r="3" fill="none" stroke="#000" strokeMiterlimit="10"/><line x1="0.5" y1="3.5" x2="2.5" y2="3.5" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10"/><line x1="0.5" y1="11.5" x2="12.5" y2="11.5" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10"/></svg> */}
                        </div>
                    </Button>
                    ))}
                    {/* <CircleButton onClick={() => toggleFilters(false)} classList="bg-danger p-2 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.67" height="16.67" viewBox="0 0 16.67 16.67"><line x1="2" y1="14.67" x2="14.67" y2="2" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2" y1="2" x2="14.67" y2="14.67" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                    </CircleButton> */}

                </div>
                <div className="container">

                    {polls && <SurveyList polls={polls} shareClick={shareClick} filter={filters}/>}
                </div>
                {/* <div onClick={() => {console.log('click'); toggleFilters(!filters)}} className={"fixed right-0 top-0 h-full d-flex bg-white/50 " + (filters ? 'w-full' : 'w-0')}>
                    <div onClick={e => e.stopPropagation()} className=" h-full ml-auto w-2/3 bg-secondary container">
                        <h3 className="text-2xl font-bold font-grotesk">Filters</h3>

                    </div>
                </div> */}
                <Link to="/add" state={{admin: loggedIn}} className="fixed bottom-4 right-4">
                    <CircleButton classList="bg-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="12" y1="22" x2="12" y2="2" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                    </CircleButton>
                </Link>



                {/* Old stuff */}
            <div className="panel shadow-lg" style={{minWidth: (loggedIn && '66%'), maxWidth: '275px'}}>
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
                            </div>

                            {/* All Polls */}
                            { !pollData  &&
                                <div className="surveyGrid">
                                    {polls && polls.map(p => (
                                        <div className="surveyBox" onDoubleClick={(e) => {if (e.target.className === 'surveyBox') {setPollData(p)}}} key={p.title} style={{display: 'flex', cursor: 'pointer', padding: '0.75em', border: '1px solid lightgrey', borderRadius: '1em', }}>
                                            <div style={{width: '33%', display: 'flex', flexDirection: 'column'}}>
                                                <p style={{marginBottom: '0.25em'}}>{p.title}</p>
                                            {/* <p style={{fontSize: '12px', marginBottom: '0.5em'}}>Starts: <b>{new Date(p.start_date).toDateString()}</b></p> */}
                                                <p style={{fontSize: '12px', color: !p.active ? "red" : "green"}}>{!p.active ? "Inactive" : "Active"}</p>
                                                <p style={{fontSize: '12px'}}>Ends: <b>{new Date(p.end_date).toDateString()}</b></p>
                                            </div>
                                            <div style={{margin: '0 auto'}}>
                                            {Object.values(p.options).reduce((sum, v) => sum + v, 0)} Votes
                                            </div>
                                            <div style={{marginLeft: 'auto'}}>
                                                <button className="button liveButton" onClick={() => setPollData(p)}>Results</button>
                                                <a className="button liveButton" onClick={(e) => e.stopPropagation()} href={`http://patreon-poll.s3-website-us-east-1.amazonaws.com/${p._id}`} target='_blank' rel="noreferrer">Live Poll</a>
                                                {/* <button className="button liveButton">More Options</button> */}
                                                <SurveyOptionsDD copy="More Options" options={["Stop Survey", "Remove Survey"]}/>
                                                {/* <select onClick={(e) => e.stopPropagation()} name="cars" id="cars"> */}
                                                    {/* <option value="">More Options</option> */}
                                                    {/* <option value="stop">Stop Survey</option> */}
                                                    {/* <option value="live">Live Poll</option> */}
                                                    {/* <option value="saab">Saab</option> */}
                                                    {/* <option value="mercedes">Mercedes</option> */}
                                                    {/* <option value="audi">Audi</option> */}
                                                {/* </select> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }

                            {/* Add Survey Form */}
                            { (pollData && !pollData._id) &&
                                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={(e) => {submitPoll(e)}}>
                                    <input onChange={(e) => setPollData({...pollData, title: e.target.value})} style={{fontSize: '1.5em', margin: '0'}} placeholder="Title" type='text'/>
                                    <input onChange={(e) => setPollData({...pollData, description: e.target.value})} placeholder="Description" type='text'/>
                                    <div className="dateGroup" style={{ margin: '1em 0 0'}}>
                                        <div className="startDate" style={{width: '50%'}}>
                                            <label htmlFor="start_date">Start Date</label><br/>
                                            <input id="start_date" onChange={(e) => setPollData({...pollData, start_date: e.target.value})} type="datetime-local" />
                                        </div>
                                        <div className="endDate" style={{width: '50%'}}>
                                            <label htmlFor="end_date">End Date</label><br/>
                                            <input id="end_date" onChange={(e) => setPollData({...pollData, end_date: e.target.value})} type="datetime-local" />
                                        </div>
                                    </div>
                                    <input type="file" accept="image/jpg" placeholder="Background Image"/>
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
                                    <div style={{ margin: '1em 0 0'}} >
                                        <p>Redirect users after survey is complete </p>
                                        <input id="returnURL"
                                            onChange={(e) => setPollData({...pollData, returnURL: e.target.value}) }
                                            placeholder={`Return URL`}
                                            style={{width: '100%'}}
                                            type='url'
                                            />
                                    </div>
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
            </div>
            </>
                }
        </main>
    )
}

export default AdminPanel