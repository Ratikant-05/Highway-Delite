import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Experience {
  _id: string;
  title: string;
  location: string;
  content: string;
  price: number;
  image?: string;
}


interface HomePageProps {
  searchQuery?: string;
}

const GetExperience: React.FC<HomePageProps> = ({ searchQuery = "" }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const goToDetailsPage = (id: string) => {
    navigate(`/details/${id}`);
  };


  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get("http://localhost:5555/api/getExperiences");
        setExperiences(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return experiences;
    return experiences.filter((exp) => exp.title?.toLowerCase().includes(q));
  }, [experiences, searchQuery]);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-8xl mx-auto p-[60px] cursor-pointer">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {filteredExperiences.map((exp) => (
          <div
            onClick={()=>goToDetailsPage(exp._id)}
            key={exp._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="h-48 w-full overflow-hidden">
              {exp.image ? (
                <img
                  src={`http://localhost:5555${exp.image}`}
                  alt={exp.title}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">
                  {exp.title}
                </h2>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                  {exp.location}
                </span>
              </div>

              <p className="text-gray-600 text-sm mt-2 leading-snug">
                Curated small-group experience. Certified guide. Safety first
                with gear included.
              </p>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-700">
                  From{" "}
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{exp.price}
                  </span>
                </p>
                <button onClick={()=>goToDetailsPage(exp._id)} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm px-3 py-1.5 rounded-sm transition-colors cursor-pointer">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetExperience;
