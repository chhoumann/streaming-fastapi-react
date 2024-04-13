import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const useStreamData = (url: string, shouldFetch: boolean) => {
  const queryClient = useQueryClient();
  const queryKey = ['streamData', url];

  const fetchStreamData = async () => {
    const response = await fetch(url);
    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const str = decoder.decode(value);
      if (str && !str.includes("keep-alive")) {
        try {
          const data = JSON.parse(str);
          console.log(data);
          queryClient.setQueryData<any[]>(queryKey, (oldData = []) => [...oldData, data]);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
  };

  useQuery({
    queryKey,
    queryFn: fetchStreamData,
    enabled: shouldFetch, // Only run the query if shouldFetch is true
    refetchInterval: false,
    initialData: [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const streamData = queryClient.getQueryData<any[]>(queryKey) || [];

  return streamData;
};

const App = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const streamData = useStreamData('http://localhost:8000/', shouldFetch);

  return (
    <div>
      <h1>Streaming Data</h1>
      <button onClick={() => setShouldFetch(true)}>Fetch Data</button>
      <DataDisplay streamData={streamData} />
    </div>
  );
};

const DataDisplay = ({ streamData }: { streamData: any[] }) => (
  <ul>
    {streamData.map((data) => (
      <li key={data.id}>
        Iteration: {data.iteration}, Content: {data.content}
      </li>
    ))}
  </ul>
);

export default App;
