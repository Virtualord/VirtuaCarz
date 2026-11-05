import { Navigate, useParams } from "react-router-dom";

/**
 * The vehicle editor lives at /car-details/:id. Keep the legacy
 * /edit-car/:id route working by redirecting to the canonical page.
 */
const EditCar = () => {
  const { id } = useParams();
  return <Navigate to={id ? `/car-details/${id}` : "/all-cars"} replace />;
};

export default EditCar;
