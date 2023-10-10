import {useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {Badge, Col, Row} from 'reactstrap';
import logo from '../../assets/img/brand/f4.png';
import cartEmptyimage from '../../assets/img/cart-empty.png';
// reactstrap components

// API
import cartApi from '../../api/cartApi';
import {Autocomplete, Avatar, Burger, Button, Menu, rem} from '@mantine/core';
import {IconLayoutDashboard, IconLogout2, IconSchoolBell, IconSearch, IconUserBolt} from '@tabler/icons-react';
import {useDisclosure, useElementSize} from '@mantine/hooks';

// css module
import styles from '../../assets/css/customClientCss/Navbar.module.css';
// import "../../assets/css/customClientCss/navbar-custom.css";

const PUBLIC_IMAGE = process.env.REACT_APP_IMAGE_URL;

// Styled component
// const NavbarCustom = styled.nav`
//   clear: both;
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   background: #fff;
//   box-shadow: #63636333 2px 2px 8px 0px;
//   z-index: 1000;
//   transition: all 0.3s linear;
// `;

// const CustomNavLink = styled.div`
//   position: relative;
//   color: #555555 !important;
//   font-size: 18px;
//   font-weight: 600 !important;
//   transition: all 0.3s linear;

//   &:hover {
//     color:#212121,
//     font-weight:600,
//   }

//   &:hover {
//     &::after {
//       display: block;
//       transition: all 0.3s linear;
//     }
//   }

//   .active {
//     &::after {
//     display: block;
//     }
//   }

//   &::after {
//     position: absolute;
//     content: "";
//     left: 0;
//     bottom: -58%;
//     background: #333;
//     height: 4px;
//     width: 100%;
//     display: none;
//     transition: all 0.3s linear;
//   }

//   @media (max-width: 991px) {
//     &::after {
//       position: absolute;
//       content: "";
//       left: 50%;
//       transform: translateX(-50%);
//       right: 0;
//       bottom: 0;
//       background: #333;
//       height: 5px;
//       width: 100px;
//       text-align: center;
//       transition: all 0.3s linear;
//     }
//   }

//   @media (max-width: 991px) {
//     & {
//       position: relative;
//       color: #555555 !important;
//       font-size: 18px;
//       margin-bottom: 10px;
//       font-weight: 600 !important;
//       transition: all 0.3s linear;
//     }
//   }
// `;

const ClientNavbar = () => {
	const ref = useElementSize();
	const [login, setLogin] = useState(false);
	const [cartEmpty, setCartEmpty] = useState(true);
	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [activeItems, setActiveItems] = useState([false, false, false]);
	const [opened, {toggle}] = useDisclosure(false);
	// const [homeActive, setHomeActive] = useState("");
	// const [cartActive, setCartActive] = useState("");
	// const [courseActive, setCourseActive] = useState("");
	// const [searchParams] = useSearchParams();

	// *************** CART VARIABLE - AREA START
	const [carts, setCarts] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);

	// useEffect(() => {

	// }, [searchParams]);

	const fetchCart = async () => {
		try {
			const resp = await cartApi.getAllCart();
			setCarts(resp.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// get Total Price from list totalCartItem
		let newTotalPrice = 0;
		if (carts) {
			carts.map((item) => (newTotalPrice += item.course.coursePrice));
			setTotalPrice(newTotalPrice);
		}
	}, [carts]);

	useEffect(() => {
		fetchCart();
	}, []);

	// *************** CART VARIABLE - AREA END
	const handleItemClick = (index) => {
		const newActiveItems = [...activeItems];
		newActiveItems[index] = true;
		for (let i = 0; i < newActiveItems.length; i++) {
			if (i !== index) {
				newActiveItems[i] = false;
			}
		}
		setActiveItems(newActiveItems);
	};

	const handleLogin = (prev) => {
		setLogin(!prev);
	};

	const handleCartEmpty = (prev) => {
		setCartEmpty(!prev);
	};

	window.addEventListener('scroll', function () {
		const navbar = this.document.querySelector('#navbarAnimate');
		let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		if (scrollTop === 0) {
			navbar.style.top = '0';
		}
		if (scrollTop > lastScrollTop) {
			navbar.style.top = '-80px';
		} else {
			navbar.style.top = '0';
		}
		setLastScrollTop(scrollTop);
	});

	return (
		<nav
			className={`navbar navbar-expand-lg ${styles.navbarAnimate}`}
			id='navbarAnimate'>
			<div className='container-xl'>
				<Link
					to={'/'}
					className='navbar-brand'>
					<img
						src={logo}
						className='img-fluid'
						alt=''
					/>
				</Link>
				<button
					className='navbar-toggler'
					type='button'
					data-toggle='collapse'
					data-target='#navbarSupportedContent'
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
					style={{zIndex: '99999'}}>
					<Burger
						opened={opened}
						onClick={toggle}
					/>
				</button>
				<div
					className='collapse navbar-collapse text-dark font-weight-600'
					id='navbarSupportedContent'>
					<ul
						className='navbar-nav mr-auto text-center d-md-flex d-sm-flex
                        justify-content-md-center justify-content-sm-center'>
						<li className='nav-item'>
							<Link
								to={'/'}
								className={`
                ${activeItems[0] === true ? 'nav-link custom-nav-link active' : 'nav-link custom-nav-link'}
                ${styles['custom-nav-link']}
                `}
								onClick={() => handleItemClick(0)}>
								Trang chủ
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to={'/course'}
								className={`
                ${activeItems[1] ? 'nav-link custom-nav-link active' : 'nav-link custom-nav-link'}
                ${styles['custom-nav-link']}
                `}
								onClick={() => handleItemClick(1)}>
								Khóa học
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								to={'/cart'}
								className={`
                ${activeItems[2] ? 'nav-link custom-nav-link active' : 'nav-link custom-nav-link'}
                ${styles['custom-nav-link']}
                `}
								onClick={() => handleItemClick(2)}>
								Giỏ hàng
							</Link>
						</li>
					</ul>

					<div
						className='d-flex justify-content-between
              justify-content-md-center justify-content-sm-center text-center text-dark'>
						<Autocomplete
							placeholder='Tìm khóa học..'
							className='mt-1'
							ref={ref}
							style={{width: rem(300)}}
							icon={<IconSearch />}
							data={['NextJS', 'ReactJS', 'PHP, Laravel', 'Spring boot']}
						/>
						{login ? (
							<>
								<Link
									to='/cart'
									className={`${styles.cart} mx-4 mt-2`}>
									<i
										className='bx bx-cart font-weight-500 text-dark'
										style={{
											fontSize: '32px',
										}}></i>
									{/* <ActionIcon variant="transparent">
                    <IconShoppingCart size="2rem" />
                  </ActionIcon> */}
									<Badge
										color='rgba(0, 0, 0, 1)'
										className={`${styles['header-cart']} font-weight-700`}>
										{carts.length > 0 ? carts.length : 0}
									</Badge>
									<div className={styles['cart-detail']}>
										{carts.length === 0 ? (
											<>
												<img
													src={cartEmptyimage}
													alt='cart Empty'
													className='img-fluid'
													onClick={() => handleCartEmpty(cartEmpty)}
												/>
												<p
													className='mx-auto mb-3 text-muted font-weight-600 mx-auto'
													onClick={() => handleCartEmpty(cartEmpty)}>
													Giỏ hàng trống.
												</p>
											</>
										) : (
											<>
												<div className={`container ${styles['cart-content-overflow']} my-2`}>
													<Row>
														<Col
															xl='12'
															lg='12'
															md='12'
															sm='12'>
															{carts.length > 0 &&
																carts.map((cart) => (
																	<>
																		<Row className='mt-2'>
																			<Col
																				xl='4'
																				lg='4'
																				md='4'
																				sm='4'>
																				<img
																					src={`${PUBLIC_IMAGE}/courses/${cart.course.image}`}
																					alt='cart item img'
																					className='img-fluid'
																					style={{
																						maxHeight: '70px',
																						width: '100%',
																						objectFit: 'cover',
																					}}
																				/>
																			</Col>
																			<Col
																				xl='8'
																				lg='8'
																				md='8'
																				sm='8'
																				className='d-flex flex-wrap flex-column text-left'>
																				<span className='font-weight-700 text-dark align-items-start'>{cart.course.courseName}</span>
																				<span className='text-muted'>
																					{cart.course.coursePrice.toLocaleString('it-IT', {
																						style: 'currency',
																						currency: 'VND',
																					})}
																				</span>
																			</Col>
																		</Row>
																		<hr className='m-3 p-0 text-muted' />
																	</>
																))}
														</Col>
													</Row>
												</div>
												<div className={`container ${styles['cart-footer']} w-100`}>
													<p
														className='m-2 p-0 text-dark font-weight-700 text-left'
														style={{fontSize: '20px'}}>
														<span
															className='font-weight-500 mr-2 text-muted'
															style={{fontSize: '17px'}}>
															THANH TOÁN:
														</span>
														<span>
															{totalPrice.toLocaleString('it-IT', {
																style: 'currency',
																currency: 'VND',
															})}
														</span>
													</p>
													<Link
														to={'/cart'}
														className='w-100'>
														<Button
															color='dark'
															className='w-100 mb-3 font-weight-700'
															style={{borderRadius: '3px'}}>
															Tới giỏ hàng
														</Button>
													</Link>
												</div>
											</>
										)}
									</div>
								</Link>

								{/* User menu hover */}
								<Menu
									shadow='md'
									withArrow
									className='mt-1'
									width={200}
									trigger='hover'
									openDelay={100}
									closeDelay={400}>
									<Menu.Target>
										<Avatar
											component='a'
											href='/'
											target='_blank'
											src='https://images.unsplash.com/photo-1695754189990-da05b9433ac4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
											alt="it's me"
											radius={50}
										/>
									</Menu.Target>

									<Menu.Dropdown>
										<Menu.Label>DASHBOARD</Menu.Label>
										<Menu.Item
											icon={<IconLayoutDashboard size={14} />}
											component='a'
											href='/'
											target='_blank'>
											Hệ thống học tập
										</Menu.Item>
										<Menu.Item
											icon={<IconUserBolt size={14} />}
											component='a'
											href='/'
											target='_blank'>
											Tài khoản
										</Menu.Item>
										<Menu.Item
											icon={<IconSchoolBell size={14} />}
											component='a'
											href='/'
											target='_blank'>
											Lịch học
										</Menu.Item>

										<Menu.Divider />

										<Menu.Label>Hệ thống</Menu.Label>
										<Menu.Item
											color='red'
											icon={<IconLogout2 size={14} />}>
											Đăng xuất
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							</>
						) : (
							<>
								<Button
									color='dark'
									uppercase
									className='mt-1 ml-2 font-weight-700'
									onClick={() => handleLogin(login)}
									style={{borderRadius: '2px'}}>
									Đăng nhập
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default ClientNavbar;
