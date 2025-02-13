import Link from "next/link";

import styles from './styles.module.scss'

export default function UnauthorizedPage() {
  return (
    <div className={styles['unauthorized']}>
      <h1>401 - Unauthorized</h1>
      <p>Please Sign in to access this page.</p>
      <Link href="/">
        Sign in
      </Link>
    </div>
  )
}
