// src/pages/products/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/ProductDetail.module.css';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({ name: '', email: '', phone: '' });
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:4000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:4000/api/products/${id}/variants`)
      .then(res => setVariants(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const match = variants.find(v => v.size === selectedSize && v.color === selectedColor);
      setSelectedVariant(match || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedSize, selectedColor, variants]);

  const resetSelections = () => {
    setSelectedSize('');
    setSelectedColor('');
    setSelectedVariant(null);
    setShowDialog(false);
  };

  const getUnique = (key, filterBySize = null) => {
    const filtered = filterBySize
      ? variants.filter(v => v.size === filterBySize)
      : variants;
    return [...new Set(filtered.map(v => v[key]))];
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          variant_id: selectedVariant.id,
          ...orderData
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderConfirmed(true);
      }
    } catch (error) {
      console.error('Order failed', error);
    }
  };

  if (!product) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} className={styles.productImage} />
      <p><strong>Base Price:</strong> ${product.price}</p>
      <p>{product.description}</p>

      <button onClick={() => setShowDialog(true)} className={styles.selectVariantBtn}>
        Select Variant
      </button>

      {selectedVariant && (
        <div className={styles.selectedVariant}>
          <p><strong>Selected:</strong> Size {selectedVariant.size}, Color {selectedVariant.color}</p>
          <p><strong>Price:</strong> ${selectedVariant.price}</p>
          <button className={styles.buyNowBtn} onClick={() => setShowOrderForm(true)}>
            Buy it now
          </button>
        </div>
      )}

      {showOrderForm && !orderConfirmed && (
        <form onSubmit={handleOrderSubmit} className={styles.orderForm}>
          <h3>Enter Your Details</h3>
          <input
            required
            type="text"
            placeholder="Name"
            value={orderData.name}
            onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={orderData.email}
            onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
          />
          <input
            required
            type="text"
            placeholder="Phone"
            value={orderData.phone}
            onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
          />
          <button type="submit" className={styles.confirmBtn}>Confirm Order</button>
        </form>
      )}

      {orderConfirmed && (
        <div className={styles.confirmedMsg}>
          <strong>Your order has been confirmed!</strong>
        </div>
      )}

      {showDialog && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBox}>
            <h3>Select Variant</h3>
            <div>
              <p><strong>Select Size:</strong></p>
              <div className={styles.variantOptions}>
                {getUnique('size').map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSelectedColor('');
                    }}
                    className={selectedSize === size ? styles.activeOption : styles.optionBtn}
                  >{size}</button>
                ))}
              </div>
            </div>

            {selectedSize && (
              <div>
                <p><strong>Select Color:</strong></p>
                <div className={styles.variantOptions}>
                  {getUnique('color', selectedSize).map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={selectedColor === color ? styles.activeOption : styles.optionBtn}
                    >{color}</button>
                  ))}
                </div>
              </div>
            )}

            {selectedColor && (
              selectedVariant ? <p><strong>Price:</strong> ${selectedVariant.price}</p> : <p className={styles.errorMsg}>This combination is not available.</p>
            )}

            <div className={styles.dialogActions}>
              <button onClick={resetSelections} className={styles.cancelBtn}>Cancel</button>
              {selectedVariant && (
                <button onClick={() => setShowDialog(false)} className={styles.selectBtn}>Select This Variant</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}