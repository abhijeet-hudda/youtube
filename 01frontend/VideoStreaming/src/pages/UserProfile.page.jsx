import {useSelector,useDispatch} from "react-redux"
import { useParams } from "react-router-dom"


function UserProfilePage(){
    const {username} = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
    if (username) {
        dispatch(userChannel(username));
    }
    }, [username, dispatch]);
    const { channelProfile } = useSelector((state) => state.channel);
    
    return (
        <div>
            {/*this is for coverImage */}
            <div>
                <div>
                </div>
            </div>
            {/*this is for avatar (fullname,username subscriber,videos) */}
            <div>
                <div>

                </div>
            </div>
            {/*this for all videos*/}
            <div>
                <div></div>
            </div>
        </div>
    )

}