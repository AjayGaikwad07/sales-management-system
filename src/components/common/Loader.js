import React from "react";
import { Spinner } from "react-bootstrap";

const Loader =() =>{
return(
    <div className="text-center p-5">
        <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    </div>
);
};
export default Loader;