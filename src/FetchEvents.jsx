import React, { useState, useRef } from 'react';
import axios from "axios";

const FetchEvents = () => {
  const [events, setEvents] = useState([{"a":""}]);
  const [dataInput, setDataInput] = useState("");
  const [dataHist, setDataHist] = useState("");
  const [loading, setLoading] = useState(false);
  const eventsRef = useRef([]);

  console.log(dataInput)
  const fetchEvents = async () => {
    setLoading(true);
    const url = 'http://127.0.0.1:8000/stream'; // Replace with your actual URL

    try {
      const data = {"input":dataInput, "hist":dataHist}
      const response = await fetch(url, { method: 'POST'  ,  headers: {'Content-Type':'application/json'},body: JSON.stringify(data)});
      // const response = await axios.post(url, {"input":dataInput});

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        lines.forEach(line => {
          const event = JSON.parse(line);
          eventsRef.current = [...eventsRef.current, event];
          setEvents(eventsRef.current);
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
    <div className='left'>
      <div className="input_div">
      <div className="">hist</div>
      <input onChange={(e) => setDataHist(e.target.value)}></input>
      <div className="">qurey</div>
      
      <input onChange={(e) => setDataInput(e.target.value)}></input>
      </div>
      <button onClick={fetchEvents} disabled={loading}>
        {loading ? 'Loading...' : 'send'}
      </button>
     
 
    </div>
     <div className="right">{events[events.length -1]["a"]}</div>
     </div>
  );
};

export default FetchEvents;
