/**
 * API : themoviedb.org
 * Version used: V3
 *  
 * All global parameters are listed via /configuration
 * 
 * Functions are implemented with async axios and return the response object.
 * If an error occurs, the function will throw the response object itself.
 */

import axios from "axios"
import api_key from "./key"

const api_version = '3'
export const api_url = 'https://api.themoviedb.org/' + api_version
const config_url = api_url + '/configuration'
export const lowQualityImg = "w300"
export const highQualityImg = "original"


// movieDB.movies_popular_list_url = api_url + '/movie/popular?language=en-US&page=1'
// movieDB.movies_toprated_list_url = api_url + '/movie/top_rated?language=en-US&page=1'
// movieDB.movies_trending_list_url = api_url + '/trending/movie/day?language=en-US'
// movieDB.tvshow_trending_list_url = api_url + '/trending/tv/day?language=en-US'

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer '+ api_key
    }
}

/**
 * Ask the api which is base url to get images
 * 
 * returns the secure_base_url (https url) property found in the json data object
*/
export async function api_getconfig() {
  try {
    const response = await axios.get(config_url, options);
    return response.data.images.secure_base_url
  }
  catch (error) {
    throw error.response
  }
}

export async function api_request(url) {
  try {
    const response = await axios.get(url, options);
    return response
  }
  catch (error) {
    throw error.response
  }
}

