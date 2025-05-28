import { api } from '@natiq/api.test.local/api';
import { createTuyau } from '@tuyau/client';

export const tuyau = createTuyau({
	api,
	baseUrl: import.meta.env.VITE_BACKEND_URL,
});
