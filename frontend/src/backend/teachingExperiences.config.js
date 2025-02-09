import server from "../conf/conf.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export class TeachingExperienceService {
  async create(data) {
    console.log(data);
    try {
      const res = await axios.post(
        `${server.serverUrl}/teachingExperience/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Handling file uploads
          },
        }
      );
      if (res) return res;
      else throw new Error("Failed to create teaching experience");
    } catch (error) {
      throw error;
    }
  }

  async edit(experienceId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/teachingExperience/${experienceId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Handling file uploads
          },
        }
      );
      if (res) return res;
      else throw new Error("Failed to update teaching experience");
    } catch (error) {
      throw error;
    }
  }

  async getAll(userName) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/teachingExperience/${userName}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch teaching experiences");
    } catch (error) {
      throw error;
    }
  }

  async getOne(experienceId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/teachingExperience/experience/${experienceId}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch teaching experience");
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(experienceId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/teachingExperience/${experienceId}`
      );
      if (res) return res;
      else throw new Error("Failed to delete teaching experience");
    } catch (error) {
      throw error;
    }
  }
}

const teachingExperienceService = new TeachingExperienceService();
export default teachingExperienceService;
