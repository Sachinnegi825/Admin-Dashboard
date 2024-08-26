import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Apis from "./../Services/ApiServices/Apis";
import { addItems } from "./store/ItemsSlice";
import moment from "moment/moment";
import Loading from "./reusable/Loading";
import { FaCode, FaRegEye } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router";
import { Modal } from "react-bootstrap";
import Footer from "./Footer";
import { useApiUrl } from "./Context/ApiUrlContext";

const Messages = () => {
  const { apiUrl, setApiUrl } = useApiUrl();
  const date = new Date();
  const maindate = moment(date, "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
    "YYYY-MM-DDTHH:mm"
  );

  const get8HoursBefore = () => {
    const currentTime = moment();
    const eightHoursBefore = currentTime.subtract(8, "hours");
    const formattedTime = eightHoursBefore.format("YYYY-MM-DDTHH:mm");
    return formattedTime;
  };

  const [statusvalue, setStatus] = useState(0);
  const [startdate, setstartDate] = useState(get8HoursBefore());
  const [enddate, setendDate] = useState(maindate);
  const hidden = useSelector((state) => state.hiddenstate.hidden);
  const [filteredItems, setFilteredItems] = useState(null);
  const [filteredItems2, setFilteredItems2] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visitcode, setVisitcode] = useState("");
  const [cargocode, setCargocode] = useState("");
  const [bolno, setbolno] = useState("");
  const [carriername, setcarriername] = useState("");
  const [items, setitems] = useState(null);
  const [modaldata, setmodaldata] = useState([]);
  const [vvcode, setVvcode] = useState([]);
  const [ccode, setCcode] = useState([]);
  const items2 = useSelector((state) => state.Items.items);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "DP World DAR | Dashboard";
  }, []);

  const formatDate2 = (dateString) => {
    const parsedTime = moment(dateString);
    const formattedTime = parsedTime.format("YYYY-MM-DD HH:mm");
    return formattedTime;
  };

  useEffect(() => {
    const start = formatDate2(startdate);
    const end = formatDate2(enddate);

    fetchMessage(start, end, 0);
  }, [startdate, enddate, statusvalue]);

  // -----------------------------------------Fetching data from getMessageList Api-----------------------------------------------------//

  const fetchMessage = async (start, end, status) => {
    try {
      setLoading(true);
      const apiResponse = await Apis.GetMessageList(apiUrl, start, end, status);

      if (Number(status) !== 6) {
        dispatch(addItems(apiResponse?.data));
      }

      if (Number(statusvalue) === 0) {
        setitems(apiResponse?.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Array.isArray(items2) && items2?.length > 0) {
        if (Number(statusvalue) === 7) {
          const messages =
            Array.isArray(items2) &&
            items2?.filter((itm) => {
              return itm?.status_code !== 6;
            });
          setFilteredItems([...messages].sort((a, b) => a.id - b.id));
          setFilteredItems2([...messages].sort((a, b) => a.id - b.id));
        }

        if (Number(statusvalue) === 6) {
          const messages =
            Array.isArray(items2) &&
            items2?.filter((itm) => {
              return itm?.status_code === 6;
            });
          setFilteredItems([...messages].sort((a, b) => a.id - b.id));
          setFilteredItems2([...messages].sort((a, b) => a.id - b.id));
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [statusvalue, items]);

  useEffect(() => {
    if (Array.isArray(items2)) {
      const vesselVisitCodes = items2.map(
        (itm) => itm?.manifest?.vessel?.vesselVisitCode
      );
      setVvcode([...new Set(vesselVisitCodes)]);
    }
  }, [items2]);

  useEffect(() => {
    if (Array.isArray(items2)) {
      const cargoCodes = items2.map(
        (itm) => itm?.manifest?.bolList[0]?.cargoCode
      );
      setCcode([...new Set(cargoCodes)]);
    }
  }, [items2]);

  //------------------------------------------------------------Reset Data---------------------------------------------------------//

  const handleResetData = () => {
    setCargocode("");
    setVisitcode("");
    setcarriername("");
    setStatus(0);
    if (filteredItems2 && filteredItems2.length > 0 && statusvalue != 0)
      setFilteredItems([...filteredItems2].sort((a, b) => a.id - b.id));
    else setFilteredItems([...items2].sort((a, b) => a.id - b.id));
  };

  const handleFiltermessage = () => {
    console.log("filter", filteredItems2);
    let filteredData = filteredItems2 ? filteredItems2 : items;

    if (visitcode !== "") {
      filteredData = filteredData.filter((itm) =>
        itm.manifest.vessel.vesselVisitCode
          .toLowerCase()
          .includes(visitcode.toLowerCase())
      );
    }

    if (carriername !== "") {
      filteredData = filteredData.filter((itm) =>
        itm.manifest.vessel.carrierName
          .toLowerCase()
          .includes(carriername.toLowerCase())
      );
    }

    if (bolno !== "") {
      filteredData = filteredData.filter((itm) =>
        itm.manifest.bolList.some((itm1) =>
          itm1.bolNbr.toLowerCase().includes(bolno.toLowerCase())
        )
      );
    }

    if (cargocode !== "") {
      filteredData = filteredData.filter((itm) =>
        itm.manifest.bolList.some((itm1) =>
          itm1.cargoCode.toLowerCase().includes(cargocode.toLowerCase())
        )
      );
    }

    console.log("FILTERDA", filteredData);
    setFilteredItems([...filteredData].sort((a, b) => a.id - b.id));
  };

  useEffect(() => {
    if (Array.isArray(items)) {
      setFilteredItems([...items].sort((a, b) => a.id - b.id));
      setFilteredItems([...items].sort((a, b) => a.id - b.id));
    } else {
      setFilteredItems([]);
    }
  }, [items]);

  const handleVisitChange = (e) => {
    setVisitcode(e.target.value);
  };

  const handleCargoChange = (e) => {
    setCargocode(e.target.value);
  };

  const handleBolChange = (e) => {
    setbolno(e.target.value);
  };
  const handleCarrierChange = (e) => {
    setcarriername(e.target.value);
  };

  const handleNavigation = (data) => {
    navigate("/messageDetails", { state: { messageData: data } });
  };

  const updateModal = (data) => {
    const modaldata1 = filteredItems?.filter((itm) => {
      return itm?.id === data;
    });

    setmodaldata(modaldata1);
    setIsModalOpen(!isModalOpen);
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const jsonString = JSON.stringify(modaldata, null, 2);
  const [formattedJson, setFormattedJson] = useState("");

  useEffect(() => {
    const htmlFormattedJson = jsonString.replace(/\n/g, "<br>");
    setFormattedJson(htmlFormattedJson);
  }, [jsonString]);

  const handleReprocess = async (id, status_code) => {
    try {
      setLoading(true);
      const data = await Apis.ProcessMessage(apiUrl, id, status_code);

      if (data?.success === true) {
        alert("Data reprocess successfully");
      } else {
        alert("Reprocess failed");
      }
    } catch (error) {
      setLoading(false);
      alert("Reprocess failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="wrapper">
        <Header />

        <Sidebar />

        <div className="content-wrapper" style={{ marginLeft: hidden && "0" }}>
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-12">
                  <h1
                    className="m-0"
                    style={{ color: "#1B106D", fontWeight: "bold" }}
                  >
                    Messages
                  </h1>
                  <ol className="breadcrumb ">
                    <li className="breadcrumb-item">
                      <a href="/dashboard">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Messages</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <section className="content">
            <div className="container-fluid">
              <div className="card">
                <div className="card-body">
                  <h5>Search Results </h5>
                  <div className="row mt-3">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>From Date</label>
                        <div
                          className="input-group date"
                          id="reservationdate"
                          data-target-input="nearest"
                        >
                          <input
                            type="datetime-local"
                            className="form-control form-control-sm datetimepicker-input"
                            id="from-date"
                            value={startdate}
                            min="2023-01-01"
                            max={moment(
                              date,
                              "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                            ).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => setstartDate(e.target.value)}
                            data-target="#reservationdate"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>To Date</label>
                        <div
                          className="input-group date"
                          id="reservationdate"
                          data-target-input="nearest"
                        >
                          <input
                            type="datetime-local"
                            className="form-control form-control-sm datetimepicker-input"
                            id="from-date"
                            min="2023-01-01"
                            max={moment(
                              date,
                              "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                            ).format("YYYY-MM-DDTHH:mm")}
                            value={enddate}
                            onChange={(e) => setendDate(e.target.value)}
                            data-target="#reservationdate"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          name="SelectStatus"
                          className="form-control form-control-sm"
                          id="select1"
                          value={statusvalue}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value={0}>Select All</option>
                          <option value={6}>Transfer Successful</option>
                          <option value={7}>Transfer Failed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-3">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Vessel Visit Code</label>

                        <select
                          name="SelectStatus"
                          className="form-control form-control-sm"
                          id="select1"
                          value={visitcode}
                          onChange={(e) => handleVisitChange(e)}
                        >
                          <option value="">Select Vessel Visit code</option>
                          {vvcode &&
                            vvcode?.length > 0 &&
                            vvcode?.map((itm, i) => {
                              return (
                                <option key={i} value={itm}>
                                  {itm}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Cargo Code</label>

                        <select
                          name="SelectStatus"
                          className="form-control form-control-sm"
                          id="select1"
                          value={cargocode}
                          onChange={(e) => handleCargoChange(e)}
                        >
                          <option value="">Select Cargo Code</option>
                          {ccode &&
                            ccode?.length > 0 &&
                            ccode?.map((itm, i) => (
                              <option key={i}>{itm}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2" id="todate-div">
                      <div className="form-group">
                        <label>BoL Number</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="mr-nno"
                          value={bolno}
                          onChange={(e) => handleBolChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Carrier Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="mr-nno"
                          value={carriername}
                          onChange={(e) => handleCarrierChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 mt-4 pt-2">
                      <button
                        type="button"
                        className="btn btn-block btn-sm btn-outline-primary"
                        onClick={() => handleFiltermessage()}
                      >
                        Search
                      </button>
                    </div>
                    <div className="col-md-2 mt-4 pt-2">
                      <button
                        type="button"
                        className="btn btn-block btn-sm btn-outline-danger"
                        onClick={() => handleResetData()}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="col-md-12 pt-3 table-responsive">
                    <table className="table table-striped table-sm table-hover text-nowrap">
                      <thead>
                        <tr style={{ background: "#E1E8FF", fontSize: "12px" }}>
                          <th style={{ color: "#3166C9" }}>#</th>
                          <th style={{ color: "#3166C9" }}>Date</th>
                          <th style={{ color: "#3166C9" }}>MRN No.</th>
                          <th style={{ color: "#3166C9" }}>
                            Vessel Visit Code
                          </th>

                          <th style={{ color: "#3166C9" }}>BoL Count.</th>
                          <th style={{ color: "#3166C9" }}>Status</th>
                          <th style={{ color: "#3166C9" }}>Action</th>
                        </tr>
                      </thead>
                      {loading ? (
                        <tbody>
                          <tr style={{ background: "white" }}>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              <Loading />
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody style={{ fontSize: "12px" }}>
                          {filteredItems &&
                            filteredItems?.length > 0 &&
                            Array.isArray(filteredItems) &&
                            filteredItems?.map((itm, i) => {
                              return (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>
                                    {itm?.row_created_local
                                      ? itm?.row_created_local
                                      : itm?.row_created}
                                  </td>
                                  <td>{itm?.manifest?.vessel?.mrn}</td>
                                  <td>
                                    {itm?.manifest.vessel?.vesselVisitCode}
                                  </td>

                                  <td>{itm?.manifest?.bolList?.length}</td>
                                  <td
                                    style={{
                                      color:
                                        itm?.file_created === 1
                                          ? "darkgreen"
                                          : itm?.status_code === 2 ||
                                            itm?.status_code === 5 ||
                                            itm?.status_code === 7
                                          ? "#FF0000"
                                          : "darkgreen",
                                    }}
                                  >
                                    {itm?.file_created === 1
                                      ? "FILES GENERATED"
                                      : itm?.status_code === 1
                                      ? "RAW DATA RECEIVED"
                                      : itm?.status_code === 2
                                      ? "VALIDATION FAILED"
                                      : itm?.status_code === 3
                                      ? "VALIDATION SUCCESSFUL"
                                      : itm?.status_code === 4
                                      ? "DETAILS INSERTED"
                                      : itm?.status_code === 5
                                      ? "DETAILS INSERTION FAILED"
                                      : itm?.status_code === 6
                                      ? "TRANSFER SUCCESSFUL"
                                      : itm?.status_code === 7
                                      ? "TRANSFER FAILED"
                                      : null}
                                  </td>
                                  <td
                                    style={{ gap: "2px", display: "flex" }}
                                    className="actions"
                                  >
                                    <button
                                      title="View Details"
                                      className="btn btn-sm  btn-clear"
                                      onClick={() => handleNavigation(itm)}
                                    >
                                      <FaRegEye />
                                    </button>
                                    {(itm?.status_code === 5 ||
                                      itm?.status_code === 7) && (
                                      <button
                                        className="btn btn-sm bg-success btn-clear"
                                        title="Re-Process"
                                        onClick={() =>
                                          handleReprocess(
                                            itm?.id,
                                            itm?.status_code
                                          )
                                        }
                                      >
                                        <FiRefreshCw />
                                      </button>
                                    )}

                                    <button
                                      title="View JSON"
                                      className="btn btn-sm bg-success  btn-clear"
                                      data-toggle="modal"
                                      data-target="#code"
                                      onClick={() => updateModal(itm?.id)}
                                    >
                                      <FaCode />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {modaldata && (
              <Modal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header style={{ justifyContent: "center" }}>
                  <Modal.Title id="contained-modal-title-vcenter">
                    Message Information
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<pre>${formattedJson}</pre>`,
                    }}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-block text-white mt-2 save"
                    style={{ backgroundColor: "#547899" }}
                  >
                    Close
                  </button>
                </Modal.Footer>
              </Modal>
            )}
          </section>
        </div>
        <aside className="control-sidebar control-sidebar-dark"></aside>
        <Footer />
      </div>
    </>
  );
};

export default Messages;
