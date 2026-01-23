import { useSelector } from "react-redux"
function SubscriptionCard({ subsObject }) {
    const {  isAuthenticated } = useSelector((state) => state.auth);
    //console.log("subsObject in sub card", subsObject);
    if(isAuthenticated){
        return (
        <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            {/*yha avatar or username dal na h */}
              <img src={subsObject.avatar} className="w-6 h-6 rounded-full" alt="ch" />
              <span className="text-sm truncate">{subsObject.username}</span>
        </div>
    )
    }
}

export default SubscriptionCard