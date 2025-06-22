// src/pages/index.js
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Shirt Store</h1>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => navigateTo('/products')}
          className={styles.primaryBtn}
        >
          View Products
        </button>
        <button
          onClick={() => navigateTo('/order')}
          className={styles.secondaryBtn}
        >
          View Your Orders
        </button>
      </div>
    </div>
  );
}