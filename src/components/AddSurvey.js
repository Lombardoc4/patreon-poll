/* eslint-disable default-case */
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import  Button, { CircleButton } from "./Button";
import { Calendar } from "./Calendar";
import Form, { Input, OptionsInput, TextArea } from "./Form";

const sections = {
    init: {section: 'init', title: 'Starting a Poll'},
    settings: {section:'settings', title: 'Settings'},
    timing: {section: 'timing', title: 'Timing'},
    preview: {section: 'preview', title: 'Preview'}
}

export const AddSurvey = ({pollData, toggleAdd}) => {
    console.log(pollData);
    const [uxData, setUXData] = useState(sections.init)
    const [poll, modPoll] = useState({
        ...pollData,
        options: Object.keys(pollData.options),
        backUp: pollData
    })


    // useEffect(() => {
    //         switch (uxData.section) {
    //             case 'init':
    //                 return setUXData({...uxData, title: 'Starting a Poll'})
    //             case 'settings':
    //                 return setUXData({...uxData, title: "Settings"})
    //             case 'timing':
    //                 return setUXData({...uxData, title: "Start & End Date"})
    //         }
    // }, [uxData.section])


    // useEffect(() => {
    // //     // console.log(location.state)
    // //     if (!location.state.admin) {
    // //         navigate('/');
    // //     }
    //     if (poll) {
    //         const propPoll = poll
    //         modPoll(propPoll);
    //     }
    //     // else {
    // //         modPoll({
    // //             title: 'Poll Question',
    // //             options: ['Option 1', 'Option 2'],
    // //             custom: false,
    // //         })
    // //     }

    // }, [])

    console.log('poll', Array.isArray(poll.options));

    const removeOption = (i) => {
        poll.options.splice(i, 1);
        modPoll({...poll, options: poll.options});
    }

    const goNext = () => {
        switch (uxData.section) {
            case 'settings':
                return setUXData(sections.preview)
            case 'timing':
          }
    }

    const goBack = () => {
        switch (uxData.section) {
            case 'init':
                modPoll(poll.backUp)
                toggleAdd(false);
                return
                // return navigate('/'); //TODO add new func
            case 'settings':
                return setUXData(sections.init)
            case 'timing':
            case 'preview':
                return setUXData(sections.settings)
          }
    }

    const setCalendar = ({from, to}) => {
        from = from.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
        to = to.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
        modPoll({...poll, start_date: from, end_date: to})
        setUXData(sections.settings)
    }

    const submitPoll = () => {
        const finalPoll = poll
        const parsedOptions = {};
        finalPoll.options.map(o => parsedOptions[o] = 0);
        finalPoll.options = parsedOptions;
        finalPoll.active = true;
        // finalPoll.user = location.state.admin; // TODO Find user
        // Post Data
        // const addPoll = async () => {
        //     const res =  await fetch("https://eguwmve5gb.execute-api.us-east-1.amazonaws.com/default/patreonAddPoll", {
        //         method:  'POST',
        //         body:    JSON.stringify(poll),
        //     })
        //     return await res.json();
        // }
        // addPoll().then((data) => {
        //     if (data.upsertedId) {
        //         // getPolls();
        //         // setPollData(false);
                    // return navigate('/');
        //     }
        // })
        console.log(finalPoll);
        // return navigate('/'); //TODO add new func
    }

    const initSubmit = (formData) => {
        if (uxData.section === 'init') {
            console.log('data', formData);
            const formOptions = Object.keys(formData).filter(d => d.toLowerCase().includes('option'));
            const data = {
                title: formData['Poll Question'],
                options: formOptions.length > 0 ? formOptions.map((o, i) => formData[o]) : poll.options
            };

            if (!data.title)
                delete data.title;

            setUXData(sections.settings);
            modPoll({...poll, ...data});

        }
    }

    const Title = poll.title && (
        <TextArea
            key={poll.title}
            id={poll.title}
            classList="text-4xl resize-none"
            // error={errors.username}
            validate={{
                required: 'This field is required',
                maxLength: {value: 140, message: 'Too Long'}
            }}
        />
    )
    const Options = Array.isArray(poll.options) ? poll.options.map((o, i) => (
        (i < 2) ?
        <Input
            key={o}
            id={'Option ' + (i + 1)}
            value={/\b(Option)( )\d+/g.test(o) ? '' : o}
            // error={errors.password}
            validate={{
                // error={errors[o]}
                required: 'This field is required',
                maxLength: {value: 50, message: 'Too Long'}
            }}
        />
        :
        <OptionsInput
            key={o}
            id={'Option ' + (i + 1)}
            removeOption={removeOption}
            index={i}
            value={/\b(Option)( )\d+/g.test(o) ? '' : o}

            validate={{
                required: 'This field is required',
                maxLength: {value: 50, message: 'Too Long'}
            }}
        />

    )) : [<h1 key="loading">Loading</h1>]

    const formInputs = [Title, ...Options];


    return (
        <div className="flex flex-col" style={{height: window.innerHeight}}>
            <div className=" border-b border-black w-full">
                <div className="container">
                    <div className="flex items-center">
                        <h1 className="text-3xl font-grotesk font-bold">{uxData.title}</h1>
                    </div>
                </div>
            </div>
            <div className="container my-8">
                {uxData.section === 'init' &&
                <Form onSubmit={initSubmit}>
                    {formInputs}
                    <p  className="text-placeholder text-2xl cursor-pointer flex items-center" onClick={() => modPoll({...poll, options: [...poll.options, 'Option ' + (poll.options.length + 1)]})}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" fill="none" stroke="#9da3ae" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="12" y1="22" x2="12" y2="2" fill="none" stroke="#9da3ae" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                        <span className="pl-2">Add Option</span>
                    </p>
                    <div className="fixed bottom-4 right-4 rounded-full">
                            <CircleButton classList="bg-success">
                                <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="4.58" y1="12.5" x2="22.5" y2="12.5" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="7.7" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="17.3" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                            </CircleButton>
                    </div>
                </Form>
                }
                {uxData.section === 'settings' &&
                    <>
                        <div className="text-xl relative md:cursor-pointer py-8">
                            <div onClick={() => {setUXData(sections.timing)}} className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-auto">
                                <svg className="pointer-events-auto absolute h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="15.14" height="19.8" viewBox="0 0 15.14 19.8"><line x1="2" y1="2" x2="13.14" y2="9.8" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2" y1="17.8" x2="13.14" y2="10" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                            </div>
                            <h2 onClick={() => {setUXData(sections.timing)}} className="w-full pr-10 truncate">Start & End Date</h2>
                            {(poll.end_date && poll.start_date) && <p className="text-xs">{poll.start_date} - {poll.end_date}</p>}
                        </div>
                        <hr/>
                        <div className="text-xl relative md:cursor-pointer py-8">
                            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-auto">
                                <svg className="pointer-events-auto absolute h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="15.14" height="19.8" viewBox="0 0 15.14 19.8"><line x1="2" y1="2" x2="13.14" y2="9.8" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2" y1="17.8" x2="13.14" y2="10" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                            </div>
                            <h2 className=" w-full pr-10 truncate leading-5">Customize Style <br/><span className="text-xs">(Coming Soon)</span></h2>
                        </div>
                        <hr/>
                        <div className="text-xl relative md:cursor-pointer py-8">
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-auto">
                                <div onClick={() => {modPoll({...poll, custom: !poll.custom})}}  className={"overflow-hidden flex items-center rounded-full w-12 h-7 shadow-inner " + (poll.custom ? 'bg-success' : 'bg-mute')}>
                                    <div className={"my-1 mx-1 rounded-full w-5 h-5 shadow-md bg-white " + (poll.custom ? 'ml-auto' : 'mr-auto')}/>
                                </div>
                            </div>
                            <h2 onClick={() => {modPoll({...poll, custom: !poll.custom})}} className=" w-full pr-10 truncate">User can add custom options</h2>
                        </div>
                        <hr/>
                        <div className="text-xl relative md:cursor-pointer py-8">
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-auto">
                                {/*  onClick={() => {modPoll({...poll, returnUrl: !poll.returnUrl})}} */}
                                <div  className={"overflow-hidden flex items-center rounded-full w-12 h-7 shadow-inner " + (poll.returnUrl ? 'bg-success' : 'bg-mute')}>
                                    <div className={"my-1 mx-1 rounded-full w-5 h-5 shadow-md bg-white " + (poll.returnUrl ? 'ml-auto' : 'mr-auto')}/>
                                </div>
                            </div>
                            {/* ! onClick={() => {modPoll({...poll, returnUrl: !poll.returnUrl})}} */}
                            <h2  className=" w-full pr-10 truncate leading-5">Redirect after complete <br/><span className="text-xs">(Coming Soon)</span></h2>
                        </div>
                        { poll.returnUrl &&
                            <>input
                            <input type="url"/>
                            </>
                        }
                        <div onClick={() => goNext()} className="fixed bottom-4 right-4 rounded-full">
                            <CircleButton classList="bg-success">
                                <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="4.58" y1="12.5" x2="22.5" y2="12.5" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="7.7" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="17.3" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                            </CircleButton>
                        </div>
                    </>
                }
                {uxData.section === 'timing' &&
                    <>
                        <Calendar setCalendar={setCalendar} initDates={{from: new Date(poll.start_date), to: new Date(poll.end_date)}}/>
                    </>
                }
                {uxData.section === 'preview' &&
                    <>
                        <Button classList='bg-secondary rounded-lg w-full mb-4'>Preview Poll</Button>
                        {/* <h2 className="text-xl mb-1">Share Preview:</h2> */}
                        <div className="rounded overflow-hidden">
                            <div className="shareImg overflow-hidden flex items-center justify-center">
                                <img src="./lorna-shore-tour-will.jpeg" className="w-100" alt=""/>
                            </div>
                            <div className="bg-mute px-4 py-2">
                                <p className="text-xl font-bold">{ poll.user } Poll</p>
                                <p>{poll.title}</p>
                            </div>
                        </div>
                        {/* <input className="bg-transparent outline-none py-2 pl-2 w-4/5 select-all" type="text" readOnly={true} value={shareURL}/> */}
                        {/* <div className={"hover:shadow-inner hover:shadow-slate-400 hover:pt-1 flex items-center justify-center ml-auto px-3 border-l border-black rounded " + (activeClick ? 'bg-success' : 'bg-secondary')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="20" viewBox="0 0 17.5 20"><path d="M12.5,17.5v1.56a.94.94,0,0,1-.94.94H.94A.94.94,0,0,1,0,19.06V4.69a.94.94,0,0,1,.94-.94H3.75V15.31A2.19,2.19,0,0,0,5.94,17.5Zm0-13.44V0H5.94A.94.94,0,0,0,5,.94V15.31a.94.94,0,0,0,.94.94H16.56a.94.94,0,0,0,.94-.94V5H13.44A.94.94,0,0,1,12.5,4.06Zm4.73-1.21L14.65.27A1,1,0,0,0,14,0h-.24V3.75H17.5V3.51A1,1,0,0,0,17.23,2.85Z" fill="#07378f"/></svg>
                        </div> */}
                        <div onClick={() => submitPoll()} className="fixed bottom-4 right-4 rounded-full">
                            <CircleButton classList="bg-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="23" y1="7.01" x2="7.54" y2="19.99" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="7.35" y1="19.91" x2="2" y2="12.88" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                            </CircleButton>
                        </div>
                    </>
                }
                <div onClick={() => goBack()} className="fixed bottom-4 left-4 rounded-full">
                    <CircleButton classList="bg-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="4.58" y1="12.5" x2="22.5" y2="12.5" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="7.7" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="17.3" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                    </CircleButton>
                </div>
            </div>
        </div>
    );
}