import * as React from "react";
import * as firebase from "firebase";
import { Redirect } from "react-router";
import { Segment, Input, Button } from "semantic-ui-react";

interface Props { }
interface State {
  formEmail: string;
  formPassword: string;
  validLogin: boolean;
}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formEmail: "",
      formPassword: "",
      validLogin: false,
    };
  }

  register = (email: string, password: string) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(
      () => {
        this.setState({validLogin: true});
      }
    ).catch(
      (error: any) => {
        alert(error);
      }
    );
  }

  signIn = (email: string, password: string) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then(
      () => {
        this.setState({validLogin: true});
      }
    ).catch(
      (error: any) => {
        // Handle error
      }
    );
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
        <Segment className="loginPage" raised={true}>
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
            <Button
              onClick={() => this.register(this.state.formEmail, this.state.formPassword)}
            >
              Register
            </Button>
            <Button
              onClick={() => this.signIn(this.state.formEmail, this.state.formPassword)}
            >
              Sign In
            </Button>
          </div>
        </Segment>
      );
    }
  }
}