import server from "../conf/conf.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export class ConferenceService {
  async create(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/conferences/`, data);
      if (res) return res;
      else throw new Error("Failed to create conference");
    } catch (error) {
      throw error;
    }
  }

  async edit(conferenceId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/conferences/${conferenceId}`,
        data
      );
      if (res) return res;
      else throw new Error("Failed to update conference");
    } catch (error) {
      throw error;
    }
  }

  async getAll(userName) {
    try {
      const res = await axios.get(`${server.serverUrl}/conferences/${userName}`);
      if (res) return res;
      else throw new Error("Failed to fetch conferences");
    } catch (error) {
      throw error;
    }
  }

  async getOne(conferenceId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/conferences/conference/${conferenceId}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch conference");
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(conferenceId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/conferences/${conferenceId}`
      );
      if (res) return res;
      else throw new Error("Failed to delete conference");
    } catch (error) {
      throw error;
    }
  }
}

const conferenceService = new ConferenceService();
export default conferenceService;
