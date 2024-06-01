import { defineStore } from "pinia";
import axios from "axios";
import type {ISearchVisitsDto} from "@/store/models/schedule/visits.model";

export const useUploadsStore = defineStore("uploads", () => {
  // uploadFile in server
  async function uploadFile(file: File) {
    let responseMsg = "";

    const formData = new FormData();

    if (file) {
      formData.append("file", file, `${file.name}`);
    } else {
      responseMsg = `вы забыли добавить файлы`;
      return responseMsg;
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    //create team
    await axios.post("/api/uploads", formData, config).catch((err) => {
      if (err.response) {
        responseMsg = err.response.data.message;
      }
    });

    return responseMsg;
  }

  // TODO not checked
  // upload image on server
  async function uploadImage(file: File){
    let responseMsg = "сохранено";


    const formData = new FormData();
    formData.append(
        "file",file);

    await axios
      .post(`/api/uploads/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {
        if (err.response) {
          responseMsg = err.response.data.message[0];
        }
      });

    return responseMsg;
  }

  async function getReportTeamVisits(dto:ISearchVisitsDto) {

    const res = await axios.get("/api/uploads/excel/team-visits", {
      params: {...dto},
      responseType: 'arraybuffer', // Important for binary data
    });
    return res.data;
  }


  return {
    uploadFile,
    uploadImage,
    getReportTeamVisits
  };
});
