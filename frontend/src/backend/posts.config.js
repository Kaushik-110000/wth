import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class Postservice {
  async create(data) {
    console.log(data);
    try {
      const res = await axios.post(`${server.serverUrl}/posts/`, data);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
  async edit(postId, data) {
    try {
      const res = await axios.patch(
        `${server.serverUrl}/posts/${postId}`,
        data
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
        `${server.serverUrl}/posts/${userName.userName}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async getOne(postId) {
    try {
      const res = await axios.get(`${server.serverUrl}/posts/post/${postId}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(postId) {
    try {
      const res = await axios.delete(`${server.serverUrl}/posts/${postId}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
}
const postservice = new Postservice();
export default postservice;
