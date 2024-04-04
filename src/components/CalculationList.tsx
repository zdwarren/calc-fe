import React from 'react';
import { useQuery } from 'react-query';
import { List, Button, Spin } from 'antd';
import { Calculation } from '../models';

const fetchCalculations = async () => {
  const response = await fetch('http://localhost:8000/api/calculations/');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

interface CalculationListProps {
  onSelect: (id: number) => void;
  onNewCalculation: () => void;
}

const CalculationList = ({ onSelect, onNewCalculation }: CalculationListProps) => {
  // Define a state to control the refetch interval
  const [shouldPoll, setShouldPoll] = React.useState(false);

  const { data: calculations, isLoading, error, refetch } = useQuery<Calculation[]>(
    'calculations',
    async () => {
      const fetchedData = await fetchCalculations();
      // Reverse sort the calculations by ID so the largest ID is first
      return fetchedData.sort((a: Calculation, b: Calculation) => b.id - a.id);
    },
    {
      // Use a function to dynamically determine the refetchInterval
      refetchInterval: shouldPoll ? 5000 : false, // Poll every 5 seconds if shouldPoll is true
      onSuccess: (data) => {
        // Check if any calculations are in the "processing" state
        const isProcessing = data.some(calc => calc.status === 'processing' || calc.status === 'pending');
        setShouldPoll(isProcessing);
      }
    }
  );

  React.useEffect(() => {
    // Refetch immediately when the component mounts to ensure fresh data
    refetch();
  }, [refetch]);

  if (isLoading) return <span>Loading...</span>;
  if (error instanceof Error) return <span>Error: {error.message}</span>;

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={onNewCalculation}>New Calculation</Button>
      <List
        itemLayout="horizontal"
        dataSource={calculations}
        renderItem={item => (
          <List.Item 
            onClick={() => onSelect(item.id)} 
            style={{ position: 'relative', cursor: 'pointer' }} // Add cursor style here
          >
            <List.Item.Meta
              title={<p style={{ marginTop: 0, marginBottom: 0 }}>{`Calculation #${item.id}`}</p>} // Reduce space by adjusting marginBottom
              description={
                <div style={{ lineHeight: '0.5' }}> {/* Adjust lineHeight for tighter spacing */}
                  <p style={{ marginBottom: 4 }}>{item.expression}</p> {/* Adjust marginBottom for less space */}
                  {item.result
                    ? <p style={{ marginBottom: 0 }}>{item.result}</p> // Adjust marginBottom for less space
                    : <Spin style={{ marginTop: 6 }} size="small" />}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CalculationList;
