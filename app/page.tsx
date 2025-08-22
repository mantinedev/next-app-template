import { Container, Title, Text, Button, Stack, Box, Card, Group } from '@mantine/core';

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <Box bg="white" py="md" style={{ borderBottom: '1px solid #e9ecef' }}>
        <Container size="lg">
          <Group justify="space-between" align="center">
            <Title order={2} c="green.7">
              청심한의원
            </Title>
            <Button color="green" variant="filled">
              예약문의
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box bg="green.6" c="white" py={80}>
        <Container size="lg">
          <Stack align="center" ta="center" gap="md">
            <Title size={48} fw={700}>
              마음과 몸을 치유하는
            </Title>
            <Title size={48} fw={700} c="green.2">
              청심한의원
            </Title>
            <Text size="xl" maw={600}>
              개인별 체질진단을 통한 맞춤형 치료로 근본적인 건강회복을 도와드립니다.
            </Text>
            <Button size="lg" variant="white" color="green" mt="xl">
              진료 예약하기
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Services Section */}
      <Container size="lg" py={80}>
        <Stack align="center" gap="md" mb={50}>
          <Title order={2} ta="center">
            진료과목
          </Title>
          <Text c="dimmed" ta="center" size="lg">
            환자 개개인의 체질과 증상에 맞는 맞춤형 치료
          </Text>
        </Stack>

        <Group justify="center" gap="xl">
          <Card shadow="md" padding="lg" radius="md" withBorder maw={300}>
            <Stack align="center" ta="center" gap="md">
              <Title order={4}>내과 질환</Title>
              <Text c="dimmed" size="sm">
                소화불량, 만성피로, 면역력 저하, 수면장애 등 내과적 증상을 한방으로 치료합니다.
              </Text>
            </Stack>
          </Card>

          <Card shadow="md" padding="lg" radius="md" withBorder maw={300}>
            <Stack align="center" ta="center" gap="md">
              <Title order={4}>부인과 질환</Title>
              <Text c="dimmed" size="sm">
                생리불순, 갱년기 증상, 불임, 산후조리 등 여성 건강을 전문적으로 관리합니다.
              </Text>
            </Stack>
          </Card>

          <Card shadow="md" padding="lg" radius="md" withBorder maw={300}>
            <Stack align="center" ta="center" gap="md">
              <Title order={4}>한방 다이어트</Title>
              <Text c="dimmed" size="sm">
                체질별 맞춤 다이어트로 건강한 체중감량과 체형관리를 도와드립니다.
              </Text>
            </Stack>
          </Card>
        </Group>
      </Container>

      {/* Contact Section */}
      <Box bg="gray.0" py={80}>
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Title order={2} ta="center">
              진료시간 & 연락처
            </Title>
            
            <Group justify="center" gap="xl" align="flex-start">
              <Card shadow="md" padding="lg" radius="md" withBorder maw={400}>
                <Stack gap="md">
                  <Title order={3}>진료시간</Title>
                  <Group justify="space-between">
                    <Text fw={500}>평일</Text>
                    <Text>오전 9:00 - 오후 6:00</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>토요일</Text>
                    <Text>오전 9:00 - 오후 2:00</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>점심시간</Text>
                    <Text>오후 12:30 - 오후 1:30</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500} c="red">휴진일</Text>
                    <Text c="red">일요일, 공휴일</Text>
                  </Group>
                </Stack>
              </Card>

              <Card shadow="md" padding="lg" radius="md" withBorder maw={400}>
                <Stack gap="md">
                  <Title order={3}>연락처</Title>
                  <Group>
                    <Stack gap={4}>
                      <Text fw={500}>전화번호</Text>
                      <Text c="dimmed">02-1234-5678</Text>
                    </Stack>
                  </Group>
                  <Group>
                    <Stack gap={4}>
                      <Text fw={500}>주소</Text>
                      <Text c="dimmed">서울특별시 강남구 테헤란로 123</Text>
                    </Stack>
                  </Group>
                  <Group>
                    <Stack gap={4}>
                      <Text fw={500}>예약 문의</Text>
                      <Text c="dimmed">온라인 예약 또는 전화 예약 가능</Text>
                    </Stack>
                  </Group>
                </Stack>
              </Card>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="dark" c="white" py={40}>
        <Container size="lg">
          <Stack align="center" gap="md">
            <Title order={3} c="green.4">
              청심한의원
            </Title>
            <Text c="gray.4" ta="center">
              전통 한의학의 지혜로 현대인의 건강을 지키는 청심한의원입니다.
            </Text>
            <Text c="gray.5" size="sm">
              © 2024 청심한의원. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
}