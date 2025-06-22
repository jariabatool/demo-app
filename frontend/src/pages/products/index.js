// src/pages/products/index.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Products.module.css';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles.container}>
      <h1>Shirts Collection</h1>
      <div className={styles.grid}>
        {products.map(p => (
          <Link href={`/products/${p.id}`} key={p.id} className={styles.cardLink}>
            <div className={styles.card}>
              <img src={p.image_url} alt={p.name} className={styles.image} />
              <h3 className={styles.title}>{p.name}</h3>
              <p className={styles.price}>${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}