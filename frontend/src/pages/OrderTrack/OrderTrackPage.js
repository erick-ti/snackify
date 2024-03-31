import React, { useEffect, useState } from 'react'
import { trackOrderById } from '../../services/orderService';
import { Link, useParams } from 'react-router-dom';
import NotFound from '../../components/NotFound/NotFound';
import classes from './orderTrackPage.module.css';
import DateTime from '../../components/DateTime/DateTime';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Title from '../../components/Title/Title';
import Map from '../../components/Map/Map';

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    orderId && // if orderId exists
      trackOrderById(orderId).then(order => { // get order from server
        setOrder(order); // set order coming from server
      });
  }, []);

  if (!orderId)
    return <NotFound message="Order Not Found" linkText="Go to Home Page" />;

  return (
    order && <div className={classes.container}>
      <div className={classes.content}>
        <h1>Order #{order.id}</h1>
        <div className={classes.header}>
          <div>
            <strong>Date</strong>
            <DateTime date={order.createdAt} />
          </div>
          <div>
            <strong>Name</strong>
            {order.name}
          </div>
          <div>
            <strong>Address</strong>
            {order.address}
          </div>
          <div>
            <strong>State</strong>
            {order.status}
          </div>
          {order.paymentId && ( // only show paymentId if it exists
            <div>
              <strong>Payment ID</strong>
              {order.paymentId}
            </div>
          )}
        </div>

        <OrderItemsList order={order} />
      </div>
      <div>
        <Title title="Your Location" fontSize="1.6rem" />
        <Map location={order.addressLatLng} readonly={true} />
      </div>

      {order.status === 'NEW' && ( // if order status is 'NEW', show link to Payment
        <div className={classes.payment}>
          <Link to="/payment">Go to Payment</Link>
        </div>
      )}
    </div>
  )
}
