const PointDetails = ({ point, onClose }) => {
  if (!point) return null;

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h3 className="font-bold mb-2">{point.country_id}</h3>
      <p>Date: {point.acq_date}</p>
      <p>Time: {point.acq_time}</p>
      <p>Brightness: {point.bright_ti4}</p>
    </div>
  );
};