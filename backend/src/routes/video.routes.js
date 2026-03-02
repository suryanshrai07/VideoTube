import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );
router.route("/toggle/publish/:videoId").patch(verifyJWT,togglePublishStatus);

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT,deleteVideo)
    .patch(verifyJWT,upload.single("thumbnail"), updateVideo);



export default router