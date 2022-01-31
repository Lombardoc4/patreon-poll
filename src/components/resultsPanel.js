
const ResultsPanel = ({optionVotes, optionValues, totalVotes}) => (
    <div id="results" style={{width: '100%'}}>
        {optionVotes.map((o, i) => (

            <div key={optionValues[i]} style={{width: '100%', display: 'flex', alignItems: 'center', padding: '0.25em'}}>
                <p style={{width: '33%', textAlign: 'end', padding: '0 1em 0 0'}}> {optionValues[i]}</p>
                <div style={{width: '66%',  display: 'flex', alignItems: 'center',}}>
                        <div style={{backgroundColor: 'red', width: `${o > 1 ? Math.floor((o / totalVotes) * 100) : 1}%`, borderRadius: '1em'}} >&nbsp;</div>
                        <b style={{padding: '0 0.5em'}} >{o > 1 ? Math.floor((o / totalVotes) * 100) : 0}%</b>
                </div>
            </div>
        ))}
    </div>
)

export default ResultsPanel;