import React, { useEffect, useState } from "react";
import ExportExcel from "./Excelexport";
import { useSelector, useDispatch } from "react-redux";
import Apis from "../Services/ApiServices/Apis";
import { addItems } from "./store/ItemsSlice";
import GraphCard from "./GraphCard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import moment from "moment";
import Footer from "./Footer";
import { useApiUrl } from "./Context/ApiUrlContext";

const Dashboard = () => {
  const hidden = useSelector((state) => state.hiddenstate.hidden);
  const items = useSelector((state) => state.Items.items);
  const { apiUrl, setApiUrl } = useApiUrl();

  const get8HoursBefore = () => {
    const currentTime = moment();
    const eightHoursBefore = currentTime.subtract(8, "hours");
    const formattedTime = eightHoursBefore.format("YYYY-MM-DDTHH:mm");
    return formattedTime;
  };

  useEffect(() => {
    document.title = "DP World DAR | Dashboard";
  }, []);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(get8HoursBefore());
  const [endDate, setEndDate] = useState(
    moment(new Date(), "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
      "YYYY-MM-DDTHH:mm"
    )
  );
  const [statusValue, setStatusValue] = useState(0);

  const formatDate2 = (dateString) => {
    const parsedTime = moment(dateString);
    const formattedTime = parsedTime.format("YYYY-MM-DD HH:mm");
    return formattedTime;
  };

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");

  //   if (token) {
  //     fetchMessage(formatDate2(startDate), formatDate2(endDate));
  //   } else {
  //     window.location.href = "/";
  //   }
  // }, [startDate, endDate, statusValue]);

  const fetchMessage = async (start, end) => {
    try {
      const apiResponse = await Apis.GetMessageList(apiUrl, start, end);
      dispatch(addItems(apiResponse?.data));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleRemoveFilter = () => {
    setStatusValue("");
    setStartDate(
      moment(new Date(), "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
        "YYYY-MM-DDTHH:mm"
      )
    );
    setEndDate(
      moment(new Date(), "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
        "YYYY-MM-DDTHH:mm"
      )
    );
  };

  return (
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
                  Welcome To Dashboard
                </h1>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/dashboard">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Admin Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row mb-3">
                      <div className="col-md-4 col-4">
                        <label>Search Results </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label for="start">From Date</label>
                          <div
                            className="input-group date"
                            id="reservationdate"
                            data-target-input="nearest"
                          >
                            <input
                              id="start"
                              className="form-control form-control-sm datetimepicker-input date-pick"
                              type="datetime-local"
                              value={startDate}
                              min="2023-01-01"
                              max={moment(
                                new Date(),
                                "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                              ).format("YYYY-MM-DDTHH:mm")}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label for="to">To Date</label>
                          <div
                            className="input-group date"
                            id="reservationdate"
                            data-target-input="nearest"
                          >
                            <input
                              id="to"
                              className="form-control form-control-sm datetimepicker-input date-pick"
                              type="datetime-local"
                              min="2023-01-01"
                              max={moment(
                                new Date(),
                                "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                              ).format("YYYY-MM-DDTHH:mm")}
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3 mb-2">
                      <div className="col-md-3 col-5">
                        <button
                          type="button"
                          className="btn btn-block btn-outline-danger"
                          onClick={() => handleRemoveFilter()}
                        >
                          Clear all
                        </button>
                      </div>

                      <ExportExcel
                        excelData={items}
                        fileName={"Excel Export"}
                      />
                    </div>
                  </div>

                  {
                    <div className="col-md-5">
                      <div className="card">
                        <div className="card-body">
                          <GraphCard itemsData={items} />
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <aside className="control-sidebar control-sidebar-dark"></aside>
      <Footer />
    </div>
  );
};

export default Dashboard;
