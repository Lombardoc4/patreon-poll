
const ResultsPanel = ({optionVotes, optionValues, totalVotes}) => (
    <div id="results" style={{width: '100%'}}>
        {optionVotes.map((o, i) => (

            <div key={optionValues[i]} style={{width: '100%', display: 'flex', alignItems: 'center', padding: '0.25em'}}>
                <p style={{width: '25%', fontSize: '14px', textAlign: 'end', padding: '0 1em'}}> {optionValues[i]}</p>
                <div style={{width: '75%',  display: 'flex', alignItems: 'center',}}>
                        <div style={{backgroundColor: 'red', width: `${Math.floor((o / totalVotes) * 100)}%`, borderRadius: '1em'}} >&nbsp;</div>
                        <b style={{padding: '0 0.5em'}} >{Math.floor((o / totalVotes) * 100)}%</b>
                </div>
            </div>
        ))}
    </div>
)

export default ResultsPanel;