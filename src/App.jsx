import { useState, useEffect } from "react";
import { ImCloudUpload } from "react-icons/im";

import "./App.css";

function App() {
  const [img, setImg] = useState("");
  const [allContents, setAllContents] = useState([]);
  const [desc, setDesc] = useState("");

  const imagebase64 = async (file) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
    return data;
  };

  const handleContentUpload = async (e) => {
    const form = e.target;
    const file = form.files[0];
    const image = await imagebase64(file);
    console.log(image);
    setImg(image);
  };
  const handleText = (e) => {
    const form = e.target;
    const message = form.value;
    console.log(message);
    setDesc(message);
  };
  const fetchImage = async () => {
    const res = await fetch("http://localhost:5000");
    const data = await res.json();
    console.log(data.data);
    setAllContents(data.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((img, desc)) {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ img: img, details: desc }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        alert("Image and Text upload Successfully");
        setImg("");
        setDesc("");
        fetchImage();
      }
    }
  };
  useEffect(() => {
    fetchImage();
    console.log(allContents);
  }, []);

  return (
    <div className="container">
      <div className="imgContainer">
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadImage">
            <div className="uploadBox">
              <input
                type="file"
                name=""
                id="uploadImage"
                onChange={handleContentUpload}
              />
              {img ? <img src={img} /> : <ImCloudUpload />}
            </div>
          </label>
          <label htmlFor="description">
            <div className="uploadText">
              <textarea
                name="message"
                type="text"
                placeholder="Your message"
                id="description"
                onChange={handleText}
              />
              {desc ? <p>{desc}</p> : <></>}
            </div>
          </label>
          <div className="btn">
            {/* <button onClick={handleSubmit}>Upload</button> */}
            <input type="submit" value="Post" className="submit" />
          </div>
        </form>
      </div>
      <div className="allContent">
        {allContents.map((el, i) => {
          return (
            <div className="content-style" key={i}>
              <img src={el.image} width={400} height={300} />;
              <p>{el.details}</p>;
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
