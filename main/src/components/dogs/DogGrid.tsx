import { Dog } from "../../types";
import DogCard from "./DogCard";
import { strings } from "../../constants/strings";

interface DogGridProps {
  dogs: Dog[];
  loading: boolean;
}

const DogGrid = ({ dogs, loading }: DogGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/*loading skeleton*/}

        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
              <div className="grid grid-cols-2 gap-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <div className="text-center py-10">
        <i className="bx bx-sad text-2xl flex items-center justify-center"></i>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {strings.search.notFound}
        </h3>
        <p className="mt-1 text-gray-500">{strings.search.adjustFilter}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </div>
  );
};

export default DogGrid;
