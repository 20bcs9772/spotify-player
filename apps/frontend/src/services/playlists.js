import axios from "axios";
import { apiUrl } from "@/constants";

export const getUserPlaylists = async () => {
  const userPlaylists = await axios.get(`${apiUrl}/playlist/me`);
  return userPlaylists.data;
};


export const getPlaylistDetails = async (id) => {
    const playlistDetails = await axios.get(`${apiUrl}/playlist/${id}`);
    return playlistDetails.data
}

export const createPlaylist = async (data) => {
    const response = await axios.post(`${apiUrl}/playlist/me`, data);
    return response.data;
}