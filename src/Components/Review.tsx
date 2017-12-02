import * as React from "react";
import * as firebase from "firebase";
import { Segment, Input, Button } from "semantic-ui-react";

interface Props {
  fdb: firebase.database.Database;
  toilets: Object[];
}

interface State {}

const ToiletButton = (props: {address: string, gender: string}) => {
  const color = props.gender == "m" ? "blue" : props.gender == "f" ? "red" : "grey";
  const genderIcon = props.gender == "m" ? "male" : props.gender == "f" ? "female" : "intergender";
  return (
    <Button.Group fluid={true} color={color}>
      <Button icon={genderIcon} />
      <Button color={color} basic={true} className="toilet-button">
        {props.address}
      </Button>
      <Button icon="right chevron" />
    </Button.Group>
  );
}


export default class Review extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }


  render() {
    const toiletButtons = this.props.toilets.map((toilet) =>
      <ToiletButton
        key={toilet["key"]}
        address={toilet["data"].address} 
        gender={toilet["data"].gender}
      />
    )

    console.log(toiletButtons);
    return (
      <Segment attached="bottom" className="review">
        <Button className="new-toilet-button" color="yellow">
          Add New Toilet
        </Button>
        {toiletButtons}
      </Segment>
    )
  }
}