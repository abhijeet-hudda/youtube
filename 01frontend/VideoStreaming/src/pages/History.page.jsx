import VideoCard from "../componets/VideoCard"
import Container from "../componets/container/Container"


function History(){

    return (
        <div className="w-full py-8 bg-gray-50 min-h-screen">
        <Container>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideo.map((video) => (
                <div key={video._id} className="w-full">
                <VideoCard videoObject={video} />
                </div>
            ))}
            </div>
        </Container>
        </div>
    )
}


export default History