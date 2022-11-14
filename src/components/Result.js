import { useEffect, useState,  useRef } from "react";
import "../styles/Result.scss";

export default function Result(props) {
    const ref = useRef(null);
    const [scoreCounter, setScoreCounter] = useState(0);

    useEffect(() => {ref.current.focus();})

    useEffect(() => {

    }, [])

    return (
        <div className="result" tabIndex="0" ref={ref} onKeyDown={props.handleModifierKeys}>
            {props.score}
        </div>
    );
}