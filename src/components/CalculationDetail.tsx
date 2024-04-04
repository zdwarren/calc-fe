import React from 'react';
import { useQuery } from 'react-query';
import { Descriptions, Typography, Spin, Tag } from 'antd';
import { Calculation } from '../models';

const fetchCalculationDetail = async (calculationId: number): Promise<Calculation> => {
  const response = await fetch(`http://localhost:8000/api/calculations/${calculationId}/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

interface CalculationDetailProps {
  calculationId: number;
}

const CalculationDetail: React.FC<CalculationDetailProps> = ({ calculationId }) => {
  const { data: calculation, isLoading, error, refetch } = useQuery<Calculation, Error>(
    ['calculation', calculationId],
    () => fetchCalculationDetail(calculationId),
  );

  React.useEffect(() => {
    // Define a function to conditionally refetch based on calculation status
    const refetchIfProcessing = () => {
      if (calculation?.status === 'processing') {
        refetch();
      }
    };

    // If the calculation is in 'processing' status, set an interval to refetch
    if (calculation?.status === 'processing') {
      const intervalId = setInterval(refetchIfProcessing, 5000);
      return () => clearInterval(intervalId); // Clear the interval on cleanup
    }
  }, [calculation, refetch]); // Depend on calculation and refetch function

  // Function to determine the color of the status tag based on the calculation status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'error':
        return 'red';
      case 'success':
        return 'green';
      case 'pending':
      case 'processing':
        return 'orange';
      default:
        return 'default';
    }
  };

  if (isLoading) return <Spin tip="Loading..." />;
  if (error) return <div>Error: {error.message}</div>;
  if (!calculation) return <div>No calculation found.</div>;

  return (
    <div style={{ width: '600px', margin: 'auto' }}>
      <Typography.Title level={4}>Calculation Detail</Typography.Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Expression">{calculation.expression}</Descriptions.Item>
        <Descriptions.Item label="Result">{calculation.result}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(calculation.status)}>{calculation.status.toUpperCase()}</Tag>
          {(calculation.status === 'processing' || calculation.status === 'pending') && <Spin size="small" />}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">{new Date(calculation.created_at).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Started At">{calculation.started_at ? new Date(calculation.started_at).toLocaleString() : 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Finished At">{calculation.finished_at ? new Date(calculation.finished_at).toLocaleString() : 'N/A'}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CalculationDetail;
