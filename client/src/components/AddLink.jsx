import React, { useContext, useState } from 'react';
import context from '../context/context';

const AddLink = () => {
  const a = useContext(context);
  const addlink = a.addlink;
  const loading = a.loading;
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addlink({ link });
  };

  return (
    <div className="container mt-4">
      
          <div style={{ margin: "auto", maxWidth: "50rem" }} className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Add a Link</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="linkInput">Link:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="linkInput"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </div>
                <button style={{ float: "right" }} disabled={loading} type="submit" className="btn btn-primary mt-2">
                  {loading ? "Loading..." : "Add"}
                </button>
              </form>
            </div>
          </div>
      

    </div>
  );
};

export default AddLink;
