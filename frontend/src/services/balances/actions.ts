import API_URL from "@/constants/api";

import BalanceViewModel from '../../../../backend/src/api/balance/viewModels/balance.viewModel';

export const fetchBalancesForAddress = async (address: string) => {
  const token = localStorage.getItem("accessToken");

  try {
    const fetchedBalances = await fetch(`${API_URL}/balances/${address}`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
    const resolvedResponse = await fetchedBalances.json();

    if (resolvedResponse.statusCode === 401) {
      throw new Error("Unauthorized: Invalid or expired token");
    }

    return resolvedResponse.responseObject as BalanceViewModel[];

  } catch (e) {
    throw e;
  }
}
