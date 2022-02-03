


const PollButtons = ({submitted, setView, view, handleSubmit}) => {
    return (
    <div className="pollButtonGroup">
    { submitted &&
        <button
        className="button"
        onClick={() => {setView(view === 'options' ? 'results' : 'options')}}
        style={{width: view === 'results' ? '100%' : '50%', margin: view === 'results' ? '1em 0 0' : '1em 1em 0 0'}}>

            View {view === 'options' ? 'Results' : 'Survey'}

        </button>
    }
    { view === 'options' &&
        <button
        className="button"
        onClick={() => {handleSubmit()}}
        style={{width: submitted ? '50%' : '100%', margin: submitted ? '1em 0 0 1em' : '1em 0 0', }}>

            {submitted ? 'Resubmit' : 'Vote'}

        </button>
    }
    </div>
)}

export default PollButtons;