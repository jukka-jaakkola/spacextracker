import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SpaceXLaunchTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [nextLaunch, setNextLaunch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaunchData().catch(error => console.error("Error in useEffect", error));
  }, []);

  const Button = ({ children, className }) => (
      <button className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${className}`}>
        {children}
      </button>
  );

  const Card = ({ children, className }) => (
      <div className={`border border-gray-300 rounded-lg p-4 shadow-md ${className}`}>{children}</div>
  );

  const CardContent = ({ children, className }) => <div className={className}>{children}</div>;

  const fetchLaunchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/spacex/launches");
      const upcomingResponse = await axios.get("http://localhost:8080/api/spacex/upcoming");

      setLaunches(response.data);
      setNextLaunch(upcomingResponse.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching SpaceX data", error);
      setLoading(false);
    }
  };

  return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🚀 SpaceX Launch Tracker</h1>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <>
              {nextLaunch && (
                  <Card className="mb-6">
                    <CardContent className="p-4">
                      <h2 className="text-xl font-semibold">Next Launch: {nextLaunch.name}</h2>
                      <p>Date: {new Date(nextLaunch.date_utc).toLocaleString()}</p>
                      <Button asChild className="mt-2">
                        <a href={nextLaunch.links?.webcast} target="_blank" rel="noopener noreferrer">
                          Watch Live
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
              )}

              <h2 className="text-2xl font-bold my-4">Past Launches Success Rate</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={launches.map(l => ({ name: l.name, success: l.success ? 1 : 0 }))}>
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="success" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </>
        )}
      </div>
  );
};

export default SpaceXLaunchTracker;

