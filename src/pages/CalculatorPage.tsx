import React, { useState } from 'react';
import { Layout } from 'antd';
import CalculationList from '../components/CalculationList';
import CalculationForm from '../components/CalculationForm';
import CalculationDetail from '../components/CalculationDetail';
import { useQueryClient } from 'react-query';
import { Calculation } from '../models';

const { Sider, Content } = Layout;

const CalculatorPage = () => {
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedCalculation, setSelectedCalculation] = useState<any>(null);

  const handleSelectCalculation = async (id: number) => {
    const selectedData = queryClient.getQueryData<Calculation[]>(['calculations'])?.find(calc => calc.id === id);
    if (selectedData) {
      setSelectedCalculation(selectedData);
      setCurrentView('detail');
    }
  };

  const handleNewCalculation = () => {
    setCurrentView('new');
  };

  const handleCalculationCreated = (newCalculation: Calculation) => {
    setSelectedCalculation(newCalculation); // Update the selected calculation with the new one
    setCurrentView('detail'); // Switch to the detail view
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} style={{ background: '#fff' }}>
        <CalculationList onSelect={handleSelectCalculation} onNewCalculation={handleNewCalculation} />
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        {currentView === 'new' && <CalculationForm onCalculationCreated={handleCalculationCreated} />}
        {currentView === 'detail' && selectedCalculation && (
          <CalculationDetail calculationId={selectedCalculation.id} />
        )}
      </Content>
    </Layout>
  );
};

export default CalculatorPage;
