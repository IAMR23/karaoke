import React from "react";

const Grid = () => {
  const cells = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <div className="container p-2">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {cells.map((num) => (
          <div key={num} className="col">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center  bg-primary">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  aria-label="Cerrar"
                >
                  &times;
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  aria-label="Favoritos"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-star"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l3.39-1.788 3.389 1.788c.386.198.824-.149.746-.592l-.646-3.766 2.737-2.67c.329-.321.158-.888-.283-.95l-3.77-.547-1.69-3.43c-.197-.4-.73-.4-.927 0L6.247 6.927l-3.77.548c-.441.062-.612.63-.282.95l2.737 2.669-.646 3.767z" />
                  </svg>
                </button>
              </div>
              <div className="card-body p-0">
                <div className="videoGallery">
                  <lite-youtube
                    videoid="pL6va9fADfQ"
                    style={{ width: "100%", aspectRatio: "16/9" }}
                  ></lite-youtube>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
