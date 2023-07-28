import React, { useState } from 'react';
import context from './context.js';
import moment from 'moment';
// const host = 'http://localhost:5000'
const host = process.env.REACT_APP_BACKEND_HOST

const State = (props) => {
  const [links, setlinks] = useState([])
const [loading, setloading] = useState(false)
  const addlink = async (data) => {
    setloading(true)
    const response = await fetch(`${host}/addlink`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const json = await response.json();
    if (json.success) {
      window.location.reload();
    } else {
      alert(json.message);
    }
    setloading(false)
  }


  const getlinks = async () => {
    setloading(true)
    const response = await fetch(`${host}/links`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      }
    })
    const json = await response.json();
    if (json.success) {
      setlinks(json.data)
    } else {
      alert(json.message)
    }
    setloading(false)
  }



  return (
    <context.Provider value={{ addlink, getlinks, links,loading,setloading }}>
      {props.children}
    </context.Provider>
  )
}

export default State