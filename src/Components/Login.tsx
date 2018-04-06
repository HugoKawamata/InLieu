/*global google*/
import * as React from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
import { Segment, Input, Button, Header } from "semantic-ui-react";

interface Props { }
interface State {
  formEmail: string;
  formPassword: string;
  signInLoading: boolean;
  registerLoading: boolean;
  validLogin: boolean;
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
        alert(error);
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
        // Handle error
      }
    );
    this.setState({signInLoading: false});
  }

  propertyHandler = (field: string) => (e: React.FormEvent<HTMLInputElement>) => {
    let obj = {};
    obj[field] = e.currentTarget.value;
    this.setState(obj);
  }

  render() {
    if (this.state.validLogin) {
      return (
        <Redirect to="/app/find" />
      );
    } else {
      return (
        <div className="fullheight-flexbox">
          <Segment className="loginPage" raised={true} textAlign="center" color="yellow">
            <Header as="h2" textAlign="center">
              Login
            </Header>
            <div>
              <Input
                value={this.state.formEmail}
                label="Email"
                onChange={this.propertyHandler("formEmail")}
              />
            </div>
            <div>
              <Input
                value={this.state.formPassword}
                label="Password"
                onChange={this.propertyHandler("formPassword")}
              />
            </div>
            <div>
              <Button.Group>
                <Button
                  color="yellow"
                  loading={this.state.registerLoading}
                  onClick={() => this.register(this.state.formEmail, this.state.formPassword)}
                >
                  Register
                </Button>
                <Button.Or/>
                <Button
                  loading={this.state.signInLoading}
                  onClick={() => this.signIn(this.state.formEmail, this.state.formPassword)}
                >
                  Sign In
                </Button>
              </Button.Group>
            </div>
          </Segment>
        </div>
      );
    }
  }
}