import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { CircleButton } from "./Button";


export const Results = ({pollData, toggleResults}) => {
    // const location = useLocation();
    // const navigate = useNavigate();
    const [data, setData] = useState(pollData)
    const [options, setOptions] = useState({});
    // const admin = location.state.admin;


    useEffect(() => {

        const optionSorted = Object.entries(data.options)
        .sort(([,a],[,b]) => b-a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        setOptions({
            values: Object.keys(optionSorted),
            votes: Object.values(optionSorted),
            totalVotes: Object.values(optionSorted).reduce((sum, v) => sum + v, 0)
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!options.votes){
        console.log('no votes');
        return (<h1>Loading</h1>);
    }
    console.log(options.votes)
        return (
            <>
            <main id="pollMain">
                <div className="w-full px-4 py-6 rounded-lg" style={{backgroundColor: 'rgba(255,255,255,0.9)'}}>
                    <div className="border-b border-black w-full">
                        <h1 className="text-2xl font-grotesk font-bold w-3/4">{data?.title}</h1>
                    </div>

                        {options.votes.map((o, i) => (

                            <div className="py-3" key={options.values[i]}>
                                <p className="text-2xl pb-1"> {options.values[i]}</p>
                                <div className="flex items-center">
                                        <div
                                        style={{ width: `${o > 1 ? Math.floor((o / options.totalVotes) * 100) : 1}%`}}
                                        className="bg-secondary border border-black rounded shadow-dark"
                                            >&nbsp;</div>
                                        <span className="pl-3" ><span className="font-bold">{o > 1 ? Math.floor((o / options.totalVotes) * 100) : 1}%</span> ({options.votes[i]}&nbsp;Votes)</span>
                                </div>
                            </div>
                        ))}
                        { toggleResults && <div className="fixed bottom-4 right-4 text-center " style={{textShadow: '0 5px 5px rgba(0,0,0,0.25)' }}>
                            <p className="text-2xl font-bold leading-3">{options.totalVotes}</p>
                            <p className="pb-2">
                                Votes
                            </p>
                            <CircleButton onClick={() => {toggleResults(false)}} padding={true} classList="bg-danger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="4.58" y1="12.5" x2="22.5" y2="12.5" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="7.7" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="17.3" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
                            </CircleButton>
                        </div>}
                </div>
            </main>
            </>
        )
}