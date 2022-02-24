import Form, {Input} from './Form';
import Button from './Button';

const Login = ({submitForm, errors}) => {
    return (
        <div className="panel mx-auto w-4/5 shadow-lg md:w-1/4 px-10 py-8">
            <h1 className="text-4xl font-grotesk mb-4">Sign In</h1>
            <Form onSubmit={submitForm} >
                {[
                    <Input
                        key='username'
                        id='username'
                        error={errors.username}
                        validate={{
                            required: 'This field is required',
                            maxLength: {value: 50, message: 'Too Long'}
                        }}
                    />,
                    <Input
                        key='password'
                        id='password'
                        error={errors.password}
                        type='password'
                        validate={{
                            required: 'This field is required',
                            maxLength: {value: 50, message: 'Too Long'}
                        }}
                    />,
                ]}
                <Button classList="bg-success w-full text-2xl leading-none" type='submit' label="Login"/>
            </Form>
        </div>
    )

}

export default Login;