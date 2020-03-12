import  { useState, useEffect } from 'react';

const useFetch = (url, options, callback) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        callback(json.results);
        setResponse(json);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [url]);
  return { response, error };
};

export default useFetch;