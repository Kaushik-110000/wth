import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class Achievementservice {
  async create(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/achievements/`, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Let axios set the correct content-type
        },
      });
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async edit(achievementId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/achievements/${achievementId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let axios set the correct content-type
          },
        }
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async getAll(userName) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/achievements/${userName}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async getOne(achievementId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/achievements/achievement/${achievementId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(achievementId) {
    try {
      const res = await axios.delete(
        `${server.serverUrl}/achievements/${achievementId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
}

const achievementservice = new Achievementservice();
export default achievementservice;
