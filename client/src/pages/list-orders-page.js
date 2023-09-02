import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import { useDebounce } from 'react-use';
import moment from 'moment';
import DateRangePicker, { DATE_ISO_FORMAT } from '../components/dare-range-picker';
import Table from '../components/table';
import Pagination from '../components/pagination';
import Pill from '../components/pill.js';
import InfoCard from '../components/card';
import '@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css';
import './list-orders-page.css';
import Card from 'react-bootstrap/Card';
import { RiDeleteBin2Line } from 'react-icons/ri';

export default function ListOrders() {

  const [ordersResp, setOrderResp] = useState();
  const [filterParams, setFilterParams] = useState({
    skip: 0,
    limit: 20,
    dateFrom: moment().subtract(30, 'day').format(),
    dateTo: moment().format(DATE_ISO_FORMAT),
    amountFrom: undefined,
    amountTo: undefined,
  })
  const [searchMinAmount, setSearchMinAmount] = useState(filterParams.amountFrom);
  const [searchMaxAmount, setSearchMaxAmount] = useState(filterParams.amountTo);

  useDebounce(
    () => {
      if (searchMinAmount === filterParams.amountFrom) return;
      setFilterParams({ ...filterParams, amountFrom: searchMinAmount, skip: 0 });
    },
    800,
    [searchMinAmount, filterParams.amountFrom]
  );
  useDebounce(
    () => {
      if (searchMaxAmount === filterParams.amountTo) return;
      setFilterParams({ ...filterParams, amountTo: searchMaxAmount, skip: 0 });
    },
    800,
    [searchMaxAmount, filterParams.amountTo]
  );

  useEffect(() => {
    const amountTo = filterParams.amountFrom && filterParams.amountFrom > filterParams.amountTo ? undefined : filterParams.amountTo;
    axios.get('/orders', {
      params: {
        skip: filterParams.skip, limit: filterParams.limit,
        dateFrom: filterParams.dateFrom, dateTo: filterParams.dateTo,
        amountFrom: filterParams.amountFrom, amountTo,
      }
    }).then(resp => setOrderResp(resp.data));
  }, [filterParams, ordersResp])
  const deleteOrder = async (orderId) => {
    await axios.delete(`orders/${orderId}`).then(resp => setOrderResp(resp.data));
  };
  // useEffect(() => {
  //   let mount = true;
  //   let eventSource;
  //   let timer;
  //   const createEventSource = () => {
  //     if (eventSource) {
  //       eventSource.close();
  //     }
  //   }
  //   eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/events`, { withCredentials: true });
  //   eventSource.onmessage = (msg) => {
  //     if (mount) {
  //       const data = JSON.parse(msg.data);
  //       if (data.event === 'update-order') {
  //         setOrderResp(data.payload);
  //       }
  //     }
  //   };
  //   eventSource.onerror = (err) => {
  //     console.log(err);
  //     timer = setTimeout(() => { createEventSource(); }, 1000);
  //   };
  //   return () => { mount = false; clearTimeout(timer); eventSource.close(); }
  // }, [ordersResp]);
  return (
    <div className="orders">
      <div>
        <InfoCard />
      </div>

      <Card className="orders-card" style={{ borderColor: "#d5dbe8" }}>
        <Card.Body className="card-body">
          <Card.Title className="card-title"><div className="card-title-filter"><span>Orders List</span>
            <div className='filters'>

              <div className="filter-date">
                <label>Date</label>
                <DateRangePicker
                  value={{ from: filterParams.dateFrom, to: filterParams.dateTo }}
                  dateFormat={DATE_ISO_FORMAT}
                  onChange={(range) => setFilterParams({ ...filterParams, skip: 0, dateFrom: range.from, dateTo: range.to })}
                />
              </div>
              <div className="filter-min">
                <label>Min.</label>
                <input type="text" className="form-control amount-control"
                  pattern="[0-9]*"
                  value={searchMinAmount || ''}
                  onChange={e => {
                    if (e.target.validity.valid) {
                      setSearchMinAmount(Number(e.target.value))
                    }
                  }}
                />
              </div>

              <div className="filter-max">
                <label>Max.</label>
                <input type="text" style={{ borderRadius: "300px" }} className="form-control amount-control rounded"
                  pattern="[0-9]*"
                  value={searchMaxAmount || ''}
                  onChange={e => {
                    if (e.target.validity.valid) {
                      setSearchMaxAmount(Number(e.target.value))
                    }
                  }}
                />
              </div>
            </div></div></Card.Title>
          <div>
            <Table
              columns={
                [
                  {
                    header: 'No.',
                    render: (row) => {
                      return (
                        <NavLink to={`/orders/${row.id}`} style={{ textDecoration: "none" }}>
                          #{row.number}
                        </NavLink>
                      )
                    }
                  },
                  {
                    header: 'Customer',
                    render: (row) => row.customerName,
                  },
                  {
                    header: 'Date',
                    render: (row) => moment(row.date).format('DD-MM-YYYY')
                  },
                  {
                    header: 'Items',
                    render: (row) => row.productsCount
                  },
                  {
                    header: 'Total Amount',
                    render: (row) => "E£" + row.totalAmount,
                  },
                  {
                    header: 'Shipping Status',
                    render: (row) => (
                      <Pill content={row.shippingStatus} />
                    )
                  }
                  , {
                    header: 'Action',

                    render: (row) => (
                      <RiDeleteBin2Line className="delete" onClick={() => deleteOrder(row.id)} />
                    )
                  },
                ]
              }
              rows={ordersResp?.items || []}
            />
          </div>
          <div>
            <Pagination
              limit={filterParams.limit}
              skip={filterParams.skip}
              total={ordersResp?.total || 0}
              onChange={(args) => { setFilterParams({ ...filterParams, ...args }) }}
            />
          </div>
        </Card.Body>
      </Card>
    </div >
  );
}