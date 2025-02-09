import server from "../conf/conf.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export class ResearchPaperService {
  async create(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/researchPapers/`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Handling file uploads
        },
      });
      if (res) return res;
      else throw new Error("Failed to create research paper");
    } catch (error) {
      throw error;
    }
  }

  async edit(researchPaperId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/researchPapers/${researchPaperId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Handling file uploads
          },
        }
      );
      if (res) return res;
      else throw new Error("Failed to update research paper");
    } catch (error) {
      throw error;
    }
  }

  async getAll(userName) {
    try {
      const res = await axios.get(`${server.serverUrl}/researchPapers/${userName}`);
      if (res) return res;
      else throw new Error("Failed to fetch research papers");
    } catch (error) {
      throw error;
    }
  }

  async getOne(researchPaperId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/researchPapers/paper/${researchPaperId}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch research paper");
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(researchPaperId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/researchPapers/${researchPaperId}`
      );
      if (res) return res;
      else throw new Error("Failed to delete research paper");
    } catch (error) {
      throw error;
    }
  }
}

const researchPaperService = new ResearchPaperService();
export default researchPaperService;
