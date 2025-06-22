import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/OrderList.module.css';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleOrderClick = (orderId) => {
    axios.get(`http://localhost:4000/api/orders/${orderId}`)
      .then(res => setSelectedOrder(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Orders</h1>
      <div className={styles.orderLayout}>
        <div className={styles.orderList}>
          <h3>All Orders</h3>
          <ul className={styles.list}>
            {orders.map(order => (
              <li
                key={order.id}
                className={styles.orderItem}
                onClick={() => handleOrderClick(order.id)}
              >
                <span>Order #{order.id}</span>
                <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>{order.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.orderDetail}>
          {selectedOrder && (
            <div className={styles.detailBox}>
              <h3>Order #{selectedOrder.id}</h3>
              <p><strong>Status:</strong> <span className={`${styles.statusTag} ${styles[selectedOrder.status.toLowerCase()]}`}>{selectedOrder.status}</span></p>
              <h4>User Info</h4>
              <p><strong>Name:</strong> {selectedOrder.name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <h4>Product Info</h4>
              <p><strong>Product:</strong> {selectedOrder.product.name}</p>
              <p><strong>Description:</strong> {selectedOrder.product.description}</p>
              <p><strong>Image:</strong><br/><img src={selectedOrder.product.image_url} alt={selectedOrder.product.name} className={styles.productImage} /></p>
              <h4>Variant Info</h4>
              <p><strong>Size:</strong> {selectedOrder.variant.size}</p>
              <p><strong>Color:</strong> {selectedOrder.variant.color}</p>
              <p><strong>Price:</strong> ${selectedOrder.variant.price}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}