import React from "react";
import { useForm } from "react-hook-form";
import "../../../Css/Navbar.module.css";
import classes from "../../../Css/form.module.css";
import Navbar from "./Navbar";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { useContext } from "react";
import EthContext from "./../../../contexts/EthContext/EthContext";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { state, dispatch } = useContext(EthContext);
  console.log("state in Form1 is ", state);
  const handleFormSubmit = async (data) => {
    console.log("data - ", data);
    let res = null;
    if (data.patientType === "donor") {
      setDoc(doc(db, "Donor", state.uid), {
        ...data,
        ethID: state.accounts[0],
        email: state.email,
        photoURL: state.photoURL,
        Name: state.displayName,
        isDonor: true,
        isPresent: true,
        isExpired: false,
        //TODO  TimeLeft QUERY !
      })
        .then((result) => {
          console.log("result", result);
        })
        .catch((error) => {
          console.log("error is ", error);
        });
    } else {
      setDoc(doc(db, "Patients", state.uid), {
        ...data,
        ethID: state.accounts[0],
        email: state.email,
        photoURL: state.photoURL,
        Name: state.displayName,
        isDonor: false,
      })
        .then((result) => {
          console.log("result", result);
        })
        .catch((error) => {
          console.log("error is ", error);
        });
    }
    console.log("res data - ", res);
  };

  return (
    <>
      <Navbar />

      <div className={`${classes.container} text-red-600 `}>
        <form
          className={classes.form}
          onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        >
          <input
            className={classes.box}
            type="text"
            placeholder="First Name"
            {...register("firstName", { required: true })}
          />
          {errors.firstName && <p>First Name is required.</p>}
          <input
            className={classes.box}
            placeholder="Last Name"
            {...register("lastName")}
          />
          <input
            className={classes.box}
            placeholder="Amount"
            type="number"
            {...register("Amount", { required: true })}
          />
          {errors.Amount && <p>Please enter amount of ether sent.</p>}
          <label htmlFor="patientType" style={{ display: "flex" }}>
            <input
              type="radio"
              placeholder="Donor"
              value="donor"
              id="patientType"
              {...register("patientType", { required: true })}
            />
            <h3>Donor</h3>
          </label>
          <label htmlFor="patientType" style={{ display: "flex" }}>
            <input
              type="radio"
              placeholder="Patient"
              value="patient"
              id="patientType"
              {...register("patientType", { required: true })}
            />
            <h3>Patient</h3>
          </label>
          {errors.patientType && <p>Please enter Patient-Type.</p>}
          <input className={classes.btn} type="submit" />
        </form>
      </div>
    </>
  );
}

export default Form;
