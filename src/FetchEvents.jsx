import React, { useState, useRef } from 'react';

const FetchEvents = () => {
  const [events, setEvents] = useState({"response":"", "done":""});
  const [dataInput, setDataInput] = useState("");
  const [dataHist, setDataHist] = useState("");
  const [loading, setLoading] = useState(false);
 

 
  const fetchEvents = async () => {
    setLoading(true);
    const url = 'https://13f5-154-251-18-57.ngrok-free.app/test2';  
    try {
      const data = {"input":dataInput, "hist":dataHist}
      const response = await fetch(url, { method: 'POST'  ,  headers: {'Content-Type':'application/json'},body: JSON.stringify(data)});
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk)
        const r = chunk.split("}")
        setEvents(JSON.parse(r[r.length - 2] + "}"));
        console.log("parse")
       
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
     <div className="right">
      <div className="">{events["response"]}</div>
 
      <div className="done">{ events["done"].toString()}</div>
      </div>
    
     </div>
  );
};

export default FetchEvents;
