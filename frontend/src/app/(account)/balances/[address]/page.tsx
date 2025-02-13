/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Alert, Skeleton, Tooltip } from '@mui/material';

import * as BalancesService from '@/services/balances';
import BalanceViewModel from '../../../../../../backend/src/api/balance/viewModels/balance.viewModel';
import styles from './styles.module.scss';



const skeletonArray = Array.from({ length: 4 });

const Balances: React.FC = () => {
  const params = useParams<{ address: string }>();
  const [balances, setBalances] = useState<BalanceViewModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBalances = useCallback(async () => {
    try {
      if (params.address) {
        const fetchedBalances = await BalancesService.fetchBalancesForAddress(params.address);
        setBalances(fetchedBalances);
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("Unauthorized")) {
        router.push('/401');
      } else {
        setError(e?.toString() ?? 'Unsuspected error happened.')
      }
    }
    } , [params.address, router]);

 useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const balancesMapper =useCallback((_balance: BalanceViewModel) => {
    return (
      <div key={_balance.contractAddress} className={styles['balance']}>
        <span className={styles['balance__meta']}>
          <span className={styles['balance__meta__logo']}>
            <img src={_balance.logo ?? undefined} alt='coin'/>
          </span>
          <span className={styles['balance__meta__name']}>
            {_balance.name}
          </span>
          <span className={styles['balance__meta__symbol']}>
            {_balance.symbol}
          </span>
        </span>
        <span className={styles['balance__address-and-amount']}>
            <span>
              amount: {_balance.balance}
            </span>
            <Tooltip title={_balance.contractAddress}>
              <span className={styles['balance__address-and-amount__address']}>
                address: {_balance.contractAddress}
              </span>
            </Tooltip>
          </span>
      </div>
    )
  } , []);

  const skeletonMapper = useCallback(
    (_skeleton: unknown, _index: number) => (
      <div className={styles['balance-loading']} key={_index}>
        <Skeleton variant="circular" width={50} height={50} />
        <Skeleton variant='rectangular' width="100%" height={50} sx={{ borderRadius: '24px'}}/>
      </div>
    )
  , []);

  if (!balances) {
    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          <h1>
            Balances
          </h1>
        </div>
        <div className={styles['balances']}>
          {skeletonArray.map(skeletonMapper)}
        </div>
        {error && (
          <div className={styles['error-container']}>
            <Alert variant="outlined" severity="error" sx={{ color: 'primary.light'}} >
              {error}
            </Alert>
          </div>
       )}
      </div>
    )
  }

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h1>
          Balances
        </h1>
      </div>
      <div className={styles['balances']}>
        {balances.map(balancesMapper)}
      </div>
      {error && (
          <div className={styles['error-container']}>
            <Alert variant="outlined" severity="error" sx={{ color: 'primary.light'}} >
              {error}
            </Alert>
          </div>
       )}
    </div>
  );
};

export default Balances;
