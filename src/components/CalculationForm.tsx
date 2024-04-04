import React from 'react';
import { Form, Input, Button, notification, Typography } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import { Calculation } from '../models';

// Async function to post a new calculation
const postCalculation = async (values: { expression: string }) => {
  const response = await fetch('http://localhost:8000/api/calculations/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

interface CalculationFormProps {
  onCalculationCreated: (newCalculation: Calculation) => void;
}

const CalculationForm = ({ onCalculationCreated }: CalculationFormProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation(postCalculation, {
    onSuccess: (data) => {
      form.resetFields();
      queryClient.invalidateQueries('calculations');
      onCalculationCreated(data);
    },
    onError: (error: Error) => {
      notification.error({ message: `Error: ${error.message}` });
    },
  });

  const handleSubmit = (values: { expression: string }) => {
    mutate(values);
  };

  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <Typography.Paragraph>
          Please enter a calculation using numbers and basic arithmetic operators (+, -, *, /). 
          Example: "10 * (2 + 3)".
        </Typography.Paragraph>
      </div>
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSubmit}
          initialValues={{ expression: '' }}
          style={{ maxWidth: '600px', width: '100%' }}
        >
          <Form.Item
            name="expression"
            rules={[{ required: true, message: 'Please input your calculation!' }]}
          >
            <Input placeholder="Enter calculation" style={{ width: 300, marginRight: '1rem' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              Calculate
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CalculationForm;
