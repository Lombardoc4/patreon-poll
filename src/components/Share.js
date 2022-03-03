import Modal from "react-modal"
import { useRef, useState } from "react";
import Button from "./Button";

const customStyles = {
    overlay: {
        display: 'flex'
    },
};

Modal.setAppElement('#root');


const ShareModal = ({openState, data: {id, title}}) => {
    const [activeClick, setActiveClick] = useState(false);
    const [modalData, setOpen] = openState;
    const isOpen = Boolean(modalData)
    const shareRef = useRef(null);
    const shareURL = process.env.REACT_APP_MAIN_URL + '/poll/' + id;

    const copyToClipboard = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareURL)
        }
        const isIos = navigator.userAgent.match(/ipad|iphone/i);
        const { current } = shareRef;

        // select text
        if (isIos) {
            const range = document.createRange();
            range.selectNodeContents(current);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            current.setSelectionRange(0, 999999);
        } else {
            current.select();
        }

        // copy selection
        document.execCommand('copy');

        // cleanup
        current.focus();
    }


    return (
        <Modal
            isOpen={isOpen}
            style={customStyles}
            className="panel m-auto w-4/5 shadow-lg md:w-1/4 p-6 outline-none"
            contentLabel="Example Modal"
            onRequestClose={() => {setOpen(!isOpen)}}
            shouldCloseOnOverlayClick={true}
        >
            <h1 className="text-4xl font-grotesk mb-2">Share Poll</h1>
            <h2 className="text-2xl mb-4 font-bold">{title}</h2>
            <div className="flex bg-mute rounded border border-black overflow-hidden mb-4">

                <input ref={shareRef} className="bg-transparent outline-none py-2 pl-2 w-4/5 select-all" type="text" readOnly={true} value={shareURL}/>
                <div onClick={() => {copyToClipboard(); setActiveClick(true)}} className={"hover:shadow-inner hover:shadow-slate-400 hover:pt-1 flex items-center justify-center ml-auto px-3 border-l border-black rounded " + (activeClick ? 'bg-success' : 'bg-secondary')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="20" viewBox="0 0 17.5 20"><path d="M12.5,17.5v1.56a.94.94,0,0,1-.94.94H.94A.94.94,0,0,1,0,19.06V4.69a.94.94,0,0,1,.94-.94H3.75V15.31A2.19,2.19,0,0,0,5.94,17.5Zm0-13.44V0H5.94A.94.94,0,0,0,5,.94V15.31a.94.94,0,0,0,.94.94H16.56a.94.94,0,0,0,.94-.94V5H13.44A.94.94,0,0,1,12.5,4.06Zm4.73-1.21L14.65.27A1,1,0,0,0,14,0h-.24V3.75H17.5V3.51A1,1,0,0,0,17.23,2.85Z" fill="#07378f"/></svg>
                </div>
            </div>
            <Button onClick={() => {window.open(shareURL, "_blank");}} classList="bg-success w-full text-2xl leading-none" type='submit' label="Open in new tab"/>

      </Modal>
    )
}

export default ShareModal