import server from "../conf/conf.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export class AwardService {
  async create(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/awards/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res) return res;
      else throw new Error("Failed to create award");
    } catch (error) {
      throw error;
    }
  }

  async edit(awardId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/awards/${awardId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res) return res;
      else throw new Error("Failed to edit award");
    } catch (error) {
      throw error;
    }
  }

  async getAll(userName) {
    try {
      const res = await axios.get(`${server.serverUrl}/awards/${userName}`);
      if (res) return res;
      else throw new Error("Failed to fetch awards");
    } catch (error) {
      throw error;
    }
  }

  async getOne(awardId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/awards/award/${awardId}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch award");
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(awardId) {
    try {
      const res = await axios.delete(`${server.serverUrl}/awards/${awardId}`);
      if (res) return res;
      else throw new Error("Failed to delete award");
    } catch (error) {
      throw error;
    }
  }
}

const awardService = new AwardService();
export default awardService;
