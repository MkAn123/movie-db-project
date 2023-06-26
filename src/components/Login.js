import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography,
} from '@mui/material';
import { Formik } from 'formik';
import { login } from '../service';
import { useDispatch } from 'react-redux';
import { setSessionId, setUserData } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const dispatch = useDispatch();

	const navigate = useNavigate();
	return (
		<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
			<Typography marginTop={'30px'} variant={'h2'}>
				Login
			</Typography>
			<div>
				<Formik
					initialValues={{ username: '', password: '' }}
					validate={(values) => {
						const errors = {};
						if (!values.username) {
							errors.username = 'Required';
						}
						if (!values.password) {
							errors.password = 'Required';
						}
						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						login(values.username, values.password).then((res) => {
							if (res.session_id) {
								dispatch(setSessionId(res.session_id));
								dispatch(setUserData(res.userdata));
								localStorage.setItem(
									'session_id',
									res.session_id
								);
								localStorage.setItem(
									'userdata',
									JSON.stringify(res.userdata)
								);
								navigate('/', { replace: true });
							}
						});
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
						/* and other goodies */
					}) => (
						<form onSubmit={handleSubmit}>
							<Box marginTop={'25px'} width={'40vw'}>
								<TextField
									fullWidth
									error={errors['username']}
									helperText={
										errors['username']
											? 'Username is required'
											: ''
									}
									type="text"
									name="username"
									label={'Username'}
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.email}
								/>
							</Box>
							<Box marginTop={'25px'} width={'40vw'}>
								<TextField
									fullWidth
									error={errors['password']}
									helperText={
										errors['password']
											? 'password is required'
											: ''
									}
									type="password"
									name="password"
									label={'Password'}
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
							</Box>
							<Box
								width={'40vw'}
								marginTop={'30px'}
								textAlign={'center'}
							>
								{isSubmitting ? (
									<CircularProgress />
								) : (
									<Button
										fullWidth
										variant={'contained'}
										type="submit"
									>
										Login
									</Button>
								)}
							</Box>
						</form>
					)}
				</Formik>
			</div>
		</Box>
	);
}
