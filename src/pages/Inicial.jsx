import React from "react";
import Grid from "../components/Grid";
import "../styles/inicial.css";
import Footer from "../components/Footer";
import GaleriaYoutube from "../components/GaleriaYoutube";
export default function Inicial() {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center ">
        <div className="bg-danger p-4">section de buscar</div>

        <div className="d-flex flex-row justify-content-center align-items-center w-100 mt-3 flex-wrap bg-primary">
          <div className="bg-secondary d-flex flex-row flex-md-column flex-wrap justify-content-center gap-2 ">
            <button className="btn btn-dark">BUTTON</button>
            <button className="btn btn-dark">BUTTON</button>
            <button className="btn btn-dark">BUTTON</button>
            <button className="btn btn-dark">BUTTON</button>
          </div>

          <div className="bg-primary text-white  flex-grow-1">
            {" "}
            <lite-youtube
              videoid="pL6va9fADfQ"
              className="styleIt"
            ></lite-youtube>
          </div>

          <div className="bg-secondary d-flex flex-row flex-md-column flex-wrap justify-content-center gap-2 ">
            <button className="btn btn-dark">BUTTON</button>
            <button className="btn btn-dark">BUTTON</button>
            <button className="btn btn-dark">BUTTON</button>
            <button className="btn btn-dark">BUTTON</button>
          </div>
        </div>
      </div>

      <div className="d-flex flex-row gap-2 bg-secondary justify-content-center align-items-center p-2 mt-3 ">
        <div className="text-center bg-dark text-white p-2">Yo soy un disco</div>
        <div className="text-center bg-dark text-white p-2">Yo soy un disco</div>
        <div className="text-center bg-dark text-white p-2">Yo soy un disco</div>
        <div className="text-center bg-dark text-white p-2">Yo soy un disco</div>
      </div>

      <GaleriaYoutube />
    </>
  );
}
