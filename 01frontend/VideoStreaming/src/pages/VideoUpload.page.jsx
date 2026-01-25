import Input from "../componets/Input"
import Button from "../componets/Button"
import {useForm} from "react-hook-form"
import { usePublishVideo } from "../queries/video.queries";
function UploadVideo(){
    const {register,handleSubmit,formState: { errors },} = useForm({mode:      "onBlur"});
    const {mutate: publishVideo,isPending:isLoading} = usePublishVideo();
    const videoUploader = (data)=>{
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description",data.description);
        formData.append("videofile", data.videofile[0]);
        formData.append("thumbnail", data.thumbnail[0]);

        if(formData) publishVideo(formData);
    }
    
    return (
        
      <div className="mx-auto max-w-2xl  bg-gray-300 rounded-xl p-10 border border-black/10 shadow-sm">
        <h1 className="text-center text-2xl font-bold leading-tight text-black/60">
          Upload Video
        </h1>

        <form onSubmit={handleSubmit(videoUploader)}  className="mt-8">
          <div className="space-y-5">
            <div>
              <Input
                label="Title: "
                type="text"
                placeholder="Write title here"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                error={errors.title?.message}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>)}
            </div>
            <div>
              <Input
                label="Description: "
                type="text"
                placeholder="Write description "
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 6,
                    message: "Dsecription must be at least 6 characters",
                  },
                })}
                error={errors.description?.message}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>)}
            </div>
            <div>
              <Input
                label="VideoFile: "
                type="file"
                 className="
                    file:border file:border-black file:border-dashed
                    file:rounded-md
                    file:mr-4
                    file:text-sm
                    file:cursor-pointer
                    hover:file:bg-gray-100
                "
                placeholder="Enter videofiel"
                {...register("videofile", {
                  required: "Video file is required",
                })}
                error={errors.videofile?.message}
              />
             {errors.videofile && (
                <p className="text-red-600 text-sm mt-1">{errors.videofile.message}</p>
                )}
            </div>
            <div>
              <Input
                label="Thumbnail: "
                type="file"
                className="
                    file:border file:border-black file:border-dashed
                    file:rounded-md
                    file:mr-4
                    file:text-sm
                    file:cursor-pointer
                    hover:file:bg-gray-100
                "
                placeholder="Enter thumbnail"
                {...register("thumbnail", {
                  required: "thumbnail is required",
                })}
                error={errors.thumbnail?.message}
              />
              {errors.thumbnail && (<p className="text-red-600 text-sm mt-1">{errors.thumbnail.message}</p>)}
            </div>
            
            <Button
              
              type="submit"
              className="w-full"
            disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Upload Video...
                </span>
              ) : (
                "Uploaded Video"
              )}
            </Button>
          </div>
        </form>
      </div>
    )
}

export default UploadVideo