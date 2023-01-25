import { useEffect, useState,  useRef } from "react";
import "../styles/Result.scss";
import axios from "axios";

export default function Result(props) {
    const ref = useRef(null);
    const [resultSent, setResultSent] = useState(false);
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

        // let interval = setInterval(() => {
        //     setScoreCounter(prevState => {
        //         if (prevState === props.score) {
        //             clearInterval(interval);
        //         }
        //         return prevState + 1;
        //     });
        // }, Math.floor(200 / props.score));

        setScoreCounter(props.score);

        // return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (resultSent === true) return;
        axios.post("http://localhost:5000/api/results", {
            "id": 1,
            "user": "anonymous",
            "score": props.score
        }).then(res => {
            console.log(res);
        })

        setResultSent(false);
        // eslint-disable-next-line
    }, [resultSent])

    return (
        <div className="result" tabIndex="0" ref={ref} onKeyDown={props.handleModifierKeys} style={(scoreCounter === "Bruh") ? {animation: "none"} : (scoreCounter === Infinity) ? {animation: "showup-infinity 3s ease forwards"} : {}}>
            {scoreCounter}
        </div>
    );
}