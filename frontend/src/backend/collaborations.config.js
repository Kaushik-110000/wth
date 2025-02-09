import server from "../conf/conf.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export class CollaborationService {
  async create(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/collaborations/`, data);
      if (res) return res;
      else throw new Error("Failed to create collaboration");
    } catch (error) {
      throw error;
    }
  }

  async edit(collaborationId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/collaborations/${collaborationId}`,
        data
      );
      if (res) return res;
      else throw new Error("Failed to edit collaboration");
    } catch (error) {
      throw error;
    }
  }

  async getAll(userName) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/collaborations/${userName}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch collaborations");
    } catch (error) {
      throw error;
    }
  }

  async getOne(collaborationId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/collaborations/collaboration/${collaborationId}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch collaboration");
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(collaborationId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/collaborations/${collaborationId}`
      );
      if (res) return res;
      else throw new Error("Failed to delete collaboration");
    } catch (error) {
      throw error;
    }
  }
}

const collaborationService = new CollaborationService();
export default collaborationService;
