import {RouterProvider,createBrowserRouter} from "react-router-dom"
import {Provider} from "react-redux"
import store from "./store/store"
import Layout from "./Layout"
import Home from "./pages/Home.page"
import Login from "./componets/Login"
import Signup from "./componets/Signup"
import AuthLayout from "./componets/AuthLayout"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import  Video from "./pages/Video.page"
import UserProfilePage from "./pages/UserProfile.page"
import History from "./pages/History.page"
import UploadVideo from "./pages/VideoUpload.page"
import { Toaster } from "react-hot-toast"
import UpdateAccount from "./pages/Update/UpdateAccount.page"
import UpdateAvatar from "./pages/Update/UpdateAvatar.page"
import UpdateCoverImage from "./pages/Update/UpdateCoverImage.page"
import PlaylistPage from "./pages/Playlists.page"
import { useDispatch } from "react-redux"
import { fetchCurrentUser } from "./store/features/authFeatures/auth.Thunks"
import { useEffect } from "react"
import SearchPage from "./pages/Search.page"

const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout/>,
    children:[
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path:"watch/:videoId",
        element:(
          <AuthLayout authentication={true}>
            <Video />
          </AuthLayout>
        )
      },
      {
        path:"/:username",
        element:(
          <AuthLayout authentication={true}>
            <UserProfilePage />
          </AuthLayout>
        )
      },
      {
        path:"/history",
        element:(
          <AuthLayout authentication={true}>
              <History/>
          </AuthLayout>
        )
      },
      {
        path:"/upload-video",
        element:(
          <AuthLayout authentication={true}>
            <UploadVideo/>
          </AuthLayout>
        )
      },
      {
        path:"/update-account",
        element:(
          <AuthLayout authentication={true}>
            <UpdateAccount/>
          </AuthLayout>
        )
      },
      {
        path:"/update-Avatar",
        element:(
          <AuthLayout authentication={true}>
            <UpdateAvatar/>
          </AuthLayout>
        )
      },
      {
        path:"/update-coverImage",
        element:(
          <AuthLayout authentication={true}>
            <UpdateCoverImage/>
          </AuthLayout>
        )
      },
      {
        path:"/user-playlists",
        element:(
          <AuthLayout authentication={true}>
              <PlaylistPage/>
          </AuthLayout>
        )
      },
      {
        path:"/search",
        element:(
          <AuthLayout authentication={true}>
            <SearchPage/>
          </AuthLayout>
        )
      }
    ]
  },
]);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes (optional config)
      refetchOnWindowFocus: false, // Optional: prevents refetching when clicking tabs
    },
  },
})
// function App() {
//   // const dispatch = useDispatch();

//   // useEffect(() => {
//   //   dispatch(fetchCurrentUser());
//   // }, [dispatch]);

//   return (
    
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//          <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: "#333",
//               color: "#fff",
//             },
//           }}
//         />
//         <RouterProvider router={router} />
//       </QueryClientProvider>
//     </Provider>
//   )

// }
function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
       <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App
