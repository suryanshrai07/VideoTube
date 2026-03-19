import { axiosInstance } from "../../utilities/axios";
import {
    fetchVideosStart,
    fetchVideosSuccess,
    fetchVideosFailure
} from "./videoSlice";

export const fetchVideos = (page = 1,query = "",userId) => async (dispatch) =>{
    dispatch(fetchVideosStart());

    try {
        const res = await axiosInstance.get("/videos",{
            params : {page, limit : 10 , query,userId},
        });
        dispatch(
            fetchVideosSuccess({
                docs : res.data.message.docs,
                hasNextPage : res.data.message.hasNextPage,
                page,
            })
        )
    } catch (error) {
        dispatch(fetchVideosFailure(error.response?.data?.message || "Error Fetching videos"))
    }
}