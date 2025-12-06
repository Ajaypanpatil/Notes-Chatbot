import axios from "axios";
import API_BASE from "../config/api";

export const listChats = () => axios.get(`${API_BASE}/chats`).then(r => r.data);
export const createChat = (name) =>
  axios.post(`${API_BASE}/chats`, { name }).then(r => r.data);

export const getMessages = (chatId) =>
  axios.get(`${API_BASE}/chats/${chatId}/messages`).then(r => r.data);

export const ask = (chatId, question) =>
  axios.post(`${API_BASE}/ask/${chatId}`, { question }).then(r => r.data);

export const uploadPdf = (chatId, file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${API_BASE}/upload/${chatId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(r => r.data);
};

export async function deleteChat(chatId) {
  const response = await fetch(`${API_BASE}/chats/${chatId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete chat");
  }
  
  const result = await response.json();
  return result;
}


