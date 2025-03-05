// @ts-nocheck
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onChange, size = "text-3xl" }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-2">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <FaStar className={`${star <= rating ? "text-yellow-500" : "text-gray-400"} ${size}`} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
