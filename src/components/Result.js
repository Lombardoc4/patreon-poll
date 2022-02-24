import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { CircleButton } from "./Button";


export const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(false)
    const [options, setOptions] = useState({})

    useEffect(() => {
        let effData;
        if (location.state?.poll) {
            effData = location.state.poll
        } else {
            effData = {
                "_id": {
                  "$oid": "61f302c763d8c2ab4c6ceec6"
                },
                "title": "First Survey",

                "end_date": "Wednesday, Feb 16, 2022",
                "start_date": "Friday, Feb 11, 2022",
                "options": {
                  "Track Tip1": 5,
                  "Dustis Desires": 19
                }
            }
        }
        setData(effData)

        const optionSorted = Object.entries(effData.options)
        .sort(([,a],[,b]) => b-a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        setOptions({
            values: Object.keys(optionSorted),
            votes: Object.values(optionSorted),
            totalVotes: Object.values(optionSorted).reduce((sum, v) => sum + v, 0)
        })

    }, [data, location])


        return (
            <>
            {
            !data ? <h1>Loading</h1>
            :
            <>
                <div className="border-b border-black shadow-dark w-full">
                    <div className="container">
                        <h1 className="text-2xl font-grotesk font-bold w-3/4">{data?.title}</h1>
                    </div>
                </div>
                <div className={location.state?.admin ? "container mb-20" : 'container'}>
                    {options.votes.map((o, i) => (

                        <div className="py-3" key={options.values[i]}>
                            <p className="text-2xl pb-1"> {options.values[i]}</p>
                            <div className="flex items-center">
                                    <div
                                    style={{ width: `${o > 1 ? Math.floor((o / options.totalVotes) * 100) : 1}%`}}
                                    className="bg-secondary border border-black rounded shadow-dark"
                                        >&nbsp;</div>
                                    <span className="pl-3 font-bold" >{o > 1 ? Math.floor((o / options.totalVotes) * 100) : 1}% - {options.votes[i]} Votes</span>
                            </div>
                        </div>
                    ))}
                    { location.state?.admin && <div className="fixed bottom-4 right-4 text-center" style={{textShadow: '0 5px 5px rgba(0,0,0,0.25)' }}>
                        <p className="text-2xl font-bold leading-3">{options.totalVotes}</p>
                        <p className="pb-2">
                            Votes
                        </p>
                        <CircleButton onClick={() => {navigate(-1)}} padding={true} classList="bg-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="4.58" y1="12.5" x2="22.5" y2="12.5" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="7.7" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="17.3" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                        </CircleButton>
                    </div>}
                </div>
                </>
            }
        </>
        )
}