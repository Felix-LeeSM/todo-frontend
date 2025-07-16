import type { ErrorInterface } from "@domain/shared/types/Error.interface";
import axios from "axios";
import { toast } from "react-toastify";

export const handleApiError = (err: unknown) => {
  if (axios.isAxiosError<ErrorInterface | null>(err) && err.response)
    toast.error(err.response.data?.message || "Something Went Wrong, Please Try Again Later.");
  else toast.error("Something Went Wrong, Please Try Again Later.");
};
