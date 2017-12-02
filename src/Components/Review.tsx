import * as React from "react";
import * as firebase from "firebase";
import { Segment, Input, Button } from "semantic-ui-react";

interface Props {
  fdb: firebase.database.Database;
  toilets: Object[];
}

interface State {}

const ToiletButton = (props: {address: string}) => 
  (
    <div className="toilet-button">
      {props.address}
    </div>
  );


export default class Review extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }


  render() {
    const toiletButtons = this.props.toilets.map((toilet) =>
      <ToiletButton key={toilet["key"]} address={toilet["data"].address} />
    )

    console.log(toiletButtons);
    return (
      <Segment attached="bottom" className="review">
        <Button color="yellow">
          Add New Toilet
        </Button>
        {toiletButtons}
      </Segment>
    )
  }
}