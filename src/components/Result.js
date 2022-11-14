import { useEffect, useState,  useRef } from "react";
import "../styles/Result.scss";

export default function Result(props) {
    const ref = useRef(null);
    const [scoreCounter, setScoreCounter] = useState(0);

    useEffect(() => {ref.current.focus();})

    useEffect(() => {
        if (props.score === Infinity) {
            setScoreCounter(Infinity);
            return;
        }

        if (props.score === 0) {
            setScoreCounter("Bruh");
            return;
        }

        let interval = setInterval(() => {
            setScoreCounter(prevState => {
                if (prevState === props.score) {
                    clearInterval(interval);
                }
                return prevState + 1;
            });
        }, Math.floor(500 / props.score));

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="result" tabIndex="0" ref={ref} onKeyDown={props.handleModifierKeys} style={(scoreCounter === "Bruh") ? {animation: "none"} : (scoreCounter === Infinity) ? {animation: "showup-infinity 3s ease forwards"} : {}}>
            {scoreCounter}
        </div>
    );
}