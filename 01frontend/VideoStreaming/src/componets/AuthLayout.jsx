import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();

  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
        if (isLoading) return;
        if (authentication && !isAuthenticated) {
        navigate("/login", { replace: true });
        }
        if (!authentication && isAuthenticated) {
        navigate("/", { replace: true });
        }
    }, [authentication, isAuthenticated, isLoading, navigate]);
    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-lg font-semibold">Loading...</h1>
        </div>
        );
    }

    return <>{children}</>;
}
