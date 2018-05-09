/*global google*/
import * as React from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
import { Segment, Input, Button, Header, Form, Message } from "semantic-ui-react";

interface Error {
  code: string;
  message: string;
}
interface Props { }
interface State {
  formEmail: string;
  formPassword: string;
  signInLoading: boolean;
  registerLoading: boolean;
  validLogin: boolean;
  error: Error;
}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formEmail: "",
      formPassword: "",
      signInLoading: false,
      registerLoading: false,
      validLogin: false,
      error: {code: "", message: ""}
    };
  }

  register = (email: string, password: string) => {
    this.setState({registerLoading: true});
    firebase.auth().createUserWithEmailAndPassword(email, password).then(
      () => {
        this.setState({validLogin: true});
      }
    ).catch(
      (error: any) => {
        this.setState({error: error});
      }
    );
    this.setState({registerLoading: false});
  }

  signIn = (email: string, password: string) => {
    this.setState({signInLoading: true});
    firebase.auth().signInWithEmailAndPassword(email, password).then(
      () => {
        this.setState({validLogin: true});
      }
    ).catch(
      (error: any) => {
        this.setState({error: error});
      }
    );
    this.setState({signInLoading: false});
  }

  propertyHandler = (field: string) => (e: React.FormEvent<HTMLInputElement>) => {
    let obj = {};
    obj[field] = e.currentTarget.value;
    this.setState(obj);
  }

  errorMessages = {
    "auth/invalid-email": "Please ensure your email address is correct.",
    "auth/user-not-found": "That account does not exist. Click register to create the account.",
    "auth/wrong-password": "Email address or password is incorrect."
  }

  render() {
    const errorMessage = this.errorMessages[this.state.error.code];
    const errorComponent = this.state.error.code !== "" ? 
      (<Message error={true}>
        <p>{ // If I have a custom message, show that. Else, show the firebase error.
          errorMessage !== undefined ?
          errorMessage :
          this.state.error.message
        }</p>
      </Message>) : ""

    if (this.state.validLogin) {
      return (
        <Redirect to="/app/find" />
      );
    } else {
      return (
        <div className="fullheight-flexbox">
          <Segment className="loginPage" raised={true} color="purple" textAlign="center">
            {errorComponent}
            <Header as="h2" textAlign="center">
              Login
            </Header>
            <Form>
              <Form.Input
                value={this.state.formEmail}
                placeholder="Email"
                onChange={this.propertyHandler("formEmail")}
              />
              <Form.Input
                value={this.state.formPassword}
                placeholder="Password"
                type="password"
                onChange={this.propertyHandler("formPassword")}
              />
              <Button.Group className="centered">
                <Form.Button
                  //className="darkButton"
                  color="purple"
                  loading={this.state.registerLoading}
                  onClick={() => this.register(this.state.formEmail, this.state.formPassword)}
                >
                  Register
                </Form.Button>
                <Button.Or/>
                <Form.Button
                  loading={this.state.signInLoading}
                  onClick={() => this.signIn(this.state.formEmail, this.state.formPassword)}
                >
                  Sign In
                </Form.Button>
              </Button.Group>
            </Form>
          </Segment>
        </div>
      );
    }
  }
}