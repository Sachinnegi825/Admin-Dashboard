import React from "react";
import CargoDetails from "./CargoDetails";
import ContainerDetails from "./ContainerDetails";
import VehicleDetails from "./VehiclesDetails";

const Message = ({ items,randomNum, value, length }) => {

  

   const {bltype,cargocode,destinationplacename,destinationplacecode,exportername,shippingagentname,shippingagentcode,loadingportname,loadingportcode}=items;


  const showData = (index) => {
    for (let i = 1; i <= length; i++) {
      const data = document.getElementById(`inside-message${i}`);
      const computedStyle = window.getComputedStyle(data);
      const isHidden = computedStyle.getPropertyValue("display") === "none";
      data.style.display = i === index && isHidden ? "block" : "none";
   
    }
  };

  return (
    <div className="message-card">
      <h1 onClick={() => showData(value + 1)}>
        BolList {value + 1}{" "}
      </h1>
      <div className="inside-message" id={`inside-message${value + 1}`}>
        <p>BlType : {bltype}</p>
        <p>CargoCode : {cargocode}</p>
        <p>
          Destination : {destinationplacename} ,{" "}
          {destinationplacecode}
        </p>
        <p>Exporter Name : {exportername}</p>
        <p>
          Shipping Agent : {shippingagentname} , {shippingagentcode}
        </p>
        <p>
          Loading Port : {loadingportname} , {loadingportcode}
        </p>

        <div className="boldetails">
          <div>
          {
        
            items.bolcargos.map((item,i)=>{
            
                return <CargoDetails item={item} key={i} val={`${randomNum}`+`${Math.floor(Math.random()*6000+1)}`}  indexval={i} length={items.bolcargos.length}/>
                   
            })
          }
          </div>
          <div>
          {
            items.bolcntrs.map((item,i)=>{
                return <ContainerDetails item={item} key={i} val={`${randomNum}`+`${Math.floor(Math.random()*6000+1)}`} indexval={i} length={items.bolcntrs.length}/>
                   
            })
          }
          </div>

          <div>
          { items.bolvehicles?
            items.bolvehicles.map((item,i)=>{
                return <VehicleDetails item={item} key={i} val={`${randomNum}`+`${Math.floor(Math.random()*6000+1)}`} indexval={i} length={items.bolvehicles.length}/>
                   
            }):<h1>No data for bolvehicle is found</h1>
          }
          </div>
        


  
        </div>
      </div>
    </div>
  );
};

export default Message;
