import React from 'react';
import config from "../config.json";

import { useEffect, useState } from 'react';

const useWindowSize = () => {
    const [state, setState] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handler = () => {
            setState({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return state;
};

const calculate = (width, height) => {
    console.log(config)
}

function App() {
  const {width, height} = useWindowSize();
  calculate();

  return <div />
}

export default App;
