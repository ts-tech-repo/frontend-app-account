import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { handleRequestError } from '../../data/utils';

export async function getThirdPartyAuthProviders() {
  try {
    const { data } = await getAuthenticatedHttpClient()
      .get(`${getConfig().LMS_BASE_URL}/api/third_party_auth/v0/providers/user_status`);

    return data.map(({ connect_url: connectUrl, disconnect_url: disconnectUrl, ...provider }) => ({
      ...provider,
      connectUrl: `${getConfig().LMS_BASE_URL}${connectUrl}`,
      disconnectUrl: `${getConfig().LMS_BASE_URL}${disconnectUrl}`,
    }));
  } catch (error) {
    if (error.response && error.response.status === 502) {
      document.querySelector('.row .col-md-10 > div:not([id]):not([class])').innerHTML = 'There seems to be a network issue. Please check your connection and try again.';
    }
    throw error;
  }
}

export async function postDisconnectAuth(url) {
  const { data } = await getAuthenticatedHttpClient()
    .post(url)
    .catch(handleRequestError);
  return data;
}
