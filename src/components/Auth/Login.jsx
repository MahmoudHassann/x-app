import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { signIn } from "../../redux/slices/user-slice";
import { Link } from "react-router-dom";
export default function Login() {
  let dispatch = useDispatch();
  const SigninSchema = Yup.object().shape({
    email: Yup.string()
      .email("* In-Valid Email")
      .required("* Email Is Required"),
    password: Yup.string().required("* Password Is Required"),
  });

  const handleSignIn = async (values) => {
    const { email, password } = values;
    let userData = {
      email,
      password,
    };
    dispatch(signIn(userData));
  };
  return (
    <div className="form-parent">
      <div className="form-auth">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SigninSchema}
          onSubmit={handleSignIn}
        >
          {({ errors, touched }) => (
            <Form>
              <h1>My account</h1>

              <div className="form-floating">
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  className={`form-control ${
                    touched.email && errors.email ? "is-invalid" : ""
                  }`}
                />
                <label htmlFor="email">Email address</label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-floating">
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className={`form-control ${
                    touched.password && errors.password ? "is-invalid" : ""
                  }`}
                />
                <label htmlFor="password">Password</label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <button className="btn-auth" type="submit">
                log in
              </button>
              <div className="divider"></div>
              <div className="new_account mt-2">
                <h4>Become a member</h4>
                <div className="create">
                  <p className="obligated">
                    Registration is not <br /> obligated.
                  </p>
                  <Link className="btn-register" to="/register">
                    create an account
                  </Link>
                </div>
              </div>

              <p className="mt-5 mb-3 text-muted">&copy; 2023–2024</p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
