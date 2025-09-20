import React from "react";
import { PuffLoader } from "react-spinners";

export default function SpinnerLoader() {
  return (
    <>
      <div className="spinner">
        <PuffLoader color="var(--color)" size={60} speedMultiplier={1} />
      </div>
    </>
  );
}
