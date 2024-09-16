import React, { useState } from 'react';
import { Box, Group, Title, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

const ColorFilter = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#FF8C33'];

  return (
    <Box mt={20} mb={20} p={5}>
      <Title order={3} size="h3">
        Renk Filtresi
      </Title>
      <Group>
        {colors.map((color) => (
          <Box
            key={color}
            style={{
              backgroundColor: color,
              width: 35,
              height: 35,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              border: selectedColor === color ? '2px solid #000' : 'none',
            }}
            onClick={() => setSelectedColor(color)}
          >
            {selectedColor === color && (
              <Text style={{ color: 'white', fontSize: '20px' }}><IconCheck/></Text>
            )}
          </Box>
        ))}
      </Group>
    </Box>
  );
};

export default ColorFilter;
