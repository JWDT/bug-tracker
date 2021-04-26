import { Flex, Box, Heading, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';

import { InputField } from '../../components/InputField';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';
import { createUrqlClient } from '../../utils/createUrqlClient';

const ChangePassword: NextPage = ({ token }) => {
	const router = useRouter();
	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState();
	return (
		<Flex
			flex="1"
			bg="black"
			alignItems="center"
			style={{
				backgroundImage: `url("http://localhost:3000/background.png")`,
				backgroundSize: '100%',
			}}
		>
			<Box ml="auto" mr="auto" bg="white" borderRadius={8}>
				<Box
					p={8}
					maxWidth="500px"
					borderWidth={1}
					borderRadius={8}
					bg="white"
					boxShadow="lg"
				>
					<Box backgroundColor="white" p={1} borderRadius={10}>
						<Box textAlign="center">
							<Heading>Change Password</Heading>
						</Box>

						<Box my={4} textAlign="left">
							<Formik
								initialValues={{ newPassword: '', repeatPassword: '' }}
								onSubmit={async (values, { setErrors }) => {
									const response = await changePassword({
										options: values,
										token,
									});
									if (response.data?.changePassword.errors) {
										const errorMap = toErrorMap(
											response.data.changePassword.errors
										);
										setErrors(errorMap);
										if ('token' in errorMap) {
											setTokenError(errorMap.token);
										}
									} else if (response.data?.changePassword.user) {
										router.push('/');
									}
								}}
							>
								{({ isSubmitting }) => (
									<Form>
										<Box mt={4}>
											<InputField
												name="newPassword"
												placeholder="password"
												label="New Password:"
												type="password"
											/>
										</Box>

										<Box mt={4}>
											<InputField
												name="repeatPassword"
												placeholder="password"
												label="Repeat Password:"
												type="password"
											/>
										</Box>
										{tokenError ? (
											<Flex>
												<Box color="red" mr={1}>
													{tokenError}
												</Box>
												{/* <NextLink href="/forgot-password">
													<Link>Click here to get a new token.</Link>
												</NextLink> */}
											</Flex>
										) : null}

										<Button
											width="full"
											colorScheme="teal"
											mt={10}
											type="submit"
											isLoading={isSubmitting}
										>
											change password
										</Button>
									</Form>
								)}
							</Formik>
						</Box>
					</Box>
				</Box>
			</Box>

			<style global jsx>{`
				html,
				body,
				body > div:first-child,
				div#__next,
				div#__next > div {
					height: 100%;
				}
			`}</style>
		</Flex>
	);
};

ChangePassword.getInitialProps = ({ query }) => {
	return {
		token: query.token as string,
	};
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
