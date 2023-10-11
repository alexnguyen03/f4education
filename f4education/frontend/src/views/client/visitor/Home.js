import { Carousel } from "@mantine/carousel";
import {
  Affix,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  HoverCard,
  Image,
  Rating,
  rem,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import React, { useEffect, useState } from "react";

import heroImage from "../../../assets/img/hero-home.jpg";
import heroImage2 from "../../../assets/img/hero-home-2.jpg";
import {
  IconArrowAutofitRight,
  IconArrowUp,
  IconChevronRightPipe,
  IconShoppingCartPlus,
} from "@tabler/icons-react";
import { useMediaQuery, useWindowScroll } from "@mantine/hooks";
import { breakpoints } from "@mui/system";

// API
import courseApi from "../../../api/courseApi";

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL;

const HeroSlideShow = [
  {
    id: 1,
    title: "Học từ mọi nơi",
    subTitle:
      "Trên ghế dài, ở sân sau hoặc trên đường đi làm. Ứng dụng của chúng tôi cho phép bạn quyết định.",
    image: heroImage,
  },
  {
    id: 2,
    title: "Được hỗ trợ bởi cộng đồng",
    subTitle:
      "Hãy tin tưởng xếp hạng và đánh giá để đưa ra lựa chọn thông minh hơn. Bắt đầu với các khóa học được xếp hạng hàng đầu của chúng tôi.",
    image: heroImage2,
  },
];

const nextLearnCourse = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1696312868237-c563a5e25578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
    courseName: "NextJS & Mantine",
    master: "Nguyen Van A",
    rating: 4.8,
    review: 36,
    coursePrice: "947,150",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1696312868237-c563a5e25578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
    courseName: "NextJS & Mantine",
    master: "Nguyen Van A",
    rating: 4.8,
    review: 36,
    coursePrice: "947,150",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1696312868237-c563a5e25578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
    courseName: "NextJS & Mantine",
    master: "Nguyen Van A",
    rating: 2.8,
    review: 36,
    coursePrice: "947,150",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1696312868237-c563a5e25578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
    courseName: "NextJS & Mantine",
    master: "Nguyen Van A",
    rating: 3.2,
    review: 36,
    coursePrice: "947,150",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1696312868237-c563a5e25578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
    courseName: "NextJS & Mantine",
    master: "Nguyen Van A",
    rating: 4.8,
    review: 36,
    coursePrice: "947,150",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1696312868237-c563a5e25578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
    courseName: "NextJS & Mantine",
    master: "Nguyen Van A",
    rating: 1.3,
    review: 36,
    coursePrice: "947,150",
  },
];

const recommentTopic = [
  {
    title: "Python",
    titleSecond: "ReactJS",
  },
  {
    title: "Khoa học máy tính",
    titleSecond: "NextJS",
  },
  {
    title: "Nghiên cứu AI",
    titleSecond: "JavaScript",
  },
  {
    title: "R (Ngôn ngữ lập trình)",
    titleSecond: "Tư duy lập trình",
  },
  {
    title: "Deep learning",
    titleSecond: "Giải thuật",
  },
  {
    title: "Artificial Intelligence",
    titleSecond: "Cấu trúc dữ liệu",
  },
  {
    title: "Web scrapping",
    titleSecond: "Cấu trúc dữ liệu",
  },
];

const Home = () => {
  // Main Variable
  const [newestCourse, setNewestCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  // Action Variable
  const [showNotification, setShowNotification] = useState({
    status: false,
    message: "",
  });

  const fetchNewestCourse = async () => {
    try {
      setLoading(false);
      const resp = await courseApi.getNewestCourse();

      if (resp.status === 200 && resp.data.length > 0) {
        setNewestCourse(resp.data);
        console.log(resp.data);
      } else {
        setShowNotification({
          status: true,
          message: "Lỗi không lấy được dữ liệu.",
        });
      }
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  // break point
  const HeroImageBreakPoint = useMediaQuery("(max-width: 500px)");

  // Hero Carousel
  const HeroSlides = HeroSlideShow.map((hero) => (
    <Carousel.Slide key={hero.id}>
      <Card
        shadow="sm"
        padding="xl"
        target="_blank"
        style={{
          position: "relative",
        }}
      >
        <Card.Section>
          <Image
            src={hero.image}
            width={HeroImageBreakPoint ? "100%" : "100vw"}
            height={400}
            alt="study now!"
            fit={HeroImageBreakPoint ? "cover" : "contain"}
            ml={HeroImageBreakPoint ? 0 : "xl"}
          />
        </Card.Section>

        <Card.Section
          bg={"#fff"}
          className="p-3 shadow d-none d-md-block d-sm-block"
          style={{
            position: "absolute",
            top: "30%",
            left: "20%",
            transform: "translate(-25%,-30%)",
            maxWidth: "400px",
          }}
        >
          <Text fw={700} weight={500} size="xl">
            {hero.title}
          </Text>

          <Text mt="xs" color={"#343A40"} size="lg">
            {hero.subTitle}
          </Text>
        </Card.Section>
      </Card>
    </Carousel.Slide>
  ));

  // learnext course Carousel
  const LearnNextSlides = newestCourse.map((learn) => (
    <Carousel.Slide key={learn.courseId}>
      <HoverCard width={"100%"} shadow="md" position="bottom">
        {/* Target Hover */}
        <Card className="card-hover-overlay">
          <HoverCard.Target>
            <Card.Section>
              <Image
                src={`${PUBLIC_IMAGE}/courses/${learn.image}`}
                fit="cover"
                width={"100%"}
                height={150}
                radius="sm"
                withPlaceholder
              />
            </Card.Section>
          </HoverCard.Target>
          <Box>
            <Text fw={500} lineClamp={2} fs="lg">
              {learn.courseName}
            </Text>
            <Text fw={500} c="dimmed" lineClamp={2} fs="sm">
              {/* {learn.master} */}
              Jonh Macro
            </Text>
            <Box>
              <Flex justify="flex-start" gap="sm">
                <Text>3.7</Text>
                <Group position="center">
                  <Rating value={3.6} fractions={2} readOnly />
                </Group>
                <Text c="dimmed">({39})</Text>
              </Flex>
            </Box>
            <Box>
              <Text fw={500}>
                {learn.coursePrice.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </Box>
          </Box>
        </Card>

        {/* Value hover */}
        <HoverCard.Dropdown>
          <Button
            color="grape"
            variant="light"
            className="w-100"
            // onClick={() => handleAddCart(course)}
            leftIcon={<IconShoppingCartPlus size="1rem" />}
          >
            Thêm vào giỏ hàng
          </Button>
          <Text c="dimmed">
            Giá khóa học:
            <Text fw="500">
              {learn.coursePrice.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Carousel.Slide>
  ));

  // recommentTopic
  const recommentTopicSlides = recommentTopic.map((learn) => (
    <Carousel.Slide key={learn.id}>
      <Card className="card-hover-overlay">
        <Card.Section>
          <Flex direction="column" wrap="wrap">
            <Button
              variant="outline"
              color="dark"
              radius="xs"
              size="md"
              mb="lg"
              w={170}
            >
              <Text color="dark">{learn.title}</Text>
            </Button>
            <Button
              variant="outline"
              color="dark"
              radius="xs"
              size="md"
              w={170}
            >
              <Text color="dark">{learn.titleSecond}</Text>
            </Button>
          </Flex>
        </Card.Section>
      </Card>
    </Carousel.Slide>
  ));

  // UseEffect AREA
  useEffect(() => {
    fetchNewestCourse();
  }, []);

  return (
    <>
      {/* Mantine Hero Carousel */}
      <Box my={rem("5rem")}>
        <Carousel
          slideSize="100%"
          height="400px"
          slideGap="lg"
          controlsOffset="xs"
          align="start"
          loop
          dragFree
          withIndicators
          slidesToScroll={1}
          styles={{
            control: {
              background: "#212121",
              color: "#fff",
            },
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
            indicator: {
              width: rem(12),
              height: rem(4),
              transition: "width 250ms ease",

              "&[data-active]": {
                width: rem(40),
              },
            },
          }}
        >
          {HeroSlides}
        </Carousel>
      </Box>

      {/* wwhat learn nexxt */}
      <Box mt={rem("5rem")}>
        <Title order={1} mt="lg" fw={700} color="dark">
          Tiếp theo học gì
        </Title>
        <Text size={"xl"} c="dimmed" maw={600} mb="md">
          Chúng tôi có những khóa học mới nhất và chất lượng nhất
        </Text>
        <Box>
          <Carousel
            slideSize="20%"
            height="400px"
            slideGap="lg"
            controlsOffset="xs"
            align="start"
            loop
            dragFree
            slidesToScroll={breakpoints ? 3 : 1}
            styles={{
              control: {
                background: "#212121",
                color: "#fff",
                fontSize: rem(25),
                "&[data-inactive]": {
                  opacity: 0,
                  cursor: "default",
                },
              },
            }}
          >
            {LearnNextSlides}
          </Carousel>
        </Box>
      </Box>

      {/* Top sell course*/}
      <Box>
        <Title order={1} mt="lg" fw={700} color="dark">
          Những khóa học bán chạy nhất
        </Title>
        <Box>
          <Carousel
            slideSize="20%"
            height="400px"
            slideGap="lg"
            controlsOffset="xs"
            align="start"
            loop
            dragFree
            slidesToScroll={breakpoints ? 3 : 1}
            styles={{
              control: {
                background: "#212121",
                color: "#fff",
                fontSize: rem(25),
                "&[data-inactive]": {
                  opacity: 0,
                  cursor: "default",
                },
              },
            }}
          >
            {LearnNextSlides}
          </Carousel>
        </Box>
      </Box>

      {/* Topic recomment*/}
      <Box my={rem("5rem")}>
        <Title order={1} mt="lg" fw={700} color="dark" mb="lg">
          Những chủ đề gợi ý cho bạn
        </Title>
        <Box>
          <Carousel
            slideSize="20%"
            height={"auto"}
            slideGap="lg"
            controlsOffset="xs"
            align="start"
            dragFree
            slidesToScroll={breakpoints ? 3 : 1}
            styles={{
              control: {
                background: "#212121",
                color: "#fff",
                fontSize: rem(25),
                "&[data-inactive]": {
                  opacity: 0,
                  cursor: "default",
                },
              },
            }}
          >
            {recommentTopicSlides}
          </Carousel>
        </Box>
      </Box>

      {/* Other section */}
      <Box my={rem("5rem")} bg="#10162f" p={rem("2rem")}>
        <Grid grow>
          <Grid.Col xl={6} lg={6} md={12} sm={12}>
            <Box>
              <Title
                order={1}
                color="#fff"
                fw={700}
                mx={"auto"}
                align={"center"}
                maw={300}
              >
                Gia nhập với chúng tôi ngay.
              </Title>
            </Box>
          </Grid.Col>
          <Grid.Col xl={6} lg={6} md={12} sm={12}>
            <Group position="apart">
              <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
              >
                <Title order={1} color="#fff" fw={700}>
                  1M
                </Title>
                <Text color="#fff" fw={700}>
                  Học viên
                </Text>
              </Flex>
              <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
              >
                <Title order={1} color="#fff" fw={700}>
                  10+
                </Title>
                <Text color="#fff" fw={700}>
                  Quốc gia
                </Text>
              </Flex>
              <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
              >
                <Title order={1} color="#fff" fw={700}>
                  100+
                </Title>
                <Text color="#fff" fw={700}>
                  Khóa học
                </Text>
              </Flex>
            </Group>
          </Grid.Col>
        </Grid>
      </Box>

      <Box my={rem("5rem")} p={rem("2rem")}>
        <Flex direction={"column"} justify="center" align={"center"}>
          <Title order={1} color="dark" mx={"auto"}>
            Bắt đầu và nâng cao kỹ năng của bạn
          </Title>
          <Text
            color="dimmed"
            align="center"
            maw={500}
            mx={"auto"}
            my={rem("1.5rem")}
          >
            Cung cấp những khóa học lập trình, kiến thức bạn cần để có thể học
            tập và đi làm chỉ trong 9 tháng.
          </Text>
          <Button variant="outline" color="dark" size="lg" uppercase>
            Đăng ký ngay
          </Button>
        </Flex>
      </Box>

      <Box my={rem("5rem")} p={rem("2rem")}>
        <Flex direction={"column"} justify="center" align={"center"}>
          <Text
            color="dimmed"
            align="center"
            maw={500}
            mx={"auto"}
            my={rem("1.5rem")}
          >
            Cần hỗ trợ, liên hệ cho chúng tôi ngay bây giờ.
          </Text>
          <Title
            order={1}
            color="dark"
            mx={"auto"}
            component="a"
            href="mailTo:tronghientran18@gmail.com"
          >
            F4 Education <IconArrowAutofitRight />
          </Title>
        </Flex>
      </Box>

      {/* Affix Button */}
      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              color="violet"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              <IconArrowUp size="1rem" />
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
};
export default Home;
