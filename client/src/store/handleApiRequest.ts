import type { AxiosError, AxiosResponse } from "axios";
import { ref } from "vue";

export class ApiRequest {
  loading = ref(false);
  error = ref("");
  message = ref("");

  async handleApiRequest(apiCall: () => Promise<AxiosResponse>) {

    this.loading.value = true;

    try {
      const response = await apiCall();
      // if there is some message

      this.message.value = response.data?.message ;
      return response.data;
    } catch (err) {

      const axiosError = err as AxiosError;

      this.error.value =
        axiosError.message + ": " + axiosError.response?.statusText ||
        "An error occurred";

    } finally {
      this.loading.value = false;
    }
  }
}
