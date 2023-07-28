import React, { useContext, useEffect, useState } from 'react'
import context from '../context/context'
import Loading from './Loading';
import Chart from "./Chart"
const Home = () => {
    const a = useContext(context);
    const getlinks = a.getlinks;
    const loading = a.loading
    const allinks = a.links
    const [currentlink, setcurrentlink] = useState(null)
    useEffect(() => {
        getlinks()
    }, [])

    const linkchangehandler = (e) => {
        const selectedlink = e.target.value;
        const linkObject = allinks.find((link) => link.link === selectedlink);
        setcurrentlink(linkObject);
    }
    return (
        <div className="container mt-4">
            {
                loading ? <Loading /> :
                    <>
                        <div style={{ margin: "auto", maxWidth: "50rem" }} className="card">
                            <div className="card-body">
                                <h3 className="card-title text-center">Select A Link</h3>
                                <select onChange={linkchangehandler} className="form-select" aria-label="Default select example">
                                    <option defaultValue={null}>Select from this menu</option>
                                    {
                                        allinks.map((val, index) => {
                                            return <option key={index} value={val.link}>{val.link}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="chart">
                            {
                                currentlink ? (
                                    <>
                                        <h3 className="my-3">{currentlink.name}</h3>
                                        <Chart priceData={currentlink.data} type={'Price'} />
                                        <Chart priceData={currentlink.data} type={'Reviews'} />
                                        <Chart priceData={currentlink.data} type={'Ratings'} />
                                    </>
                                ) : ""
                            }
                        </div>

                    </>
            }
        </div>
    )
}

export default Home