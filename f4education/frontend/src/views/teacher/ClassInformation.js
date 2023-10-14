import {
  Box,
  Card,
  Grid,
  Group,
  Image,
  rem,
  RingProgress,
  Text,
  Title,
} from "@mantine/core";
import React from "react";

// scss
import styles from "../../assets/scss/custom-module-scss/teacher-custom/ClassInformation.module.scss";

const ClassInformation = () => {
  return (
    <>
      <Box mt={rem("5rem")}>
        <Grid>
          <Grid.Col p={rem("0.7rem")} xl={4} lg={4} md={12} sm={12}>
            <Card withBorder padding="lg" styles={styles["box-items"]}>
              <Card.Section>
                <Image
                  src="https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
                  alt="Running challenge"
                  height={100}
                />
              </Card.Section>

              <Group position="apart" mt="xl">
                <Text fz="sm" fw={700}>
                  Running challenge
                </Text>
                <Group position="apart" align={"center"}>
                  <Text fz="xs" c="dimmed">
                    80% completed
                  </Text>
                  <RingProgress
                    size={18}
                    thickness={2}
                    sections={[{ value: 80, color: "blue" }]}
                  />
                </Group>
              </Group>
              <Text mt="sm" mb="md" c="dimmed" fz="xs">
                56 km this month • 17% improvement compared to last month • 443
                place in global scoreboard
              </Text>
              <Card.Section></Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col p={rem("0.7rem")} xl={8} lg={8} md={12} sm={12}>
            <Box className={styles["box-items"]}>
              <Title color={"dark"} fw={700} order={1}>
                Hello overybody
              </Title>
            </Box>
          </Grid.Col>
          <Grid.Col p={rem("0.7rem")} xl={12} lg={12} md={12} sm={12}>
            <Box className={styles["box-items"]}>
              <Title color={"dark"} fw={700} order={1}>
                Hello overybody
              </Title>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
};

export default ClassInformation;
