import React from "react";
import { Link } from "react-router-dom"
import Button from "./Button"

export const SurveyListItem = ({toggleSub, poll}) => {

    return (
        <div className="pb-8">
            {/* Votes */}
            <p className="text-sm">{poll?.preheader}</p>

            {/* Title */}

                <div className="relative text-4xl md:cursor-pointer">
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-auto">
                        <div onClick={() => toggleSub({...poll, section: 'add'})}  className="absolute h-5 w-5">
                            <svg className="pointer-events-auto" xmlns="http://www.w3.org/2000/svg" width="15.14" height="19.8" viewBox="0 0 15.14 19.8"><line x1="2" y1="2" x2="13.14" y2="9.8" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2" y1="17.8" x2="13.14" y2="10" fill="none" stroke="#000" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                        </div>
                    </div>
                    <h2 className=" w-full pr-10 truncate">{poll.title}</h2>
                </div>

            {/* Buttons */}
            <div className="flex justify-around pt-4">
                {/* Share */}
                <Button onClick={() => toggleSub({section: 'share', id: poll._id.$oid, title: poll.title})} classList='w-full basis-1/4 bg-primary text-white rounded-lg shadow-dark font-bold' >
                    <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="32" height="25" viewBox="0 0 32 25"><line x1="4.5" y1="12.5" x2="23" y2="21" fill="none" stroke="#fff" strokeMiterlimit="10" strokeWidth="2"/><line x1="3.9" y1="12.62" x2="23" y2="5" fill="none" stroke="#fff" strokeMiterlimit="10" strokeWidth="2"/><circle cx="4.5" cy="12.5" r="3.5" fill="#fff" stroke="#fff" strokeMiterlimit="10" strokeWidth="2"/><circle cx="23.5" cy="20.5" r="3.5" fill="#fff" stroke="#fff" strokeMiterlimit="10" strokeWidth="2"/><circle cx="23.5" cy="4.5" r="3.5" fill="#fff" stroke="#fff" strokeMiterlimit="10" strokeWidth="2"/></svg>
                </Button>

                {/* Results */}
                <Button onClick={() => toggleSub({...poll, section: 'results'})} classList='w-full bg-primary basis-1/4 text-white rounded-lg shadow-dark font-bold'>
                    <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="35.33" height="27" viewBox="0 0 35.33 27"><line x1="1" y1="1" x2="1" y2="26" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/><line x1="1" y1="26" x2="34.33" y2="26" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2"/><line x1="5.17" y1="20.17" x2="16.83" y2="10.17" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="16.92" y1="10.18" x2="21" y2="15.17" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="21.3" y1="14.91" x2="31.37" y2="6.82" fill="#fff" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                </Button>

                {/* More */}
                <Button onClick={() => toggleSub({...poll, section: 'add'})} classList='w-full bg-primary basis-1/4 text-white rounded-lg shadow-dark font-bold'>
                    <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="41" height="10.09" viewBox="0 0 41 10.09"><circle cx="5.05" cy="5.05" r="4.55" fill="#fff" stroke="#fff" strokeMiterlimit="10"/><circle cx="35.95" cy="5.05" r="4.55" fill="#fff" stroke="#fff" strokeMiterlimit="10"/><circle cx="20.5" cy="5.05" r="4.55" fill="#fff" stroke="#fff" strokeMiterlimit="10"/></svg>
                </Button>
            </div>
        </div>
    )
}

const SurveyList = ({ toggleSub, polls, filter }) => {
    const preheaders = {
        'Completed': (options) => (
            <React.Fragment key='completed'>
                <span className="font-bold">{countVotes(options)}</span>&nbsp;
                <span className="font-grotesk">Votes - <span className="font-bold text-success">Completed</span></span>
            </React.Fragment>
        ),
        'Ongoing': (options) => (
            <React.Fragment key='completed'>
                <span className="font-bold">{countVotes(options)}</span>&nbsp;
                <span className="font-grotesk">Votes</span>
            </React.Fragment>
        ),
        'Upcoming': (start) => (
            <React.Fragment key='upcoming'>
                <span className="font-grotesk">Starts:</span> <span className="font-bold text-primary ">{start}</span>
            </React.Fragment>
        )

    };
    const uxPolls = [];
    const timeNow = Date.now();

    const countVotes = (options) => {
        return Object.values(options).reduce((sum, v) => sum + v, 0);
    }

    polls.map(poll => {
        if (timeNow > new Date(poll.end_date).getTime()){
            // total votes + completed
            poll.preheader = preheaders['Completed'](poll.options);
            if (!filter || filter === 'Completed') {
                return uxPolls.push(poll);
            }
        }
        else if ( timeNow > new Date(poll.start_date).getTime()){
        //     // total votes
            poll.preheader = preheaders['Ongoing'](poll.options);
            if (!filter || filter === 'Ongoing') {
                return uxPolls.push(poll);
            }
        } else {
        //     // starts on
            poll.preheader = preheaders['Upcoming'](poll.start_date);
            if (!filter || filter === 'Upcoming') {
                return uxPolls.push(poll);
            }
        }
        return false;
    })

    return (
        <>
            {uxPolls.map(p => <SurveyListItem key={p.title} poll={p} toggleSub={toggleSub} />)}
        </>
    )
}

export default SurveyList;