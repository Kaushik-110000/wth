import server from "../conf/conf.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export class ProjectService {
  async create(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/projects/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res) return res;
      else throw new Error("Failed to create project");
    } catch (error) {
      throw error;
    }
  }

  async edit(projectId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/projects/${projectId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res) return res;
      else throw new Error("Failed to update project");
    } catch (error) {
      throw error;
    }
  }

  async getAll(userName) {
    try {
      const res = await axios.get(`${server.serverUrl}/projects/${userName}`);
      if (res) return res;
      else throw new Error("Failed to fetch projects");
    } catch (error) {
      throw error;
    }
  }

  async getOne(projectId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/projects/project/${projectId}`
      );
      if (res) return res;
      else throw new Error("Failed to fetch project");
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(projectId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/projects/${projectId}`
      );
      if (res) return res;
      else throw new Error("Failed to delete project");
    } catch (error) {
      throw error;
    }
  }
}

const projectService = new ProjectService();
export default projectService;
